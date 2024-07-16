---
title: 'Keeping your data secure in transit with ECS Service Connect'
author_id: 'Andrey Devyatkin'
summary: 'Deep-dive into AWS ECS Service Connect. How startup can enable encryption in transit with ECS Service Connect and ECS Fargate deployment'
date: 2024-07-15
author: Andrey Devyatkin
panel_image: ECS.png
tags: ['AWS', 'ECS', 'ECS Service Conncet']
---

<iframe width="840" height="472" src="https://www.youtube.com/embed/z1WQ-YSAsVY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<br>
</br>  

Startups in highly regulated industries such as FinTech and Healthcare are no strangers to compliance requirements, especially regarding encryption at rest and in transit. There are many new regulations (like EU’s Digital Operational Resilience Act, Network and Information Security Directive, and US Cybersecurity Framework 2.0) coming into force this and next year that will wildly expand the application of encryption requirements to many other industries. This means that many more startups would have to be able to demonstrate a strong security posture to the governments as well as potential business/integration partners.  
  
AWS ECS/Fargate is a fully managed container orchestrator that allows rapid deployment of new microservices and requires minimal maintenance, as AWS handles patching of the underlying infrastructure and addresses compliance requirements. However, implementing encryption in transit for ECS Fargate-based services was challenging, as it previously required using AppMesh or third-party solutions. AppMesh is an advanced service mesh solution offering a lot of network traffic shaping functions and integrations. However, all those super powers come at a cost of the complexity of their configuration and maintanance. Thus, it was very welcome news when in January 2024, AWS announced ECS Service Connect support for automatic traffic encryption with [TLS Certificates](https://aws.amazon.com/about-aws/whats-new/2024/01/amazon-ecs-service-connect-automatic-traffic-encryption-tls-certificates/) 

FivexL works with startups for whom time to market (how quickly a feature can be implemented), maintenance requirements (the time needed to maintain solutions), and infrastructure costs are the most important considerations when choosing an infrastructure platform. FivexL has already implemented ECS Connect traffic encryption for some of its customers who value cutting-edge technology for defense in depth. However, we encountered a scarcity of documentation and blog posts during the implementation, so this blog post aims to facilitate adoption for the broader community.  

## What is ECS Service Connect?  
Amazon ECS Service Connect provides management of service-to-service communication as part of Amazon ECS configuration. It builds both service discovery and a service mesh in Amazon ECS. This provides the complete configuration inside each service, a unified way to refer to other services within namespaces that don't depend on the VPC DNS configuration, and standardized metrics and logs to monitor all of ECS applications. Service Connect only interconnects ECS services.  
## Deployment scenarios  
Let’s imagine we have a typical deployment, illustrated below.  
{{< image src="ECS1.png" alt="Deplyment Scenario" width="100%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
Communication from outside the VPC to the Application Load Balancer is encrypted. However, traffic from the load balancer to the target service and communication between services and the database are not encrypted. This is a common scenario that we often observe when conducting AWS infrastructure assessments for startups.  
## Service-to-service communication  
{{< image src="ecs2.png" alt="Deplyment Scenario" width="100%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}  
The first scenario is the most straightforward that ECS Service Connect is designed to address - communication between two ECS Connect-enabled ECS tasks. Turning on ECS Connect will inject an Envoy proxy sidecar during task startup. You do not need to describe sidecar in the task definition and update ECS execution role to allow pulling of the image. Everything is automatically handled by AWS. This sidecar intercepts outgoing traffic and routes it to the other ECS services. It uses AWS CloudMap API-based service discovery to find the IP addresses of the service that correspond to the service name you used, and it will send traffic there. When you enable encryption in transit, on top of the actions described above, it will also encrypt traffic between two ECS services without the services themselves being aware. You can still call another service via HTTP, and traffic will still be encrypted by the sidecar when it leaves the service. Easy-peasy.  
  
In the example above, Service B will have to be configured in a ECS Service Connect server-client thus ECS will issue it a certificate that will be used for traffic encryption. Pay attention to the fact that for this to work, Service A needs to be registered in ECS Service Connect, at least in client mode, so it can resolve Service B's IP addresses and establish encrypted connection. Service A doesn’t need to be registered in server-client mode and receive its own certificate for a secure connection between Service A and Service B to work. Only Service B needs to have encryption on. Leaving Service A in ECS Connect client mode allows the load balancer to connect to Service A as before, requiring no changes for ALB configuration.  
## Application load balancer to service  
{{< image src="ECS3.png" alt="Deplyment Scenario" width="100%" align="left" style="border-radius: 10px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}} 
It is also possible to use ECS Service Connect and its encryption capabilities to secure traffic between the load balancer and its targets. For this to work, Service A should be deployed in ECS Service Connect server-client mode, i.e., it should register itself with ECS Service Connect as a server so ECS would issue a certificate for it in Private CA. However, if you do that you would also need to update your load balancer settings. First of all, the target group protocol as well as the target group health check protocol, needs to be changed from HTTP to HTTPS. Another important thing to check is the load balancer listener security policy - you have to make sure that your security policy is TLS 1.3 based because of how security policy is determined for the load balancer target health checks. Here is the official documentation - make sure to read it carefully since it will save you a lot of time troubleshooting health check issues.  
*When a target group is configured with the HTTPS protocol or uses HTTPS health checks, if any HTTPS listener is using a TLS 1.3 security policy, the ELBSecurityPolicy-TLS13-1-0-2021-06 security policy will be used for target connections. Otherwise, the ELBSecurityPolicy-2016-08 security policy is used. The load balancer establishes TLS connections with the targets using certificates that you install on the targets. The load balancer does not validate these certificates. Therefore, you can use self-signed certificates or certificates that have expired. Because the load balancer, and its targets are in a virtual private cloud (VPC), traffic between the load balancer and the targets is authenticated at the packet level, so it is not at risk of man-in-the-middle attacks or spoofing even if the certificates on the targets are not valid. Traffic that leaves AWS will not have these same protections, and additional steps may be needed to secure traffic further*.  
For more details, [see](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#target-group-routing-configuration)  
 ECS Service Connect requires TLS 1.3, so it is important to choose the security policy for the frontend services. Otherwise, you will get TLS negotiation errors for your target group health checks, which are quite hard to troubleshoot. You can compare security policies [here](https://docs.aws.amazon.com/privateca/latest/userguide/supported-algorithms.html) 
## Network load balancer to service  
This scenario is very similar to the one described above for Application Load Balancer. However, there are differences. You still need to register Service A in a client-server mode so it gets its certificate. As for the Network Load Balancer, you would need to switch the health check to TCP mode. We tried to get HTTPS to work, but, according to AWS Support team, NLB health check performs strict TLS verification, and certificates from Private CA won’t pass since CA is unknown to the load balancer. This means that you do not need to modify NLB’s security policy.  
## ECS to something else  
The final case we will examine is when traffic originates from an ECS Connect-enabled ECS service but flows towards a non-ECS target, such as an RDS database or another load balancer. In those cases, ECS Service Connect provides no benefit since it is the target that has to provide a TLS endpoint.  
## Considerations when deploying ECS Service Connect  
With the high-level details out of the way, let’s focus on the technical implementation aspect of ECS Service Connect and encryption in transit.  
  
When you enable ECS Service Connect, ECS will add a fully managed Envoy-based sidecar to your task definition when the task starts. This sidecar intercepts outgoing and incoming traffic and helps with service discovery using the AWS CloudMap API. Typically AWS CloudMap is used with ECS for service discovery in DNS mode, i.e. each ECS service would have a VPC-private DNS name that would resolve to its tasks ip addresses. ECS Service Connect works with CloudMap in API mode instead. In this mode there are no VPC private DNS names registered per service and one would have to call CloudMap API to resolve ip addresses of the service (done by ECS Service Connect sidecar). Developers might be relying for CloudMap DNS names to connec to services for debug purposes and they would have to use ip addresses instead. ECS also manages the AWS CloudMap service discovery instances, so if you've pre-created them using infrastructure as code (IaC), you'll need to delete the service discovery instance before enabling Service Connect otherwise ECS will fail to enable Service Connect.  
  
We encountered an issue with the way ECS Service Connect handles service discovery. The list of services registered with ECS Service Connect seems only fetched once when the task starts. This means that if you add a service later on, the currently running services won't be able to find it, requiring a redeployment or restart of the tasks that depend on the new service. AWS may address this issue in the future, but as of the current date (July 2024), the issue still persists.  
  
When using the awsvpc networking mode for ECS tasks, which is the only option for ECS Fargate, you are limited to supporting only HTTP/HTTPS and gRPC protocols in ECS Service Connect. If you need to use other protocols, such as TCP, you must register your TCP services in an ECS Service Connect client-mode. This means you will still get a sidecar that can handle DNS resolution and egress traffic to other ECS Service Connect services, but it will not handle ingress traffic and will not register this service in AWS CloudMap. Therefore, you would need to create a service discovery instance independently.
## ECS Service Connect encryption-in-transit  
ECS Service Connect encryption in transit relies on AWS Private CA and short-lived certificates. This is good news since Private CA in short-lived certificate mode is only 50 USD per month compared to the standard offering with long-lived certificates (400 USD per month).
The Terraform code below describes Private CA with all configurations required for ECS Service Connect encryption to work.
```hcl
# Private CA to be used with ECS Service Connect for traffic encryption
resource "aws_acmpca_certificate_authority" "ecs_ue1" {

  provider = aws.us-east-1

  enabled = true

 # ECS Service Connect supports both short-lived and long-lived certs, but short-lived are way cheaper
  usage_mode = “SHORT_LIVED_CERTIFICATE”
  type                = "ROOT"

  certificate_authority_configuration {
    key_algorithm        = “EC_secp384r1”
    signing_algorithm = “SHA512WITHECDSA”

    subject {
     # in my understanding, it does not really matter what you have here when it comes to ECS Service Connect
     # encryption in transit. 
      common_name = “ecs.ame.com”     }
  }

  revocation_configuration {
    ocsp_configuration {
     # ECS Service Connect does not support revocation thus, we rely on short-lived certs instead
      enabled = false
    }
  }

# Additional tags required by https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-awsmanpol.html#security-iam-awsmanpol-AmazonECSInfrastructureRolePolicyForServiceConnectTransportLayerSecurity
  ca_tags = merge(
    var.tags,
    {
      "AmazonECSManaged" = "true"
    }
  )
}

  tags = merge(
    var.tags,
    {
      "AmazonECSManaged" = "true"
    }
  )
}

resource "aws_acmpca_certificate" "ue1" {

  provider = aws.us-east-1

  certificate_authority_arn   = aws_acmpca_certificate_authority.ecs_ue1.arn
  certificate_signing_request = aws_acmpca_certificate_authority.ecs_ue1.certificate_signing_request
  signing_algorithm           = local.signing_algorithm

  template_arn = "arn:aws:acm-pca:::template/RootCACertificate/V1"

  validity {
    type  = "YEARS"
    value = 10
  }
}

resource "aws_acmpca_certificate_authority_certificate" "ue1" {

  provider = aws.us-east-1

  certificate_authority_arn = aws_acmpca_certificate_authority.ecs_ue1.arn

  certificate       = aws_acmpca_certificate.ue1.certificate
  certificate_chain = aws_acmpca_certificate.ue1.certificate_chain
}
```

If you use a [multi-account strategy](https://www.youtube.com/live/JBcwjP6HIZc?feature=shared), which we strongly recommend, you might want to reuse Private CA between accounts to save money and centralize certificate management.
The Terraform code below shows how to share Private CA with organizational units. In the FivexLs approach to the multi-account strategy, we recommend creating one PrivateCA per environment (development/stage/production). Want to learn more about FivexL’s multi-account strategy and FivexL’s Landing Zone, a.k.a. [RightStart for AWS](https://aws.amazon.com/marketplace/pp/prodview-d4lown4cemykw?sr=0-2&ref_=beagle&applicationId=AWSMPContessa).  
```hcl
resource "aws_ram_resource_share" "ca_ue1" {
  provider                  = aws.us-east-1
  name                      = "ecs-private-ca"
  allow_external_principals = false
}

resource "aws_ram_resource_association" "ca_ue1" {
  provider           = aws.us-east-1
  resource_arn       = aws_acmpca_certificate_authority.ecs_ue1.arn
  resource_share_arn = aws_ram_resource_share.ca_ue1.arn
}

resource "aws_ram_principal_association" "ca_ue1" {
  provider           = aws.us-east-1
  principal          = var.ou # here you would have an OU path
  resource_share_arn = aws_ram_resource_share.ca_ue1.arn
}
```
Now, it is time to switch to the actual AWS account, where you can deploy ECS workloads and finalize preparations. First, we need a service role allowing ECS to access PrivateCA, issue certificates, and manage Secrets Manager. When ECS issues a certificate, it will create a SecretsManager secret to store it and load it to the ECS connect agent. It comes as a little bit of a hidden cost since you will incur an additional 1 USD (a cost of a secret)  per month for every ECS service that has encryption in transit enabled. You only need one role per AWS account, no need to create a role per service.  
```hcl
module "tls_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role"
  version = "5.2.0"

  create_role = true

  role_name         = "ServiceRoleForECSConnectTLS"
  role_description  = "ECS service role to access Private CA for TLS Service Connect"
  role_requires_mfa = false

  custom_role_policy_arns = ["arn:aws:iam::aws:policy/service-role/AmazonECSInfrastructureRolePolicyForServiceConnectTransportLayerSecurity"]

  trusted_role_services = ["ecs.amazonaws.com"]

  tags = var.tags
}
```
The final step is to update your service definition to enable encryption in transit. Add the following block to the service definition.  
```hcl
  dynamic "service_connect_configuration" {
    for_each = var.enable_service_connect ? [var.service_name] : []

    content {
      enabled = true

      log_configuration {
        log_driver = "awslogs"
        options = {
          awslogs-region        = data.aws_region.current.name
          awslogs-group         = aws_cloudwatch_log_group.this.name
          awslogs-stream-prefix = "/ecs-connect"
        }
      }

      namespace = var.service_discovery_namespace_name

      dynamic "service" {

        for_each = var.service_connect_register_server ? [var.service_name] : []

        content {
          client_alias {
            dns_name = "${var.service_name}.${var.service_discovery_namespace_name}"
            port     = var.service_port
          }
          discovery_name = var.service_name
          port_name      = var.service_container_port_name

          dynamic "tls" {
            for_each = var.enable_service_connect_tls ? [var.service_name] : []

            content {
              issuer_cert_authority {
                aws_pca_authority_arn = data.aws_ram_resource_share.pca[0].resource_arns[0]
              }
              role_arn = data.aws_iam_role.tls[0].arn
            }
          }
        }
      }
    }
```
That is it! Not very complicated, isn’t it? Well, if it is then there is a perfect open source [ECS service Terraform module](https://github.com/terraform-aws-modules/terraform-aws-ecs) that can handle it for you.
## Testing  
Let’s verify that encryption actually works. For that, we would need to capture traffic between ECS services. It could be as easy as running Wireshark on an EC2 instance hosting ECS tasks. But in the case of ECS tasks running on Fargate, things are more complicated.
To overcome this challenge, let’s use VPC traffic mirroring. With VPC traffic mirroring, a copy of all the packets destined for ENI can be sent to another target, like EC2. On that EC2, we can run Wireshark or tcpdump and capture packets for analysis as usual.
To set it up, you must find your task's ENI ID, create an EC2 instance, and get its ENI.
```hcl
export TESTER_ENI=eni-0c643292ce0c2cd45
export CONTAINER_ENI=eni-0262dc2b95b2d2398
export VNI=1026414
export VPC_ID=$(aws ec2 describe-network-interfaces --network-interface-ids $CONTAINER_ENI --query "NetworkInterfaces[0].VpcId" --output text)
export CONTAINER_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $CONTAINER_ENI --query "NetworkInterfaces[0].PrivateIpAddress" --output text)
export SG_ID=$(aws ec2 create-security-group --group-name encryption-tester --description "SG to test ECS Connect Encryption" --vpc-id ${VPC_ID} --query GroupId --output text)
aws ec2 authorize-security-group-ingress --cidr "${CONTAINER_IP}/32" --group-id $SG_ID --protocol udp --port 4789
export FILTER_ID=$(aws ec2 create-traffic-mirror-filter --query TrafficMirrorFilter.TrafficMirrorFilterId --output text)
aws ec2 create-traffic-mirror-filter-rule --destination-cidr-block "0.0.0.0/0" --source-cidr-block "0.0.0.0/0" --traffic-direction ingress --traffic-mirror-filter-id ${FILTER_ID} --rule-action accept --rule-number 100
aws ec2 create-traffic-mirror-filter-rule --destination-cidr-block "0.0.0.0/0" --source-cidr-block "0.0.0.0/0" --traffic-direction egress --traffic-mirror-filter-id ${FILTER_ID} --rule-action accept --rule-number 100
export TARGET_ID=$(aws ec2 create-traffic-mirror-target --network-interface-id ${TESTER_ENI} --query TrafficMirrorTarget.TrafficMirrorTargetId --output text)
aws ec2 create-traffic-mirror-session --network-interface-id ${CONTAINER_ENI} --traffic-mirror-target-id ${TARGET_ID} --session-number 1 --traffic-mirror-filter-id ${FILTER_ID}  --virtual-network-id ${VNI}
# Clean up
aws ec2 delete-traffic-mirror-session --traffic-mirror-session-id ${SESSION_ID}
aws ec2 delete-traffic-mirror-target --traffic-mirror-target-id ${TARGET_ID}
aws ec2 delete-traffic-mirror-filter --traffic-mirror-filter-i
```
