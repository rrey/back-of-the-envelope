---
title: "How much storage does a Google-scale web crawler need per month?"
difficulty: hard
category: storage
tags: [storage, capacity-planning, web-crawler, google-scale]
hints:
  - "The average stored size of a crawled web page (compressed HTML + assets) is about 500 KB."
  - "Google-scale: roughly 1 billion unique pages, but each is refreshed on average ~4 times per month — so 4 billion link fetches per month."
  - "Multiply 500 KB × 4 billion, then convert: 1 TB = 10^6 MB = 10^9 KB."
answer:
  value: 2
  unit: "PB/month"
  tolerance: 0.5
explanation: "500 KB/page × 4 billion pages/month = 2,000 TB = 2 PB/month. Over 3 years: 72 PB. This is why web-scale crawling requires a distributed filesystem (GFS/Colossus) — a single machine's NVMe tops out around 100 TB. The write load is 1,600 write requests/second just for storing pages, before indexing."
keyValues:
  - label: "Size per web page"
    value: "~500 KB"
  - label: "Links crawled/month"
    value: "4 billion"
  - label: "3-year total"
    value: "~72 PB"
source:
  label: "donnemartin/system-design-primer — Design a Web Crawler"
  url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/web_crawler/README.md"
---

## The scenario

You're designing a Google-scale web crawler. The crawler maintains an index of **1 billion web pages**. To keep search results fresh, pages are re-crawled on average **4 times per month** — so you're fetching and storing roughly **4 billion pages per month**.

The average stored page (HTML, compressed) is **500 KB**.

How much raw storage does the crawler need to provision **per month**?
