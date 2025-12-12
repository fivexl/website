---
title: "Want to be a part of FivexL?"
description: "We architect and build scalable cloud-based production-ready application delivery platforms for startups so they can launch fast."
menu:
  main:
    name: Career
    weight: 40
    url: /career
double_panel:
  layout: 'services'
  heading: "Join Us"
  subheading: "FivexL: Where Your Skills Help Startups Excel with AWS Infrastructure"
  icon_links:
    - { url: "https://github.com/fivexl", icon: "github" }
    - { url: "https://www.linkedin.com/company/5xl", icon: "linkedin" }
  
  media_panel: { url: "https://youtu.be/uruLy1goNW0" }
transparent_nav: true
images: [ 'featured.png' ]
---
{{< our_team heading="About FivexL" cta_url="#application-form" cta_text="Join us!" >}}
{{< md >}}Being the only specialist in the room can feel lonely.
You’re the one people call when “something with the cloud broke,” but almost no one really understands what you do or how hard it is to do it well.<br />

We've been there: working in outsourcing, grinding through projects you didn't choose, with tech stacks you'd never pick for yourself. Babysitting fragile, legacy infrastructure while the rest of the world plays with shiny new tools.

That’s why we created FivexL — a place we ourselves would want to work.
**A company built for people who care about doing infrastructure properly, learning constantly, and having a real say in how things are done.**

FivexL isn’t for everyone. It’s for people who combine ambition, skill, and ownership — the ones who want impact, not just tickets.

If that sounds like you, there’s a good chance you’ll feel at home here.
{{< /md >}}
{{< /our_team >}}
{{< two_columns heading="Exploring a future with FivexL? Let's talk it over!" >}}
{{< column >}}
### Ready to Share Your Expertise?  
**Key Skills:**  
AWS Solutions Engineering,  
Docker,  
Terraform,  
Python/Golang,  
English proficiency: B2+  
  
**Responsibilities:**  
Analyzing the customer's business challenges that can be addressed through infrastructure solutions.  
  
Proposing infrastructure solutions that solve business tasks or enhance the productivity of the customer's team.  
  
Implementing proposed solutions or overseeing their implementation.  
  
Training the customer's staff in tools, technologies, concepts, and approaches.
{{< /column >}}

{{< column >}}
### Could You Be the Next Star of FivexL Team?  
**Yes, If You:**  
Are independent, self-organized, and have experience with remote work;  
  
Are positive, ambitious, and proactive;  
  
Have a desire to grow, learn, and excel in your field;  
  
Understand that the core of work is human interaction, with technology serving as a context;  
  
Can approach work from the perspective of solving customer business problems, not just focusing on technology;  
  
Understand change management processes within an organization and can organize them;  
  
Have an understanding of software development processes (Agile/Kanban/Lean);  
  
Understand concepts such as: Infrastructure as Code, Immutable infrastructure, Configuration drift, Continuous Integration, Continuous Delivery.
{{< /column >}}
{{< /two_columns >}}
{{< steps_section heading="What need to do?" >}}

{{< steps_section_item number=1 text="Fill the form, tell us about your motivation." >}}
{{< steps_section_item number=2 text="Submit a task assignment. All applicants who submit a task assignment will receive feedback from us." >}}
{{< steps_section_item number=3 text="Take the Personality Test." >}}
{{< steps_section_item number=4 text="Meet the team and share your experience." >}}

{{< /steps_section >}}
{{< callout_cta heading="Let's talk about how FivexL can be your next step forward." cta_url="#application-form" cta_text="Meet the team!" >}}
{{< unsafe >}}
<div id="application-form" style="display: none; margin: 0 auto 60px; padding: 40px 0;">
  <div style="display: flex; justify-content: center;">
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc_6yxXmibuI8UWmLppl_XpgQm8T9GW0Syl6hCFK785IfeIeQ/viewform?embedded=true" width="100%" style="max-width: 800px;" height="2381" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var formLinks = document.querySelectorAll('a[href="#application-form"]');
  var meetTeamBtn = document.querySelector('.ccta a[href="#application-form"]');
  
  formLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var form = document.getElementById('application-form');
      if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        if (meetTeamBtn) meetTeamBtn.textContent = 'Hide form';
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        form.style.display = 'none';
        if (meetTeamBtn) meetTeamBtn.textContent = 'Meet the team!';
      }
    });
  });
});
</script>
{{< /unsafe >}}
