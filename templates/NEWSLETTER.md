# FivexL Monthly Newsletter — Template & Guidelines

Use this document when generating or reviewing a monthly newsletter blog post.
The newsletter lives at `content/blog/fivexl-newsletter-{month}-{year}/index.md`.

---

## Front Matter

```yaml
---
title: 'FivexL Newsletter, {Month} {Year}'
author_id: FivexL
date: {YYYY-MM-DD}          # publication date — usually within the first two weeks of the following month
description: 'FivexL Newsletter for {Month} {Year} - Latest updates, blog posts, and insights from our cloud engineering team.'
author: FivexL
author_link: https://fivexl.io/
category: Newsletter
panel_image: fivexl-newsletter-white-logo.png   # alternate with fivexl-newsletter-black-logo.png each month
tags: ['Newsletter', 'AWS', 'Cloud Engineering']
---
```

### Front-matter rules

- `title` always follows the pattern `FivexL Newsletter, {Month} {Year}`.
- `date` is the actual publication date, not the last day of the covered month.
- `panel_image` alternates between the white-logo and black-logo variants.
- `tags` stays fixed unless a genuinely new top-level theme is added.

---

## Section Order

Include sections in this order. Sections marked *optional* are only added when there is content for them.

1. `## Intro`
2. `## Events`
3. `## Updates`
   1. `### Open-source project updates`
   2. `### Blog post and case study updates`
   3. `### Podcast: DevSecOps Talks`
   4. `### Top {N} articles from the team` *(optional)*
4. **Closing line** (no heading)

Never reorder or nest these differently. If a section has no content for the month, omit it entirely — do not leave empty headings.

---

## Section Details

### 1. Intro

- Use `## Intro` as the heading.
- **Always open with "Greetings!"** on its own line right after the heading, followed by a blank line before the body text.
- 1–3 short paragraphs after the greeting.
- Make the opening energetic and engaging — the reader should feel like there's something worth scrolling for. Tease the most interesting highlights up front so curiosity pulls them in.
- Summarise the month's highlights at a glance: what shipped, what's new, what changed.
- Do **not** open with "it was a busy month" or similar — we've overused that framing. Instead, lead with what FivexL shipped or what changed, and let the volume speak for itself.
- Seasonal or timely context (holidays, re:Invent, end-of-year) is fine when it adds something, but keep it brief.

### 2. Events

- Use `## Events` as the heading.
- This section covers both upcoming and past events/webinars. Include whichever apply for the month — one or both.
- **Upcoming events:** Tease the next webinar or event. Name the presenters and link to their specialist pages (`https://fivexl.io/specialist/{slug}/`). Encourage joining live for Q&A — "that's the part you can't get from a recording." Link to the registration page or, if not yet available, to the FivexL LinkedIn page (`https://www.linkedin.com/company/5xl`) with "Stay tuned for the full announcement."
- **Past webinars:** Name presenters with links to their specialist pages. Briefly describe what was covered. Link to the recording (usually YouTube).

### 3. FivexL Updates

This is the main container heading. All subsections below live under it.

#### 3a. Open-source project updates

- Open with a short intro sentence about FivexL keeping client tooling open source (vary the wording slightly each month to avoid sounding robotic, but keep the idea).
- List each release as a bullet:

  ```markdown
  - **[project-name vX.Y.Z](https://github.com/fivexl/{repo}/releases/tag/vX.Y.Z)**  
    One-sentence description of what the project is. What changed in this release. Why / when it matters.
  ```

- Mention concrete inputs, flags, or behaviour changes — readers should understand the diff without clicking through.
- If no changes require action from existing users, say so explicitly ("Existing setups require no changes.").

#### 3b. Blog post and case study updates

- Use heading `### Blog post updates` (when there are no case studies) or `### Blog post and case study updates` (when there are).
- Bullet list — blog posts and case studies together in one section, case studies first when present.
- For **case studies**, use this format:

  ```markdown
  - **[Customer Name Case Study](https://fivexl.io/case-studies/{slug}/)**  
    Customer's challenge → what FivexL delivered → who should read it.
  ```

  End each case study description with a line aimed at the reader: "If you're doing X, this one's for you" / "Worth reading if you're planning Y."

- For **blog posts**, same bullet format:

  ```markdown
  - **[Blog Post Title](https://fivexl.io/blog/{slug}/)**  
    2–4 sentences — what the post covers and who benefits.
  ```

- **Always include a link to the previous month's newsletter as the last item**, with a short "Missed last month? Catch up on…" nudge.

#### 3c. Podcast: DevSecOps Talks

- Start with the **standard boilerplate paragraph** (copy from the block below and keep it verbatim):

  > Our co-founder [Andrey Devyatkin](https://fivexl.io/specialist/andrey-devyatkin/) hosts the DevSecOps Talks podcast together with Paulina Dubas and Mattias Hemmingsson. Paulina is an independent Lead DevOps Engineer/Architect who spent the last decade building and shaping cloud platforms. Mattias is a former CISO at a car rental company, a certified pentester, and a cloud engineering enthusiast. Together they use the show to sanity-check new trends, share what actually works in the field, and translate "DevSecOps" from buzzword back into day-to-day practice.

- Follow with a transition sentence: "In {Month}, they released {N} new episode(s): {brief one-liner per episode}."
- Then one sub-section per episode:

  ```markdown
  #### Episode #{number} – {Title}

  2–3 sentence summary of the conversation: topic, key takeaways, what the listener will walk away with.

  [Listen the full episode]({url})
  ```

#### 3d. Top articles from the team *(optional)*

- Heading: `### Top {N} articles from the team` (N is typically 3 or 10).
- Optional one-line intro explaining the curation (e.g. "From everything our team shared internally this month…").
- Numbered list; each item is a link followed by an optional 1–2 sentence annotation or "Use case:" blurb.

### 4. Closing Line

Use one of these two variants (alternate or pick whichever fits):

- `Made it till the end? Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do! Sharing is caring!`
- `Liked this newsletter? Forward it to a teammate or friend who lives in AWS as much as you do.`

---

## Tone & Style

- **Conversational but professional.** Write the way you'd talk to a peer engineer over coffee — direct, specific, no filler.
- **No emojis** in the newsletter body.
- **Practical framing.** Describe things in terms of what a reader can *do* with them: adopt, test, watch out for, skip.
- Prefer "you" over "users" or "engineers."
- Avoid marketing superlatives ("groundbreaking", "game-changing"). Say what changed and why it matters.
- Keep paragraphs short — 2–4 sentences max.
- Use bold for project/release names inside bullet lists. Use `code formatting` for variable names, flags, and CLI commands.
- Link team members to their specialist pages on fivexl.io, not to LinkedIn or GitHub profiles.

---

## Checklist Before Publishing

- [ ] Front matter fields are complete and `date` reflects the actual publish date.
- [ ] `panel_image` alternates from the previous newsletter.
- [ ] Intro paragraph does not use "busy month" or equivalent.
- [ ] Every release, blog post, case study, and episode has a working link.
- [ ] Podcast boilerplate paragraph is present and unchanged.
- [ ] Previous month's newsletter is linked under "Blog post updates."
- [ ] Closing line is present.
- [ ] No empty sections or headings without content.
- [ ] Spell-check and link-check pass.
