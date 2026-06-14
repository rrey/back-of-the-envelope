---
title: "How many friend relationships exist in a 100M-user social network?"
difficulty: easy
category: compute
tags: [graph, social-media, capacity-planning, data-structures]
hints:
  - "The network has 100 million active users."
  - "On average, each user has 50 friend connections."
  - "Total relationships = users × average friends per user. Express your answer in billions."
answer:
  value: 5
  unit: "billion relationships"
  tolerance: 0.5
explanation: "100 million users × 50 friends/user = 5 billion friend relationships. At 8 bytes per user_id × 2 IDs per edge = 16 bytes/edge, that's 80 GB just for the graph adjacency data — before any indexes. This is why social graphs need sharding: a single machine with 64 GB RAM can't hold the full graph in memory. Facebook's social graph at 2B+ users represents orders of magnitude more."
keyValues:
  - label: "Users"
    value: "100 million"
  - label: "Avg friends/user"
    value: "50"
  - label: "Graph storage (edges only)"
    value: "~80 GB"
source:
  label: "donnemartin/system-design-primer — Design a Social Graph"
  url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/social_graph/README.md"
---

## The scenario

You're designing the data layer for a social graph service — think Facebook friends or LinkedIn connections. The network has **100 million active users**. Based on usage data, the average user maintains **50 friend connections**.

Friend relationships are bidirectional and stored as directed edges (each friendship stored once per direction for fast lookup).

How many **total friend relationships** does the database need to store? Express your answer in billions.
