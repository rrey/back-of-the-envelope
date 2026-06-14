---
title: "How much storage does Twitter need per month for tweet content?"
difficulty: hard
category: storage
tags: [storage, capacity-planning, twitter, social-media]
hints:
  - "A tweet has up to 140 bytes of text, but most tweets include media. Account for that: average ~10 KB per tweet."
  - "Twitter handles ~500 million tweets per day."
  - "Multiply: size/tweet × tweets/day × 30 days/month, then convert to TB."
answer:
  value: 150
  unit: "TB/month"
  tolerance: 0.25
explanation: "10 KB/tweet × 500M tweets/day × 30 days = 150,000 GB = 150 TB/month. Over 3 years that reaches ~5.4 PB. Text alone (140 bytes × 500M × 30) would be only ~2 TB — media (photos, videos) completely dominates storage. This scale requires distributed object storage (like S3) and a CDN for delivery."
keyValues:
  - label: "Size per tweet (with media)"
    value: "~10 KB avg"
  - label: "Tweets per day"
    value: "500 million"
  - label: "3-year total"
    value: "~5.4 PB"
source:
  label: "donnemartin/system-design-primer — Design Twitter Timeline"
  url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/twitter/README.md"
---

## The scenario

You're doing capacity planning for a Twitter-scale social platform. The service has **100 million active users** and receives **500 million tweets per day**.

A tweet record includes: tweet ID (8 bytes), user ID (32 bytes), text (up to 140 bytes), and — critically — an average of ~10 KB of attached media per tweet.

How much **new storage** does the platform need to provision **per month**?
