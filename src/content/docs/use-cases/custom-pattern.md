---
title: Custom Pattern
description: Creating and using custom orchestration patterns
---

import { Tabs, TabItem, Card, CardGrid } from '@astrojs/starlight/components';

## When to create a custom pattern

The built-in 13 patterns cover most scenarios, but you may need a custom pattern when:

- Your team has a specific workflow that doesn't match existing topologies
- You need specialized role interactions beyond the standard patterns
- You're running recurring operations that should be standardized

## Creating a custom pattern

```bash
colmena library create-pattern --id security-audit-pipeline \
  --description "Three-stage security audit with parallel scanners and centralized review" \
  --topology fan-out-merge
```

This generates a pattern scaffold. Customize it in `config/library/patterns/security-audit-pipeline.yaml`.

## Example: security audit pipeline

```yaml
version: 1
mission_id: security-audit-q2
description: "Q2 security audit of API gateway and microservices"
author: security-lead
pattern: security-audit-pipeline
mission_ttl_hours: 24
agents:
  - role: web_pentester
    task: "Scan API gateway for OWASP Top 10 vulnerabilities"
  - role: api_pentester
    task: "Test microservice API endpoints for auth bypass and injection"
  - role: security_hardener
    task: "Review infrastructure config for security misconfigurations"
  - role: auditor
scope:
  paths:
    - /home/user/security/audit-q2
  bash_patterns:
    extra_allow:
      - '^curl\b'
      - '^nmap\b'
      - '^python3?\b'
    extra_deny:
      - '^rm -rf'
      - '^sudo\b'
mission_gate: enforce
auditor_pool: ["auditor"]
budget:
  max_hours: 24
  max_agents: 8
acceptance_criteria:
  - "All OWASP Top 10 categories assessed"
  - "Findings filed with severity and remediation steps"
  - "Evidence artifacts hash-verified"
metadata:
  audit_period: "2026-Q2"
  standard: "OWASP ASVS v4.0"
tags: [security, audit, custom-pattern]
```

## Pattern topologies

Colmena supports 7 topologies. Choose the one that fits your workflow:

<CardGrid stagger>
  <Card title="Sequential" icon="right-arrow">
    Agents work one after another. Each receives the previous agent's output.
  </Card>
  <Card title="Fan-out-merge" icon="external">
    Multiple agents work in parallel, then a coordinator merges results.
  </Card>
  <Card title="Hierarchical" icon="puzzle">
    A coordinator delegates to workers. Used by plan-then-execute.
  </Card>
  <Card title="Adversarial" icon="rocket">
    Two agents with opposing goals. Red team vs blue team.
  </Card>
  <Card title="Peer" icon="puzzle">
    Agents work independently and share findings as peers.
  </Card>
  <Card title="Iterative" icon="random">
    Work cycles through improvement until quality criteria are met.
  </Card>
  <Card title="Recursive" icon="random">
    Problems decomposed recursively, each level adding detail.
  </Card>
</CardGrid>

## Custom roles

Pair custom patterns with custom roles:

```bash
colmena library create-role --id security_auditor \
  --description "Security audit specialist with pentest and hardening focus" \
  --category defensive
```

Custom roles and patterns work with the full stack -- trust firewall, scoped delegations, auditor review, ELO ratings.

## Outcome

Security audit runs with three parallel scanners and centralized auditor review. Findings store contains all evidence with severity and remediation steps. ELO events recorded for all roles.
