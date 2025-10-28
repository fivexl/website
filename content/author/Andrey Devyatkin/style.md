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
- **ASCII diagrams**: Consider using ASCII/text diagrams in code blocks for version control friendliness

## Technical Accuracy and Precision

### Avoiding Absolutes
- ❌ **Don't use absolutes** without SLA/data backing: "always", "never", "all", "every", "no", "none"
- ✅ **Use qualified language**: "typically", "commonly", "in most cases", "often", "rarely"
- ❌ Bad: "This always works" / "Never fails" / "All services"
- ✅ Good: "This operates during common degradation scenarios" / "Rarely fails" / "Most services"

### Making Claims
- **Modest claims**: Keep performance and reliability claims specific and defensible
  - ❌ "No performance impact" → ✅ "No added latency on the common path"
  - ❌ "Always works" → ✅ "Continues to operate during common degradation scenarios"
  - ❌ "Perfect reliability" → ✅ "Improved resilience with defined assumptions"
- **State assumptions**: When making claims, note the conditions required
  - Example: "(assumes valid cache exists from prior successful call)"
- **Acknowledge trade-offs**: Nothing is free - mention what you're trading for the benefit

### Sourcing Strong Claims
- **Technical specifications**: Link to official documentation for all specific claims
  - Durability percentages → Link to AWS docs
  - Availability SLAs → Link to AWS SLA pages
  - Service endpoints → Link to API reference
  - Architecture details → Link to service documentation
- **Incident reports**: Link to official AWS service health dashboard or status messages
- **News sources**: For incidents, cite reputable sources (AWS official, Reuters, etc.)
- **When in doubt**: Add a link or soften the claim

### AWS Service Naming Conventions
1. **First mention**: Use full official name with former name in parentheses if applicable
   - ✅ "AWS IAM Identity Center (formerly AWS SSO)"
   - ✅ "Amazon Elastic Container Service (Amazon ECS)"
   - ✅ "US East (N. Virginia) Region (us-east-1)"
2. **Subsequent mentions**: Use shortened form consistently
   - ✅ "Identity Center" (not "IAM Identity Center" or "AWS SSO")
   - ✅ "ECS" (not "Amazon ECS")
   - ✅ "us-east-1" or "the US East Region"
3. **Capitalize AWS terms**: Region, Availability Zone, Local Zone (when referring to AWS concepts)
4. **Use precise terminology**:
   - ✅ "global endpoint in us-east-1" (not "hosted in")
   - ✅ "degradation" (not "disturbances" or "issues")
   - ✅ "service disruption" (not "outage" unless it was a complete outage)

### Technical Accuracy Checks
Before publishing, verify:
1. **Service limitations**: Check AWS documentation for actual service capabilities
   - Example: Can Identity Center have multiple org instances? (No - [check docs](https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-considerations.html))
2. **Regional vs global**: Confirm which services have regional vs global endpoints
3. **Performance claims**: Test or cite data for latency/throughput claims
4. **Architecture validity**: Ensure proposed architectures are actually supported by AWS
5. **Timeline accuracy**: For incidents, cite official timelines, don't exaggerate duration

### Framing Incidents and Problems
- **Be precise about scope**: "widespread disruption in US East Region" not "all AWS services down"
- **Cite official sources**: Link to AWS Service Health Dashboard messages
- **Acknowledge mitigation timeline**: "AWS mitigated core issue within X hours, full restoration Y"
- **Avoid sensationalism**: Factual description > dramatic language
- **Show understanding**: Explain the technical cause when known (DynamoDB endpoints, DNS issues, etc.)

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
- ❌ Absolute language without backing: "always", "never", "all", "every", "zero"
- ❌ Unsourced technical claims: Durability, availability, or performance claims without links
- ❌ Overstated incident descriptions: Exaggerating outage scope or duration
- ❌ Architecturally impossible solutions: Suggesting configurations AWS doesn't support
- ❌ Inconsistent service names: Mixing full names, abbreviations, and old names

