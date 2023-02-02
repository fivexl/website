---
title: Kitchensink
layout: landing_page
double_panel:
  heading: "WE BUILD INFRASTRUCTURE IN AWS"
  subheading: "TO EMPOWER YOUR IDEAS"
  icon_links:
    - { url: "/home", icon: "github" }
    - { url: "/home", icon: "linkedin" }
    - { url: "/home", icon: "email" }
  button_cta: { url: "/#contact", text: "Book a consultation" }
  media_panel: { image: "/testemonials-4.png" }
---
Adding a frontmatter entry with:
```
layout: landing_page
```
Will toggle the use of the landing page layout, more generally, all shortcodes placed here can be use anywhere on the site, though some layouts might not behave correctly, however the following are safe to use pretty much anywhere:
- icon_link
- pink_heading
- blue_heading
- button_cta


The media_panel in the frontmatter, accepts two properties: **url**, **image**.

If **image** is present then url, becomes a wrapping link around the image to navigate to a different target.

Otherwise only **url** is necessary to populate the media_panel with either a youtube or vimeo video (each of this two have special handling), if none of the previous sites is inferreded from the input, it is rendered raw openning up to use embed codes from any other possible source.

Use the "md" shortcode to wrap/render blocks of content within any section. 

Also please note that the closing segment of wrapping shortcodes need to be prepended with a **"/"**

{{< split_section image="/who-fivexl-with-circle.png" heading="FivexL - Cloud Engineering Specialists." heading_color="pink" >}}
{{< md >}}
#### ADD FIVEXL MAGIC TO YOUR CLOUD INFRASTRUCTURE

Strong security base for your future scale and growth.

Infrastructure as code which prevents human mistakes.

Costs optimization on AWS.

Identification of potential system bottlenecks and proactively prevent issues from arising.

Agile, transparency, and comprehensive documentation for effective knowledge transfer.
{{< /md >}}
{{< /split_section >}}


{{< case_studies heading="dyanmic heading" global="true" >}}


{{< section >}}
{{< button_cta url="/#contact" text="Book a consultation" >}}

{{< md >}}
### OUR TEAM
At FivexL we’re focused on being the best at what we do as a small, remote first and agile team.

Work with any of us and you will have the support of the whole team. With more than 50+ years of combined multidisciplinary expertise in cloud engineering. 

There’s no problem that we can’t solve together!
{{< /md >}}

{{< image src="/testemonials-4.png" width="100%" style="max-height: 500px !important; width: 100%; object-fit: cover;">}}

{{< md >}}### HOW IT WORK{{< /md >}}

{{< button_cta url="/booking" text="Book a consultation" >}}

{{< md >}}
1. Initial meeting to discuss business goals and obstacles.
2. Creating proposal. Fixed fee offer with no hidden costs. Presenting infrastructure plan with implementation stages.
3. Conducting audit, identify of potential system bottlenecks
4. Architecting cloud infrastructure from the ground up. We build what you need for your current state and ensure you're ready to scale quickly.
5. Providing AWS security with zero-trust networking, dynamic credentials, consolidation of secrets. Our goal is to give developers secure infrastructure and tools for handling sensitive data safely.
6. Optimisation AWS bills and reducing monthly costs.
7. Providing cloud engineering training for your team or assist with hiring.
{{< /md >}}

{{< blue_heading text="This way, you can focus on what you do best without worrying about the underlying infrastructure." big="big" >}}

{{< /section >}}


<!-- {{< case_studies heading="dyanmic heading" global="true" >}} -->


