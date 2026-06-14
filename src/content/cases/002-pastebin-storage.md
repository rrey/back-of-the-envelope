---
title: "How much storage does a Pastebin-like service need over 3 years?"
difficulty: medium
category: storage
tags: [storage, capacity-planning, pastebin]
hints:
  - "A typical paste is ~1 KB of text. With metadata (shortlink, timestamps, file path): roughly 1.27 KB total per paste."
  - "A Pastebin-scale service handles ~10 million paste writes per month."
  - "Monthly storage growth × 36 months gives you the 3-year total."
answer:
  value: 450
  unit: "GB"
  tolerance: 0.25
explanation: "Each paste is ~1.27 KB (1 KB content + ~270 bytes of metadata). At 10M pastes/month: 1.27 KB × 10M = 12.7 GB/month. Over 36 months: 12.7 × 36 ≈ 450 GB. Text-only storage compresses well — with gzip (~5×) you'd land around 90 GB on disk, but plan for the uncompressed worst case when sizing."
keyValues:
  - label: "Size per paste"
    value: "~1.27 KB"
  - label: "Monthly writes"
    value: "10 million"
  - label: "Monthly growth"
    value: "~12.7 GB/month"
source:
  label: "donnemartin/system-design-primer — Design Pastebin.com"
  url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/pastebin/README.md"
---

## The scenario

You're sizing storage for a Pastebin-like service: users paste blocks of text, receive a short URL, and the content lives until it expires. No image hosting — text only.

The service has **10 million users** generating **10 million paste writes per month** (10:1 read-to-write ratio). A typical paste is about 1 KB of content.

How much **total storage** (metadata + content) does the service need to cover **3 years of data**?
