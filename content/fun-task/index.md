---
title: 'FivexL Consulting Service - Terraform Challenge'
summary: 'A technical challenge to demonstrate your AWS and Terraform skills by researching and implementing website hosting solutions.'
date: 2025-12-09
url: "/fun-task/"
type: "fun-task"
layout: "single"
_build:
  render: always
  list: always
  publishResources: true
transparent_nav: true
double_panel:
  layout: 'services'
  heading: "FivexL Consulting Service"
  subheading: "Terraform Challenge"
  icon_links:
    - { url: "https://github.com/fivexl", icon: "github" }
    - { url: "https://www.linkedin.com/company/5xl", icon: "linkedin" }
  media_panel: { image: "/contact/featured.png" }
---

{{< two_columns heading="The Challenge" >}}
{{< column >}}
### Website Hosting on AWS

There are many ways to serve websites on AWS. Your goal is to do research and pick two ways. You should be able to explain the reasons for your choice and why you decided against others.
{{< /column >}}

{{< column >}}
### Show Your Skills

This challenge is designed to demonstrate your understanding of AWS infrastructure, Terraform, and best practices for production deployments.
{{< /column >}}
{{< /two_columns >}}

{{< unsafe >}}
<section class="ic-section">
  <div class="ic-container">
    <h2 class="twc-Heading ic-heading">Requirements</h2>
    <div class="ic-benefits">
      <div>
        <p class="ic-benefit"><strong class="ic-benefit-title">Terraform Infrastructure</strong><br/>
        <span class="ic-benefit-text">You should provision all necessary infra using Terraform.</span></p>
        
        <p class="ic-benefit"><strong class="ic-benefit-title">Remote State</strong><br/>
        <span class="ic-benefit-text">You should not store Terraform state locally. Pick any supported backend.</span></p>
        
        <p class="ic-benefit"><strong class="ic-benefit-title">Auto Redeployment</strong><br/>
        <span class="ic-benefit-text">Changes to HTML should cause redeployment.</span></p>
        
        <p class="ic-benefit"><strong class="ic-benefit-title">Stable Endpoints</strong><br/>
        <span class="ic-benefit-text">DNS name or IP address should stay the same after redeployment.</span></p>
      </div>
      <div>
        <p class="ic-benefit"><strong class="ic-benefit-title">TLS (Optional)</strong><br/>
        <span class="ic-benefit-text">TLS is optional but recommended for production-like setups.</span></p>
        
        <p class="ic-benefit"><strong class="ic-benefit-title">Multi-Account Support</strong><br/>
        <span class="ic-benefit-text">You should be able to deploy the same code into two different AWS accounts (think dev and prod). There should be a possibility to specify different parameters between accounts. For instance, the name of the SSH key if you are to go with EC2.</span></p>
        
        <p class="ic-benefit"><strong class="ic-benefit-title">GitHub Repository</strong><br/>
        <span class="ic-benefit-text">Please store Terraform code on GitHub and share a link to the repo with us.</span></p>
        
        <p class="ic-benefit"><strong class="ic-benefit-title">CI Setup (Optional)</strong><br/>
        <span class="ic-benefit-text">CI setup is optional but will be considered a plus.</span></p>
      </div>
    </div>
  </div>
</section>
{{< /unsafe >}}
