---
title: 'From Leadership Values to Security: Building Audit-Ready Architecture'
author_id: FivexL
date: 2026-03-24
description: 'Five takeaways from a conversation with Rusty Atkinson (SVP, Technology at Clearway Health) on how leadership values translate into secure defaults, audit-ready architecture, and real operational discipline.'
author: FivexL
author_link: https://fivexl.io/
category: Security
panel_image: AWS-Partner.png
tags: ['AWS', 'Security', 'Compliance', 'HIPAA', 'Leadership', 'Webinar']
---

In a recent webinar, [Rusty Atkinson](https://www.linkedin.com/in/rustyatkinson/), SVP, Technology at Clearway Health and author of *[The Integrity Edge: Unlocking the Hidden Power of Ethical Leadership](https://www.amazon.com/Integrity-Edge-Unlocking-Ethical-Leadership/dp/B0FRBJ99FF/ref=sr_1_1?dib=eyJ2IjoiMSJ9.tfDl0b0jJpSktasWaw42jFE4esSjLxTKP0og26m8Ol7GjHj071QN20LucGBJIEps.6uBQ45RkiKN5L9Ryqb6ByObYRd2VNTXF_CpejVTMtC8&dib_tag=se&keywords=Integrity-Edge-Unlocking-Hidden-Ethical&qid=1774356602&sr=8-1)*, joined FivexL's [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/), Co-Founder and Principal Cloud Engineering Consultant, and [Guilherme Ferreira](https://fivexl.io/specialist/guilherme-ferreira/), Senior Cloud Engineering Consultant, to discuss a question that matters to every company operating under regulatory pressure: how do leadership values actually turn into secure, audit-ready architecture when deadlines hit?

FivexL has worked closely with Clearway Health on building their HIPAA-compliant AWS infrastructure - so this was not a theoretical discussion. Rusty brought the leadership and culture perspective; Andrey and Guilherme brought the architecture and engineering depth. The session connected principles like integrity, clarity, and courage to the operational choices that make security real: least-privilege access, clear tenant boundaries, traceable change management, and HIPAA-aligned evidence practices.

When Guilherme asked Rusty directly how he saw the FivexL partnership, Rusty's answer was blunt: *"In my career, I never had a vendor that I trusted more. You presented to me something that resonated immediately as the answer to the question that I didn't ask - how do you build it when the non-negotiable is security and privacy, when you don't have an army of engineers, and you're running fast? You answered that question before I even asked it."*

That trust - between people, between teams, between an organisation and its infrastructure - was the thread running through the entire conversation.

<!--more-->

<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #18AEF0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

**Five takeaways from the session:**

- A working system is not a trusted system. Trust survives growth, turnover, and audits.
- Culture is shaped by what leaders tolerate, not what they say on slides.
- "We'll fix it later" is how permanent risk is born. Close the loop or carry the debt.
- Guardrails beat guidelines. If a control can be bypassed casually, it is not a control.
- Infrastructure as Code is non-negotiable for audit-ready, developer-speed operations.

</div>

---

## 1. A system is not truly trusted just because it works

This is one of the most dangerous assumptions in a fast-moving startup.

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"When everything's going fine, when the sea is calm, so to speak, it's working, everything's fine. But let one thing go sideways, and then suddenly, 'it's always like this.' That's what you hear."* - Rusty Atkinson

</div>

A platform can be live, customers can be active, and the product can appear stable - while the underlying environment is still deeply fragile. If the system works only because one engineer knows how everything fits together, because infrastructure changes happen from memory, or because people are constantly compensating for weak process - that is not trust. That is temporary stability.

**The snowflake server problem**

Andrey shared a pattern FivexL sees regularly with startups:

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"You have a business-critical system that is running on the server that was built by the person who left. No one knows how it's being configured. It works. A lot of stuff depends on it. But if you need to change it, it's a very scary thing to do because if it breaks, you don't know how it came about to be."*

</div>

Martin Fowler calls this a "snowflake server" - good for the skiing season, not for the server room.

**The trust test**

A trusted system remains understandable and predictable when pressure rises - whether that pressure is your first enterprise customer's security questionnaire, your first SOC 2 audit, or your key engineer giving notice. That means a startup should be able to answer these questions without hesitation:

- What changed? Who changed it? Why was it changed?
- Can the environment be reproduced?
- Can the team recover cleanly if a key person is unavailable?

In healthcare, those questions matter even more. As Rusty noted, a system that seemed fine suddenly becomes a crisis *"whenever you have an audit requirement, evidence gathering requirements - suddenly, I don't have time to run the system."*

**Key takeaway:** A system that survives calm weather is not the same as a system that survives growth, turnover, and audit season.

---

## 2. Leadership defines security culture through actions, not slogans

Most startups say security matters. The real question is whether people inside the company believe that to be true.

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"The culture of the team is gonna be determined by the actions its leaders take and tolerate. Show me a leader who is dishonest and I'll show you a culture that doesn't value honesty. And without honesty, there's no trust. Show me a leader who always has to be right, and I'll show you a team that will never give their point of view."* - Rusty Atkinson

</div>

Culture is not formed by values written on a slide. It is formed by what leaders reward, ignore, and tolerate every week. If speed repeatedly wins over review discipline, the organisation learns that controls are flexible. As Andrey put it:

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"If you just say security is important but at the same time on a daily basis you say let's push the feature, your actions tell everyone speed is important."*

</div>

**The Toyota Andon cord lesson**

Andrey illustrated this with a well-known example from manufacturing. In Toyota's production system, any worker on the line can pull a cord to stop the entire line when they see a defect. Stopping the line is extremely expensive, but leadership encourages it - because the longer a defect travels down the line, the more expensive it becomes to fix.

When Ford copied the system, a worker pulled the cord - and the manager came yelling at him for stopping production. Within weeks, everyone got the message: don't pull the cord. The same dynamic plays out in startups. If an engineer raises a security concern and the response is "we'll deal with it after launch," the team learns fast.

**The meeting plant technique**

Rusty shared a practice he developed early in his career for breaking a room full of silent managers. Before an important meeting where he needed real feedback, he pulled aside a trusted senior contributor and gave him a simple instruction: "Find something in what I'm about to present that you don't completely agree with, and say it."

When that person spoke up in the meeting, it was like a light switch. The other managers who had been sitting quietly suddenly started disagreeing too. Once it was safe, everyone participated. Rusty calls it the "meeting plant."

The deeper point is that you eventually don't need it anymore. Once a team has repeatedly witnessed a leader receive criticism without reacting defensively, the norm shifts on its own. You are not manufacturing disagreement - you are demonstrating that it is safe. That demonstration is what unlocks everyone else.

**A diagnostic for founders**

Rusty offered a practical test for leaders who aren't sure whether their environment is actually trusting:

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"Do your engineers raise their hand when they make mistakes or do they try to hide them? Do your engineers provide feedback? When you present them an idea, do you ever get disagreement? If your engineers aren't taking responsibility for the errors they make, if your engineers are not critiquing one another, if your engineers are not disagreeing with you, you don't have a trusting environment."*

</div>

In healthcare and other regulated industries, weak culture does not stay invisible forever. It eventually shows up in inconsistent access controls, poor documentation, messy incident response, unclear ownership, and growing tension between speed and safety.

**Key takeaway:** If your team does not disagree with you, does not admit mistakes, or does not raise security concerns - that is a leadership problem, not a technical one.

---

## 3. Temporary fixes become permanent risk unless they are closed properly

This is how many startups accumulate silent operational debt.

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"The 'that's good enough for now, we'll get to it later' or 'yeah, I know we're not supposed to do it that way but we'll just do it that way and we'll fix it later.' Those are not neutral decisions. Those are the decisions that become permanent risk and permanent pain."* - Rusty Atkinson

</div>

An incident happens. Service needs to be restored quickly. Someone introduces a workaround, grants access temporarily, skips a step, or makes a manual change to keep things moving. In the moment, that may be necessary. The risk begins when the temporary action becomes the system - the workaround stays in place, the access is never cleaned up, the process weakness is left untouched.

**The engineer who left**

Rusty shared a story of an engineer who made shortcuts, did not document them, did not tell anyone, and then left:

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"He did something in a manner that he knew was temporary and shoddy. And then he went away and his success couldn't be duplicated."*

</div>

This creates serious problems when your startup faces its first SOC 2 audit or customer security review. Reviewers do not just look at whether service came back. They look at whether the company can show repeatable, controlled, supportable behaviour.

**The non-negotiable principle**

Rusty's rule: you don't finish the after-action post-mortem on an incident until those temporary solutions have been made permanent in some kind of repeatable and documented way. Teams need time to close the loop. Without that space, "we'll clean it up later" becomes a hidden operating principle - and hidden operating principles are where long-term risk grows.

**Key takeaway:** The work is not finished when the incident is resolved. It is finished when the temporary fix has been turned into something documented, repeatable, and maintainable.

---

## 4. Guardrails matter more than guidelines

Guidelines are helpful. Guardrails are what make secure behaviour real.

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"If the guardrail is avoidable, it's not a guardrail, it's a guideline. And you can't build trust with guidelines."* - Rusty Atkinson

</div>

A guideline tells people what they should do. A guardrail makes the right path the default one. Under pressure, people do not always have time to interpret best practices perfectly. They fall back to the environment around them.

**Immutable infrastructure as a guardrail**

Andrey gave a practical AWS example: instead of continuously modifying the same virtual machine, you create a new one from scratch. That allows you to discard all the tech debt and the potential manual changes people made.

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"People know that I should not be going to the virtual machine and changing anything by hand because it's going to be recreated again and again. So I need to change the template instead. And this is how it enforces that thinking."*

</div>

**Multi-account AWS strategy from day one**

Andrey used a house analogy: if you build your house without a plan, you end up with a Frankenstein - or a bathroom in the living room. The same applies to AWS. If you don't have a clear strategy for where workloads go, people will take the path of least resistance and drop them wherever they feel like it. Separating workloads from day one matters because it takes enormous effort to separate them later.

This is exactly what FivexL's [RightStart](https://fivexl.io/rightstart/) delivers - a governed multi-account foundation with guardrails built in from the start.

**Trust must move from people to systems**

At five engineers, everyone knows the system. At twenty, they do not. More people, more systems, more customers, and more regulatory expectations make informal coordination too fragile. Trust has to move from individuals into the system. If a control can be bypassed casually, it is not really a control - it is a suggestion. Suggestions do not hold up during audits, incidents, or fast growth.

**Key takeaway:** Build guardrails that make secure behaviour the default, not the exception. Start with a governed multi-account structure and immutable infrastructure.

---

## 5. Infrastructure as Code is foundational for audit-ready teams

Infrastructure as Code is one of the clearest signals that a startup is serious about operational control.

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"Without infrastructure as code, infrastructure folks cannot deliver on a schedule that the developers follow. They can't, they just can't do it. Anytime you get a place where you're making manual changes and expecting to have a trusted system, it's a pipe dream."* - Rusty Atkinson

</div>

Manual infrastructure changes may feel fast in the beginning, but they create fog. It becomes difficult to understand what changed, difficult to recreate environments reliably, and difficult to prove control during audits:

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"I'll make the change locally on a system. Oh man, it's arguably impossible at scale to collect evidence on that type of change environment."*

</div>

**IaC as a trust contract**

Andrey framed it in terms of trust:

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"Infrastructure as code captures your intent and your desire, how you want to see infrastructure to be, and then it allows it to be repeatable."*

</div>

And critically:

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"Infrastructure as code enables change management. You can have a controlled way of changing things and knowing what changed and when, who did it. So this is more of a contractual thing rather than an instrument."*

</div>

**Why this matters for regulated startups**

For healthcare startups and other regulated companies, IaC delivers on several levels at once: security (change becomes more controlled), resilience (environments become more reproducible), onboarding (new engineers do not need to reconstruct history from tribal knowledge), and audit readiness (leaders can show their systems are built to support careful operation, not just that they intend to operate carefully).

When releases slow down, audits become painful, or customer security reviews drag on, the root issue is often not a lack of people. Very often, the issue is that critical infrastructure is still being managed through habits that do not scale. Infrastructure as Code is the shift from personality-driven operations to system-driven operations. That shift is where real maturity begins.

**Key takeaway:** If you cannot explain, reproduce, and prove your infrastructure changes without relying on someone's memory, you are not audit-ready.

---

## Final thought

The real question is not whether security exists somewhere in the organisation. The real question is whether security is built into how the organisation works. Can the company operate well under audit pressure? Can teams raise issues before they become incidents? Can changes be explained without relying on memory? Can the business move fast without making exceptions the real system?

A secure organisation is not created by policy language alone. It is created by leadership behaviour, operating discipline, real guardrails, and systems that remain understandable under pressure. The strongest companies are not the ones that never face pressure. They are the ones that build in a way that pressure does not break trust.

<div style="background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%); border-left: 4px solid #c0c0c0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">

*"Security emerges from culture, discipline, and design. Culture defines behaviour, guardrails enforce it, and architecture proves it. It's all about moving from intentions to trust."* - Guilherme Ferreira

</div>

---

If you are building in healthcare, fintech, or another regulated industry and want to start with the right foundation, [book a consultation with our team](https://fivexl.io/contact/).

You can also explore how we helped [Clearway Health](https://fivexl.io/case-studies/clearway-health-case-study/) and [Hippo](https://fivexl.io/case-studies/hippo-case-study/) build HIPAA-compliant, audit-ready AWS infrastructure with [RightStart](https://fivexl.io/rightstart/).

**Replay:** [Watch on YouTube](https://www.youtube.com/live/CfVhr8j5yIA?si=tEdXGBBd9OWciifW)

**Book:** [The Integrity Edge: Unlocking the Hidden Power of Ethical Leadership](https://www.amazon.com/Integrity-Edge-Unlocking-Ethical-Leadership/dp/B0FRBJ99FF/ref=sr_1_1?dib=eyJ2IjoiMSJ9.tfDl0b0jJpSktasWaw42jFE4esSjLxTKP0og26m8Ol7GjHj071QN20LucGBJIEps.6uBQ45RkiKN5L9Ryqb6ByObYRd2VNTXF_CpejVTMtC8&dib_tag=se&keywords=Integrity-Edge-Unlocking-Hidden-Ethical&qid=1774356602&sr=8-1)

**Newsletter:** [Subscribe](https://fivexl.io/#email-subscription/) to our monthly newsletter where we share AWS infrastructure insights, security best practices, and lessons from working with startups in regulated industries.
