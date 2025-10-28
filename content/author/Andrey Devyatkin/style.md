# Andrey Devyatkin's Writing Style Guide

This document captures Andrey Devyatkin's writing style for maintaining consistency across FivexL blog posts.

## Voice and Tone

### Overall Characteristics
- **Conversational yet professional**: Approachable expert sharing practical knowledge
- **First-person plural ("we")**: Speaks from FivexL team perspective, not individual
- **Direct and honest**: Calls out problems clearly, admits mistakes, shares real experiences
- **Practical over academic**: Focus on actionable insights over theoretical discussions
- **Humble confidence**: Demonstrates expertise without arrogance

### Tone Variations
- **Problem introduction**: Matter-of-fact, sometimes slightly frustrated with status quo
- **Technical explanation**: Clear, patient, thorough
- **Solutions**: Confident but acknowledges trade-offs
- **Conclusions**: Encouraging, community-minded, inviting

## Content Structure

### Opening Pattern
1. **Context Setting**: Start with a real-world problem or scenario
2. **Personal Connection**: "In our work with startups..." or "We have noticed..."
3. **Problem Statement**: Clear articulation of the challenge
4. **Hook**: Why this matters now (regulations, incidents, customer needs)

**Example Opening Formula:**
```
[Context: Industry trend or challenge]
[FivexL's observation from client work]
[Specific problem this creates]
[Why it matters / urgency]
```

### Body Structure
1. **The Problem** - Detailed explanation with context
2. **The Solution** (or Investigation/Journey) - How we approached it
3. **Technical Implementation** - Deep dive with code/architecture
4. **Practical Considerations** - Real-world gotchas and trade-offs
5. **Lessons Learned** - Broader principles extracted

### Closing Pattern
1. **Summary of value delivered**
2. **Broader lessons or principles**
3. **Call to action** (try the tool, assess your own systems, contribute)
4. **Community invitation** (feedback, contributions, discussions)
5. **Sign-off** (often warm: "Stay resilient", "We welcome contributions", etc.)

## Section Headers

### Style
- **Descriptive and Engaging**: Not just "Introduction" but "When Everything Goes Down"
- **Question Format**: Sometimes poses the question the section answers
- **Action-Oriented**: "The Solution Journey", "Take Action: Assess Your Own Resilience"
- **Clear Hierarchy**: Use ### for main sections, #### for subsections

### Common Patterns
- "The Problem" / "The Challenge"
- "The Solution" / "How It Works"
- "The Journey" / "The Investigation"
- "Technical Implementation" / "Under the Hood"
- "Considerations When..." / "Important Considerations"
- "Lessons Learned" / "What We Learned"
- "Conclusion" / "Take Action" / "Getting Started"

## Technical Content

### Code Examples
- **Always provide context** before code
- **Use real-world examples** not abstract foo/bar
- **Explain what the code does** before and after showing it
- **Include comments** in code blocks for clarity
- **Terraform preference**: When showing IaC, prefer Terraform (FivexL specialty)

### Technical Explanations
1. **Start high-level**: Explain the concept first
2. **Add detail progressively**: Don't dump everything at once
3. **Use analogies**: Make complex concepts accessible
4. **Acknowledge complexity**: "Not very complicated, isn't it?"
5. **Provide alternatives**: Mention other approaches and trade-offs

### Architecture and Diagrams
- **Always reference visuals**: Use image placeholders or actual images
- **Explain before showing**: Describe what the diagram shows
- **Progressive complexity**: Show simple version first, then detailed
- **Call out key insights**: "Here's the problem:", "This was our hidden single point of failure"

## Language Patterns

### Common Phrases and Constructions
- "In our work with startups..."
- "We have noticed a common challenge..."
- "This is where things got interesting..."
- "Here's the problem:"
- "The key difference between X and Y is..."
- "This is a common scenario that we often observe..."
- "Let's examine..." / "Let's focus on..."
- "It is also possible to..."
- "You still need to..." / "You would need to..."
- "Make sure to..." / "Ensure that..."
- "Want to learn more about...?"

### Sentence Structure
- **Mix short and long sentences**: Short for emphasis, longer for explanation
- **Use dashes for asides**: "S3 - one of AWS's most durable services - was the obvious choice"
- **Rhetorical questions**: Engage reader with "How could this be?", "Why not?"
- **Lists for clarity**: Use bullet points or numbered lists for steps/features
- **Emphasis through repetition**: "This is X. This is why it matters."

### Technical Terminology
- **AWS official names**: "AWS IAM Identity Center (AWS SSO)" - use full name first, then shorthand
- **Acronyms**: Define on first use, then use freely
- **Code formatting**: Use backticks for `commands`, `services`, `variables`
- **Precision**: Specific service names, regions, version numbers

## Content Elements

### Real-World Context
- **Customer stories**: "Our customers reported...", "We encountered..."
- **Specific scenarios**: Not hypothetical - actual use cases
- **Production experience**: "During our deployment...", "When implementing for clients..."
- **Industry context**: Reference regulations, trends, compliance requirements

### Linking Strategy
- **AWS documentation**: Link to official docs for deep dives
- **GitHub repositories**: Link to FivexL and related open source projects
- **Previous posts**: Reference related FivexL content
- **External resources**: HashiCorp docs, AWS blogs, industry articles
- **Link text**: Descriptive, not just "click here" - "see documentation", "GitHub repository"

