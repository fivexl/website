---
title: 'FivexL Retainer Plans'
summary: 'Tailored support plans for existing FivexL customers. Choose between Keep the Lights On for infrastructure maintenance or Trusted Advisor for team empowerment and guidance.'
date: 2025-12-12
url: "/retainer/"
type: "retainer"
layout: "single"
_build:
  render: always
  list: always
  publishResources: true
transparent_nav: true
callout_cta_heading: "Ready to secure ongoing support for your infrastructure?"
callout_cta_url: "#retainer-popup"
callout_cta_text: "Get a Retainer Quote"
double_panel:
  layout: 'services'
  heading: "FivexL Retainer Plans"
  subheading: "Continued Success for Our Valued Customers"
  icon_links:
    - { url: "https://github.com/fivexl", icon: "github" }
    - { url: "https://www.linkedin.com/company/5xl", icon: "linkedin" }
  button_cta: { url: "#retainer-popup", text: "Get a Retainer Quote" }
  media_panel: { image: "/contact/featured.png" }
---

{{< our_team heading="Retainer Plans for Existing Customers" cta_url="#retainer-popup" cta_text="Get a Retainer Quote" >}}
{{< md >}}
After successfully completing a fixed-price project or a full-time consulting engagement with FivexL, we're committed to ensuring your continued success.

Our Retainer Plans are specially designed for our existing customers, offering tailored support that ranges depending on your needs. Explore our comparison below to identify the plan that aligns seamlessly with your ongoing needs.
{{< /md >}}
{{< /our_team >}}

{{< two_columns heading="Keep the Lights On" >}}
{{< column >}}
### What's Included
This plan is your startup's "health insurance" for infrastructure. Designed for organizations that have limited AWS expertise, it ensures that a professional keeps an eye on your stable infrastructure, so you don't have to.

If you have no dedicated infrastructure team and expect minimal changes, this plan will take the worry out of your hands, allowing you to focus on what you do best.
{{< /column >}}

{{< column >}}
- **Professional Oversight:** Better an expert for an hour a week than a full-timer who might break things.
- **Steady State Maintenance:** Ideal for businesses expecting no infra changes in the near future.
- **Security Patching:** Rest easy, knowing your security is regularly updated.
- **Keep Infrastructure Running:** Never worry about downtime.
- **Prevent Configuration Drift:** Maintain system consistency.
- **Incident Support:** If anything goes wrong, you have someone to call.
- **Response Time:** 24-48 hours via Slack/Email.
{{< /column >}}
{{< /two_columns >}}

{{< two_columns heading="Trusted Advisor" >}}
{{< column >}}
### What's Included
Designed for startups with an existing infrastructure team, this plan focuses on the ongoing development and maintenance of larger deployments.

As a business owner with a team of mid-level DevOps specialists, you need someone to guide them, prevent bad decisions, and provide advanced knowledge. Time is precious, and diving into small details of infrastructure or continuously learning new things is hard when operating needs take precedence.
{{< /column >}}

{{< column >}}
- **Empower Your Team:** Training, expert insights, and advanced knowledge bridge the gap, allowing your team to flourish.
- **Support Architectural Decisions:** Steer clear of bad decisions with guidance on critical choices.
- **Code Reviews & Backlog Grooming:** Maintain quality and keep priorities on track without wasting time.
- **Comprehensive Guidance:** Full support in planning and implementing, like having an extra CTO on hand.
- **Quarterly AWS Infra Scan:** Scans for misconfigurations, security issues, and deviations from best practices.
- **Response Time:** Fast 24-48 hours support via Slack/Email.
{{< /column >}}
{{< /two_columns >}}

{{< unsafe >}}
<section class="retainer-table-section">
  <div class="retainer-table-container">
    <h2 class="twc-Heading retainer-table-heading">Plan Comparison</h2>
    <div class="retainer-table-wrapper">
      <table class="retainer-table">
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Keep the Lights On</th>
            <th>Trusted Advisor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="retainer-table-criteria">Staffing Needs</td>
            <td>Ideal for startups with no dedicated infra team, small infrastructure setup, and infrequent changes.</td>
            <td>Best suited for startups with an existing infra team, larger deployments, and frequent infrastructure changes.</td>
          </tr>
          <tr>
            <td class="retainer-table-criteria">Plan's Core Purpose</td>
            <td>Keep infrastructure running, timely updates of packages and modules, prevent configuration drift, and support during incidents.</td>
            <td>Empower and train your in-house team, provide expert insights, support architectural decision-making, perform code reviews, backlog groomings, etc.</td>
          </tr>
          <tr>
            <td class="retainer-table-criteria">Major Infrastructure Changes</td>
            <td>Not included. For significant changes, reach out to purchase fixed projects and additional hours.</td>
            <td>Comprehensive guidance throughout architectural planning, with support in implementation via code reviews and the proposal of innovative solutions.</td>
          </tr>
          <tr>
            <td class="retainer-table-criteria">Availability & Support</td>
            <td>Typically dedicated to one day weekly, with flexibility for additional hours as required; Responses via Slack/Email within 24-48 hours.</td>
            <td>Consolidated meetings set for one specific day each week; Responses via Slack/Email within 24-48 hours.</td>
          </tr>
          <tr>
            <td class="retainer-table-criteria">Quarterly AWS Infra Scan</td>
            <td>Not included.</td>
            <td>Scans for misconfigurations, security issues, and deviations from best practices.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="retainer-table-footnote">
      * Excluding weekends, public holidays. FivexL will do its best to adjust and be available during working hours in the customer's time zone.<br/>
      Each package is sold per yearly-quarter, with the option to renew after every three months. Enjoy a 20% subscription discount when purchasing an annual subscription.
    </p>
  </div>
</section>
{{< /unsafe >}}

{{< unsafe >}}
<!-- Retainer Quote Popup Modal -->
<div id="retainer-popup" class="retainer-popup-overlay">
  <div class="retainer-popup-content">
    <button id="retainer-popup-close" class="retainer-popup-close">&times;</button>
    <div class="retainer-popup-body">
      <h2 class="retainer-popup-title">Get a Retainer Quote</h2>
      <p class="retainer-popup-subtitle">Tell us about your infrastructure needs and we'll get back to you shortly.</p>
      <div id="retainer-hubspot-form"></div>
    </div>
  </div>
</div>

<script charset="utf-8" type="text/javascript" src="//js-eu1.hsforms.net/forms/embed/v2.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  var popup = document.getElementById('retainer-popup');
  var closeBtn = document.getElementById('retainer-popup-close');
  var formLoaded = false;
  
  // Open popup when clicking any link with href="#retainer-popup"
  document.querySelectorAll('a[href="#retainer-popup"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      popup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Load HubSpot form only once
      if (!formLoaded && typeof hbspt !== 'undefined') {
        hbspt.forms.create({
          portalId: "27182258",
          formId: "8f7dd096-a9c9-4f6d-8d17-cc579f33a1da",
          region: "eu1",
          target: "#retainer-hubspot-form"
        });
        formLoaded = true;
      }
    });
  });
  
  // Close popup
  function closePopup() {
    popup.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  closeBtn.addEventListener('click', closePopup);
  
  // Close on overlay click
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      closePopup();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.style.display === 'flex') {
      closePopup();
    }
  });
});
</script>
{{< /unsafe >}}