### Instead Do
- ✅ Clear, direct language
- ✅ Honest assessment of trade-offs
- ✅ Define terms when first used (use official AWS names)
- ✅ Real-world examples and scenarios
- ✅ Clear calls to action and next steps
- ✅ Objective comparison with acknowledgment of use cases
- ✅ Acknowledge limitations and complexity
- ✅ Share real production experience and lessons
- ✅ Qualified language: "typically", "in most cases", "commonly", "often"
- ✅ Source all strong claims: Link to AWS docs, SLAs, official incident reports
- ✅ Precise incident framing: Cite official timelines and scope from AWS
- ✅ Verify architecture validity: Check AWS docs before proposing solutions
- ✅ Consistent naming: Full name first, then shorthand throughout

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

---

### Weak Claim (Absolute)
> "This solution always works and never fails, even during AWS outages."

### Andrey's Style (Qualified)
> "This solution continues to operate during common us-east-1 degradation scenarios (assumes valid cache exists from prior successful call). The cached account list might be slightly stale, but the system remains operational."

---

### Weak Technical Detail (Unsourced)
> "S3 has 11 nines of durability and is extremely reliable."

### Andrey's Style (Sourced)
> "S3 is one of AWS's most durable and available services, with [99.999999999% (11 nines) durability](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html), [99.99% availability](https://aws.amazon.com/s3/sla/), and [strong read-after-write consistency](https://aws.amazon.com/s3/consistency/)."

---

### Weak Performance Claim
> "No performance impact whatsoever."

### Andrey's Style (Precise)
> "No added latency on the common path. Because we execute the API call and cache retrieval in parallel, there's no additional latency when the Organizations API succeeds."

---

### Weak Incident Description
> "On Tuesday, AWS went completely down for hours, affecting everything worldwide."

### Andrey's Style (Precise, Sourced)
> "On [December 15, 2021](https://aws.amazon.com/message/101925/), AWS experienced a widespread disruption in the US East (N. Virginia) Region (us-east-1). The incident was [tied to issues with internal DNS and DynamoDB endpoints](https://www.reuters.com/technology/amazons-aws-suffers-outage-affecting-thousands-us-users-downdetectorcom-2021-12-15/). While AWS mitigated the core issue within a few hours, degradation persisted throughout the day..."

## Checklist for Review

Use this checklist before publishing:

### Content and Structure
- [ ] Opens with real-world context or problem
- [ ] Uses "we" voice (FivexL team perspective)
- [ ] Includes specific technical details and examples
- [ ] Shows the journey (not just final solution)
- [ ] Acknowledges trade-offs and limitations
- [ ] Provides actionable takeaways
- [ ] Invites community engagement
- [ ] Matches conversational yet professional tone
- [ ] Startup-specific context included where relevant

### Technical Accuracy
- [ ] No absolutes ("always", "never", "all") unless backed by SLA/data
- [ ] All performance claims are qualified and specific (e.g., "on the common path")
- [ ] All technical specifications linked to official AWS documentation
- [ ] AWS service names use official naming convention (full name first, shorthand after)
- [ ] "Region", "Availability Zone" capitalized when referring to AWS concepts
- [ ] Precise terminology ("global endpoint in", not "hosted in"; "degradation", not "disturbances")
- [ ] Architecture proposals verified as actually supported by AWS
- [ ] Service limitations checked against AWS documentation
- [ ] Incident descriptions cite official timelines and sources

### Links and Sources
- [ ] All links work and are relevant
- [ ] Technical claims sourced with AWS docs/SLAs
- [ ] Incident reports link to official AWS messages
- [ ] Performance/durability percentages link to official specs
- [ ] Service endpoints link to API reference documentation

### Code and Visuals
- [ ] All code examples are tested and correct
- [ ] Images/diagrams referenced appropriately (or ASCII diagrams in code blocks)
- [ ] Diagrams don't over-promise ("continues to operate" vs "always works")

---

*This style guide is a living document. Update it as Andrey's style evolves or new patterns emerge.*

