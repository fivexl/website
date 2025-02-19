---
title: 'Unexpectedly Hard: Overcoming Pitfalls in aws_acm_certificate setup'
author_id: 'Alexey Eremin'
summary: 'Encountering the “Invalid for_each argument” and “UnsupportedCertificate” errors when configuring AWS ACM certificates via Terraform is surprisingly common. By removing dynamic for_each logic based on unknown attributes and using the aws_acm_certificate_validation resource to wait for certificate issuance, you can sidestep these pitfalls and ensure successful integration with resources like ELB listeners.'
date: 2025-02-19
author: Alexey Eremin
panel_image: Lesha.png
tags: [ 'ACM','Route53', 'AWS']
---

If you’ve ever validated an ACM certificate with Terraform, you’ve likely used a snippet like this:
```hcl
resource "aws_acm_certificate" "this" {
  domain_name       = "*.${data.aws_route53_zone.this.name}"
  validation_method = "DNS"
}

resource "aws_route53_record" "certificate_validation" { 
  for_each = {
    for dvo in try(aws_acm_certificate.this.domain_validation_options, {}) : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.this.zone_id
}
```
And even though it seems like it should work, it fails two different ways:
- `Error: Invalid for_each argument`
- `Error: UnsupportedCertificate: PENDING_VALIDATION`

## Error: Invalid for_each argument
```bash
│   on ../shared/acm.tf line 30, in resource "aws_route53_record" "certificate_validation":
│   30:   for_each = {
│   31:     for dvo in try(aws_acm_certificate.this.domain_validation_options, {}) : dvo.domain_name => {
│   32:       name   = dvo.resource_record_name
│   33:       record = dvo.resource_record_value
│   34:       type   = dvo.resource_record_type
│   35:     }
│   36:   }
│     ├────────────────
│     │ aws_acm_certificate.this.domain_validation_options is set of object with 1 element
│ 
│ The "for_each" map includes keys derived from resource attributes that cannot be determined
│ until apply, and so Terraform cannot determine the full set of keys that will identify the
│ instances of this resource.
│ 
│ When working with unknown values in for_each, it's better to define the map keys statically
│ in your configuration and place apply-time results only in the map values.
│ 
│ Alternatively, you could use the -target planning option to first apply only the resources
│ that the for_each value depends on, and then apply a second time to fully converge.
```
This happens because of `for_each` - number of records depends on the number of `.domain_validation_options`, which are not known until the certificate is created. One way to fix this is to avoid using it and create a single record for the first domain validation option:
```hcl
resource "aws_acm_certificate" "this" {
  domain_name       = "*.${data.aws_route53_zone.this.name}"
  validation_method = "DNS"
}

locals {
  certificate_validation_options = tolist(aws_acm_certificate.this.domain_validation_options)[0]
}

resource "aws_route53_record" "certificate_validation" {
  allow_overwrite = true

  ttl     = 60
  name    = local.certificate_validation_options.resource_record_name
  records = [local.certificate_validation_options.resource_record_value]
  type    = local.certificate_validation_options.resource_record_type

  zone_id = data.aws_route53_zone.this.zone_id
}
```

## Error: UnsupportedCertificate
```bash
Error: creating ELBv2 Listener: operation error Elastic Load Balancing v2: CreateListener, api error UnsupportedCertificate: The certificate 'arn:aws:acm:us-east-1:123456789101:certificate/c1a6175f-c93c-4c27-b272-f8787ac9ac6c' must have a fully-qualified domain name, a supported signature, and a supported key size.
```
This is not very specific, but we can check the certificate status to see if it’s validated.
```bash
aws acm describe-certificate \
    --certificate-arn arn:aws:acm:us-east-1:123456789101:certificate/c1a6175f-c93c-4c27-b272-f8787ac9ac6c \
```
```json
{
    "Certificate": {
        "CertificateArn": "arn:aws:acm:us-east-1:123456789101:certificate/c1a6175f-c93c-4c27-b272-f8787ac9ac6c",
        "DomainValidationOptions": [
            {
                "ValidationStatus": "PENDING_VALIDATION",
            }
        ]
    }
}
```
This happens because terraform doesn't wait for the certificate to be validated before proceeding. In this case, the certificate is still pending validation, and the ELBv2 listener creation fails.

### Solution: Use aws_acm_certificate_validation resource
```hcl
resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [aws_route53_record.primary_domain_certificate_validation.fqdn]
}
```
This is not a real-world entity existing in AWS, but a Terraform resource that waits for the certificate to be validated. 

So, wherever you need the certificate ARN (e.g., when creating a listener), reference:
```hcl
certificate_arn = aws_acm_certificate_validation.this.certificate_arn
```
instead of:
```hcl
certificate_arn = aws_acm_certificate.this.arn
```
This change will force the Terraform to respect the validation process and only proceed once the certificate is validated.


# Final, working code

```hcl
resource "aws_acm_certificate" "this" {
  domain_name       = "*.${data.aws_route53_zone.this.name}"
  validation_method = "DNS"
}

locals {
  certificate_validation_options = tolist(aws_acm_certificate.this.domain_validation_options)[0]
}

resource "aws_route53_record" "certificate_validation" {
  provider        = aws.dns
  allow_overwrite = true

  ttl     = 60
  name    = local.certificate_validation_options.resource_record_name
  records = [local.certificate_validation_options.resource_record_value]
  type    = local.certificate_validation_options.resource_record_type

  zone_id = data.aws_route53_zone.this.zone_id
}

resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [aws_route53_record.certificate_validation.fqdn]
}
```