---
title: "How many tweets per second does Twitter need to ingest?"
difficulty: medium
category: networking
tags: [throughput, twitter, social-media, write-heavy]
hints:
  - "Twitter processes ~500 million tweets per day, or 15 billion per month."
  - "There are 86,400 seconds in a day."
  - "Divide daily tweets by seconds per day to get the sustained write rate."
answer:
  value: 6000
  unit: "tweets/s"
  tolerance: 0.25
explanation: "500M tweets/day ÷ 86,400 s/day ≈ 5,800 — round to 6,000 tweets/s. Handy shortcut: 400 req/s ≈ 1 billion req/month, so 15B/month × 0.4k = 6,000/s. Each tweet then fans out to followers: at an average of 10 deliveries per tweet, that's ~60,000 fanout writes/s — 10× the ingest rate."
keyValues:
  - label: "Tweets per day"
    value: "500 million"
  - label: "Seconds per day"
    value: "86,400"
  - label: "Fanout deliveries/s"
    value: "~60,000"
source:
  label: "donnemartin/system-design-primer — Design Twitter Timeline"
  url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/twitter/README.md"
---

## The scenario

Your team is designing the write pipeline for a Twitter-scale platform. The service has **100 million active users** posting **500 million tweets per day**.

Traffic is not evenly distributed (spikes around events, timezone peaks), but for capacity planning you use the average sustained rate.

What is the **average tweet ingest rate** in tweets per second?
