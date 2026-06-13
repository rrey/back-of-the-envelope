---
title: "How many requests per second can one app server handle?"
difficulty: medium
category: networking
tags: [throughput, servers, latency]
hints:
  - "Think about typical thread pool sizes for a modern app server."
  - "If each request takes ~10ms to process, how many can one thread serve per second?"
  - "Multiply per-thread throughput by the thread count."
answer:
  value: 10000
  unit: "req/s"
  tolerance: 0.5
explanation: "A modern app server with ~100 worker threads, each handling a 10ms request, processes about 100 req/s per thread × 100 threads = ~10,000 req/s. Real-world numbers vary widely with workload (CPU-bound vs IO-bound), but ~10k req/s is a useful ballpark for a single well-tuned instance serving simple endpoints."
keyValues:
  - label: "Typical thread pool"
    value: "100–500 threads"
  - label: "Simple request latency"
    value: "5–20 ms"
  - label: "Per-instance throughput"
    value: "~10k req/s"
---

## The scenario

Your company runs a monolithic web app on a fleet of identical app servers behind a load balancer. Each server has 8 cores, 32 GB of RAM, and runs a typical JVM-based stack.

You're sizing capacity for a new endpoint that does a single database lookup and returns JSON. The endpoint is roughly as expensive as the existing "get user profile" endpoint, which you've measured at ~10ms p50 latency.

About how many requests per second can a **single** server handle for this endpoint?