### Visual Elements
- **Images**: Diagrams, screenshots, architecture drawings
- **Videos**: Sometimes embed YouTube videos (especially for complex topics)
- **Code blocks**: Syntax highlighted (specify language: ```hcl, ```shell, ```python)
- **Callouts**: Use quotes or formatted blocks for important notes

### Disclaimers and Notes
- **AI assistance disclaimer**: Sometimes includes note about ChatGPT for writing
  > "Prompted and proofread by FivexL experts with love..."
- **Version warnings**: "As of [date], this issue still persists"
- **Important notes**: Inline emphasis with italics or bold

## Expertise Positioning

### Subtle Authority Building
- **Experience statements**: "15+ years in development", "In our work with startups"
- **Real problems solved**: Specific customer scenarios and solutions
- **Technical depth**: Shows deep understanding through details
- **Community involvement**: AWS Community Builder, conference speaker
- **Humility**: Admits when things are complex, acknowledges alternatives

### FivexL Branding
- **"We" voice**: Speaks as part of FivexL team
- **Company positioning**: "FivexL works with startups for whom time to market..."
- **Service mentions**: Natural references to FivexL services (Landing Zone, assessments)
- **Open source focus**: Emphasizes community contribution and open source tools
- **Startup focus**: Consistently mentions startup-specific concerns (speed, cost, maintenance)

## Common Themes

### Core Values Expressed
1. **Pragmatism**: Choose simple over complex, working over perfect
2. **Resilience**: Engineer for failure, not just success
3. **Efficiency**: Time to market, maintenance burden, cost-effectiveness
4. **Security**: Defense in depth, least privilege, compliance
5. **Community**: Open source, sharing knowledge, collaboration

### Recurring Topics
- AWS infrastructure and services
- Terraform and infrastructure as code
- Startup-specific challenges and solutions
- Security and compliance
- Operational excellence
- Cost optimization
- Multi-account strategies

## Writing Process Tips

### Before Writing
1. **Identify the core problem**: What pain point does this address?
2. **Know your audience**: Startups, engineers, AWS practitioners
3. **Gather real examples**: Use actual customer scenarios (anonymized)
4. **Structure the narrative**: Problem → Investigation → Solution → Lessons

### While Writing
1. **Write conversationally**: Imagine explaining to a colleague
2. **Show your work**: Explain the journey, not just the destination
3. **Be specific**: Real service names, actual code, concrete examples
4. **Add value**: Every paragraph should teach or clarify something
5. **Link generously**: Help readers go deeper on topics

### After Writing
1. **Read aloud**: Does it sound natural?
2. **Check flow**: Does each section lead naturally to the next?
3. **Verify links**: All external links working and relevant
4. **Test code**: If showing code examples, make sure they work
5. **Check for actionability**: Does reader know what to do next?

## Style Don'ts

### Avoid
- ❌ Academic or overly formal language
- ❌ Marketing speak or hype ("revolutionary", "game-changing")
- ❌ Unexplained jargon or acronyms
- ❌ Abstract examples (foo, bar, example.com)
- ❌ Leaving readers hanging without next steps
- ❌ Criticizing competitors or other solutions harshly
- ❌ Promising perfection or silver bullets
- ❌ Writing about things not tested in production

### Instead Do
- ✅ Clear, direct language
- ✅ Honest assessment of trade-offs
- ✅ Define terms when first used
- ✅ Real-world examples and scenarios
- ✅ Clear calls to action and next steps
- ✅ Objective comparison with acknowledgment of use cases
- ✅ Acknowledge limitations and complexity
- ✅ Share real production experience and lessons

## Example Transformations

### Weak Opening
> "In this blog post, we'll discuss the new features in SSO Elevator 3.1.0."

### Andrey's Style
> "On a recent Tuesday, AWS experienced a significant service disruption that lasted much longer than the headlines suggested. While the initial complete outage affected all AWS services for about two hours, the real story was what happened afterward..."

---

### Weak Technical Explanation
> "We implemented caching using S3."

### Andrey's Style
> "Our first instinct was to use DynamoDB with its built-in Time-To-Live (TTL) feature. It looked like an attractive serverless option - no infrastructure to manage, automatic cache expiration, and it would integrate nicely with our Lambda-based architecture.

> But then we paused and asked ourselves a critical question: 'Are we actually solving the problem, or are we just adding another dependency?'"

---

### Weak Conclusion
> "That's all about the new release. Thanks for reading."

### Andrey's Style
> "AWS outages are rare, but they happen. The real test of engineering maturity isn't avoiding failures - it's how gracefully your systems degrade when failures inevitably occur. 

> SSO Elevator 3.1.0 represents our commitment to building tools that remain operational when you need them most..."

## Checklist for Review

Use this checklist before publishing:

- [ ] Opens with real-world context or problem
- [ ] Uses "we" voice (FivexL team perspective)
- [ ] Includes specific technical details and examples
- [ ] Shows the journey (not just final solution)
- [ ] Acknowledges trade-offs and limitations
- [ ] Links to relevant documentation and resources
- [ ] Provides actionable takeaways
- [ ] Invites community engagement
- [ ] Matches conversational yet professional tone
- [ ] All code examples are tested and correct
- [ ] All links work and are relevant
- [ ] Images/diagrams referenced appropriately
- [ ] Proper AWS service names used
- [ ] Startup-specific context included where relevant

---

*This style guide is a living document. Update it as Andrey's style evolves or new patterns emerge.*

