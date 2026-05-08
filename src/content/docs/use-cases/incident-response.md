---
title: Incident Response
description: On-call SRE investigation with scoped read-only agents
---

import { Card, CardGrid } from '@astrojs/starlight/components';

## The problem

At 3 AM you want answers, not permission prompts. Every `kubectl get`, `curl` to the metrics endpoint, and `journalctl` query should be auto-approved. But a hallucinated `kubectl delete` should be blocked outright.

## The manifest

```yaml
version: 1
mission_id: inc-prod-latency
description: "Investigate p99 latency spike on API gateway production"
author: sre-oncall
pattern: plan-then-execute
mission_ttl_hours: 4
agents:
  - role: platform_engineer
    task: "Investigate k8s cluster, check pod health and resource usage"
  - role: sre
    task: "Check metrics, logs, and recent deploys for regressions"
  - role: auditor
scope:
  paths:
    - /home/sre/incident-2026-0501
  bash_patterns:
    extra_allow:
      - '^kubectl (get|describe|logs|top|events)\b'
      - '^curl https://(grafana|prometheus)\.internal\b[^&;|`$()]*$'
    extra_deny:
      - '^kubectl (delete|apply|edit|patch|scale|exec)\b'
      - '^rm -rf'
      - '^sudo\b'
mission_gate: enforce
acceptance_criteria:
  - "Root cause identified with evidence from logs/metrics"
  - "Mitigation proposed or rollback confirmed"
  - "Incident report started"
metadata:
  ticket: INC-12345
tags: [incident, prod, sre]
```

## Validate and spawn

```bash
colmena mission validate incident-latency.mission.yaml
colmena mission spawn --from incident-latency.mission.yaml
```

## What the firewall enforces

<CardGrid stagger>
  <Card title="Auto-approved" icon="approve-check-circle">
    <code>kubectl get pods -n prod</code><br/>
    <code>kubectl logs checkout-api-xyz --tail=200</code><br/>
    <code>curl -s https://grafana.internal/api/v1/query</code><br/>
    <code>journalctl -u kubelet --since "1 hour ago"</code>
  </Card>
  <Card title="Blocked" icon="close">
    <code>kubectl delete deployment checkout-api</code><br/>
    Any read of <code>*.env</code>, <code>*credentials*</code>, <code>*.key</code><br/>
    <code>sudo</code> commands<br/>
    <code>rm -rf</code>
  </Card>
</CardGrid>

## Outcome

Root cause identified in 15 minutes: a canary deployment with a misconfigured connection pool. Incident report drafted with timeline and evidence. Agent deactivated with `colmena mission deactivate --id inc-prod-latency`. Audit trail intact for the post-mortem.
