---
title: "How much disk does one day of access logs use?"
difficulty: easy
category: storage
tags: [logging, disk, retention]
hints:
  - "Estimate per-log-line size (a typical access log line is a few hundred bytes)."
  - "Multiply by daily request volume."
answer:
  value: 100
  unit: "GB/day"
  tolerance: 0.25
explanation: "A typical access log line — IP, timestamp, method, path, status, user-agent, latency — is around 500 bytes. At 200M requests/day, that's 200M × 500B = 100 GB/day uncompressed. With gzip, expect ~10–20 GB/day. This matters for retention planning: 30 days uncompressed = ~3 TB."
keyValues:
  - label: "Typical access log line"
    value: "200–800 bytes"
  - label: "Compression ratio (gzip)"
    value: "5–10×"
  - label: "1 day at 200M req"
    value: "~100 GB raw"
---

## The scenario

You operate a service that handles roughly 200 million requests per day. Every request emits one line to an access log (think nginx combined format: IP, timestamp, method, path, status code, user-agent, response time).

How much disk does **one day** of raw (uncompressed) access logs consume?
