---
title: "How many transactions per second does a Mint-scale finance platform process?"
difficulty: medium
category: compute
tags: [throughput, fintech, transactions, write-heavy]
hints:
  - "A personal finance aggregator like Mint handles ~5 billion financial transactions per month across all users."
  - "Handy rule: 1 req/s = 2.5 million req/month (there are 2.5 million seconds in a month)."
  - "Divide total transactions by seconds per month."
answer:
  value: 2000
  unit: "TPS"
  tolerance: 0.25
explanation: "5 billion transactions/month ÷ 2.5 million seconds/month = 2,000 TPS. This is a write-heavy workload (10:1 write-to-read ratio) — the opposite of most web apps. At ~50 bytes per transaction record, 2,000 TPS is only ~100 KB/s of bandwidth, but it demands high IOPS and durable writes — ruling out in-memory-only stores."
keyValues:
  - label: "Transactions/month"
    value: "5 billion"
  - label: "Seconds/month"
    value: "2.5 million"
  - label: "Record size"
    value: "~50 bytes"
source:
  label: "donnemartin/system-design-primer — Design Mint.com"
  url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/mint/README.md"
---

## The scenario

You're designing the transaction ingestion pipeline for a Mint-like personal finance platform. The service aggregates financial data for **10 million users**, each with an average of 3 linked bank/credit accounts.

Across all users and accounts, the platform processes **5 billion financial transactions per month** — with a 10:1 write-to-read ratio (people spend daily, but rarely open the app to review).

What is the average **sustained transaction write throughput** in transactions per second?
