---
title: 'Building Resilience into SSO Elevator 3.1.0: Lessons from an AWS Outage'
author_id: 'Andrey Devyatkin'
summary: 'How a real AWS outage revealed hidden dependencies in SSO Elevator and led to version 3.1.0 with improved resilience through intelligent S3 caching. A practical guide to engineering for failure.'
date: 2025-10-28
author: Andrey Devyatkin
panel_image: sso-elevator-resilience-hero.png
tags: ['AWS', 'SSO Elevator', 'Resilience', 'Incident Response', 'Architecture', 'open source']
---
<!-- TODO: Add hero image: sso-elevator-resilience-hero.png -->

### When Everything Goes Down

On a recent Tuesday, AWS experienced a significant service disruption that lasted much longer than the headlines suggested. While the initial complete outage affected all AWS services for about two hours, the real story was what happened afterward. Even after the primary restoration, us-east-1 continued to experience issues while other regions appeared mostly operational. 

This is where things got interesting for our customers using [SSO Elevator](https://github.com/fivexl/terraform-aws-sso-elevator), FivexL's open-source tool for temporary elevated access to AWS accounts. We started receiving reports of SSO Elevator failures from customers whose AWS IAM Identity Center (AWS SSO) was deployed in regions outside us-east-1 - regions that were supposedly healthy. Their AWS SSO was working fine, yet SSO Elevator was failing. How could this be?

The answer lies in a fundamental reality of distributed systems: nothing is perfect, and seemingly isolated services often have hidden dependencies on centralized infrastructure. In AWS's case, many "regional" services depend on "global" services that are actually hosted in us-east-1. When us-east-1 struggles, these hidden dependencies can bring down functionality in otherwise healthy regions.

This incident became a valuable learning opportunity and drove us to release SSO Elevator 3.1.0 with significantly improved resilience. More importantly, it reinforced a critical principle: we must engineer our systems expecting things to fail, not hoping they won't.

### The Investigation: Finding the Hidden Dependency

As part of our post-incident analysis and lessons learned process, we dove deep into understanding why SSO Elevator failed even when AWS SSO itself was operational. The investigation quickly revealed the culprit: the AWS Organizations API.

SSO Elevator relies on the AWS Organizations API to retrieve the list of AWS accounts in your organization. This list populates the dropdown in the Slack form where users select which account they need temporary access to. Simple enough, right?

Here's the problem: the AWS Organizations API is a global service hosted in us-east-1. During the incident, even after the initial two-hour complete outage ended, the Organizations API continued returning errors as us-east-1 experienced ongoing disturbances. This meant that SSO Elevator couldn't fetch the account list, causing the access request flow to fail completely - regardless of which region hosted the customer's AWS SSO.

```
┌─────────────────────────────────────────────────────────────┐
│                     SSO Elevator (v3.0)                     │
│                  (Any AWS Region, e.g., eu-west-1)          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Get account list
                         │
                         ▼
            ┌────────────────────────────┐
            │   AWS Organizations API    │
            │    (hosted in us-east-1)   │
            └────────────────────────────┘
                         │
                         │ When us-east-1 is degraded
                         │
                         ▼
                    ╔═══════════╗
                    ║  FAILURE  ║  ◄── Single Point of Failure
                    ╚═══════════╝
                         │
                         ▼
              SSO Elevator stops working
              (even if AWS SSO is healthy)
```

This was our hidden single point of failure. A service hosted in one region was capable of breaking functionality worldwide. Understanding this dependency was crucial, but the real question was: how do we fix it?

### The Solution Journey: From DynamoDB to S3

Once we identified the problem, the solution seemed straightforward: we needed to cache the list of accounts so SSO Elevator could continue operating even when the Organizations API was unavailable.

Our first instinct was to use DynamoDB with its built-in Time-To-Live (TTL) feature. It looked like an attractive serverless option - no infrastructure to manage, automatic cache expiration, and it would integrate nicely with our Lambda-based architecture.

But then we paused and asked ourselves a critical question: "Are we actually solving the problem, or are we just adding another dependency?"

By introducing DynamoDB, we would be adding a new service dependency while trying to reduce our vulnerability to service failures. Sure, DynamoDB is highly available, but it's still another thing that could go wrong. We needed to think differently.

We took another look at the services SSO Elevator was already using and realized the answer was right in front of us: S3. We were already using S3 for storing audit logs of all access grants and revocations. Why not leverage it for caching as well? S3 is one of AWS's most durable and available services, with 99.999999999% (11 nines) durability and 99.99% availability. More importantly, we weren't adding a new dependency - we were maximizing the utility of existing infrastructure.

### The Technical Implementation: Cache as a Safety Net

Here's where our approach differs from typical caching strategies. Most caching implementations focus on performance - reduce latency, decrease API calls, save costs. Our implementation focuses entirely on resilience. The cache isn't there to make things faster; it's there to keep things running when the primary data source fails.

The implementation follows a parallel execution pattern:

1. When a user opens the Slack form to request access, SSO Elevator simultaneously:
   - Calls the AWS Organizations API to get the current list of accounts
   - Retrieves the cached list from S3

2. If the Organizations API call succeeds:
   - Use the fresh list from the API
   - Compare it with the cached version in S3
   - If they differ, update the S3 cache with the new list
   - Return the list to populate the Slack form

3. If the Organizations API call fails:
   - Fall back to the cached list from S3
   - Return the cached list to populate the Slack form
   - Log the failure for monitoring

**Architecture with S3 Caching (v3.1.0):**
```
                    ┌─────────────────────────────┐
                    │   User Opens Slack Form     │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │    SSO Elevator (v3.1.0)    │
                    │   (Any AWS Region)          │
                    └──────────────┬──────────────┘
                                   │
                        Parallel Execution
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
       ┌────────────────────────┐    ┌────────────────────────┐
       │  AWS Organizations API │    │   S3 Cache Bucket      │
       │   (hosted in us-east-1)│    │   (Same region as      │
       └────────────┬───────────┘    │    SSO Elevator)       │
                    │                └────────────┬───────────┘
                    │                             │
                    └──────────┬──────────────────┘
                               │
                               ▼
                    ┌─────────────────────────┐
                    │   Decision Logic:        │
                    │                          │
                    │   ✓ API Success?         │
                    │     → Use fresh data     │
                    │     → Compare with cache │
                    │     → Update if changed  │
                    │                          │
                    │   ✗ API Failed?          │
                    │     → Use cached data    │
                    │     → Log failure        │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │  Return Account List to  │
                    │      Slack Form          │
                    └──────────────────────────┘
                                 │
                                 ▼
                         ✓ Always Works!
              (even during us-east-1 degradation)
```

This approach provides several benefits:

**No Performance Impact**: Because we execute the API call and cache retrieval in parallel, there's no additional latency in the happy path. Users don't wait longer for the form to load.

**Self-Healing Cache**: By comparing the API response with the cached version, we ensure the cache stays fresh automatically. When accounts are added or removed from your organization, the cache updates on the next successful API call.

**Fail-Safe Operation**: During an AWS service disruption, SSO Elevator continues working with the cached account list. The list might be slightly stale, but the system remains operational. This is a reasonable trade-off for resilience.

**Minimal Operational Overhead**: No TTL to tune, no cache invalidation logic to debug, no additional service to monitor. The cache is just a file in S3 that updates itself when needed.

### Enabling Multi-Region Resilience

This improvement serves a larger strategic goal: enabling customers to deploy SSO Elevator in multiple regions as part of a backup strategy. Some of our customers are considering deploying a second AWS IAM Identity Center instance in a different region as a backup. With SSO Elevator 3.1.0, they can now deploy SSO Elevator alongside that backup SSO instance with confidence that it won't fail due to us-east-1 issues.

### What's New in SSO Elevator 3.1.0

Beyond the resilience improvements described above, version 3.1.0 includes several other enhancements based on customer feedback and our own operational experience. The release maintains backward compatibility, so existing deployments can upgrade without configuration changes.

Key improvements:
- **Intelligent account list caching with S3 fallback** - The core resilience feature described in this post
- **Improved error handling and logging** - Better visibility when things do go wrong
- **Enhanced monitoring metrics** - Track cache hits, API failures, and fallback operations
- **Documentation updates** - Including guidance on multi-region deployment strategies

You can review the complete changes in the [GitHub repository](https://github.com/fivexl/terraform-aws-sso-elevator).

### Lessons Learned: Engineering for Failure

This incident and our response to it reinforced several important principles that apply far beyond SSO Elevator:

**Nothing Is Perfect**: Even AWS, with all its resources and expertise, experiences failures. If AWS can have outages, your services certainly can too. Accepting this reality is the first step toward building resilient systems.

**Hidden Dependencies Are Everywhere**: The AWS Organizations API dependency wasn't obvious from our architecture diagrams. It was a transitive dependency - we needed it to function, but it wasn't a service we explicitly integrated with or thought about much. These are the most dangerous kind because they're easy to overlook during design and planning.

**Map Your Dependencies**: Take time to document not just what services you use, but what services _they_ use. What happens if IAM is down? What about STS? Organizations? CloudTrail? Service Catalog? Many AWS services depend on these foundational services, even if you don't call them directly.

**Run Failure Scenarios**: Don't wait for real incidents to discover your failure modes. AWS provides tools like [Fault Injection Simulator](https://aws.amazon.com/fis/) that let you deliberately inject failures and see how your system responds. Even simpler, you can test IAM/STS failure modes by temporarily blocking those services at the SCP level.

**Prioritize Your Improvements**: You can't make everything perfectly resilient. Use risk analysis to identify what matters most. For SSO Elevator, access during incidents is critical - if infrastructure is failing, operators need to fix it, which often requires elevated access. That made this improvement a priority.

**Leverage What You Have**: Our switch from DynamoDB to S3 for caching wasn't just about avoiding a new dependency. It was about deeply understanding our existing architecture and maximizing the value of services we already relied on. Sometimes the best solution is already in your stack.

### Take Action: Assess Your Own Resilience

I encourage you to take some time this week to assess the resilience of your own critical systems:

1. **List your service dependencies** - Not just the services you call directly, but their dependencies too. AWS's service documentation often lists these in the "Service endpoints and quotas" pages.

2. **Model failure scenarios** - For each dependency, ask: "What happens if this service fails?" Walk through the failure cascade. You might be surprised by what you discover.

3. **Test your assumptions** - Use AWS Fault Injection Simulator or manual testing (like temporary SCP policies) to actually verify how your systems behave during failures.

4. **Prioritize improvements** - You can't fix everything, so focus on what matters most to your business and users.

5. **Share your lessons** - If you discover interesting failure modes or build clever solutions, share them with the community. That's how we all get better.

### Conclusion

AWS outages are rare, but they happen. The real test of engineering maturity isn't avoiding failures - it's how gracefully your systems degrade when failures inevitably occur. 

SSO Elevator 3.1.0 represents our commitment to building tools that remain operational when you need them most. By identifying hidden dependencies, implementing intelligent caching strategies, and focusing on resilience over performance, we've made SSO Elevator more reliable for our customers deploying in single or multi-region configurations.

We hope this post provides useful insights for your own resilience planning. As always, SSO Elevator is open source, and we welcome contributions, feedback, and bug reports on our [GitHub repository](https://github.com/fivexl/terraform-aws-sso-elevator). If you're using SSO Elevator or considering it for your organization, we'd love to hear about your experience.

Stay resilient, and may your oncall be quiet.
