---
title: Missions & Delegations
description: Multi-agent missions, manifests, and runtime permission scoping
---

import { Tabs, TabItem, Steps, Card, CardGrid } from '@astrojs/starlight/components';

Missions are the unit of multi-agent work in Colmena. A mission defines who works on what, with what permissions, and how the work is reviewed.

## The mission manifest

Every mission starts with a manifest -- a YAML file that declares the squad:

```yaml
version: 1
mission_id: my-mission
description: "review auth module and improve test coverage"
author: operator
pattern: code-review-cycle
mission_ttl_hours: 8
agents:
  - role: developer
    task: "Add tests for auth module"
  - role: code_reviewer
    task: "Review auth module changes"
  - role: auditor
scope:
  paths:
    - /home/you/your-project
  bash_patterns:
    extra_allow:
      - '^cargo (build|test|check|clippy)\b'
mission_gate: enforce
```

Key fields:
- **pattern** -- determines agent topology (sequential, fan-out, adversarial, etc.)
- **agents** -- list of roles with their tasks
- **scope** -- filesystem paths and bash patterns
- **mission_ttl_hours** -- how long the mission lives

## Orchestration patterns

Colmena ships with 13 built-in patterns across 7 topologies:

<CardGrid stagger>
  <Card title="Sequential" icon="right-arrow">
    Agents work one after another. Pipeline and code-review-cycle use this topology.
  </Card>
  <Card title="Fan-out-merge" icon="external">
    Multiple agents work in parallel, then a coordinator merges results.
  </Card>
  <Card title="Hierarchical" icon="puzzle">
    A coordinator delegates to workers. Plan-then-execute uses this topology.
  </Card>
  <Card title="Adversarial" icon="rocket">
    Agents with opposing goals. Red team vs blue team scenarios.
  </Card>
  <Card title="Iterative" icon="random">
    Work goes through cycles of improvement until quality criteria are met.
  </Card>
  <Card title="Recursive" icon="random">
    Agents decompose problems recursively, each level adding detail.
  </Card>
</CardGrid>

## Runtime delegations

Delegations are time-limited permission grants. When a mission spawns, each agent gets tools and bash patterns scoped to their role:

- **Developer** -- `Read`, `Write`, `Edit`, `Bash` (with cargo/git patterns)
- **Code reviewer** -- `Read`, `Glob`, `Grep` (no `Write` or `Edit`)
- **Auditor** -- `mcp__colmena__review_evaluate`, `mcp__colmena__findings_query`

Key properties:
- Every delegation has a TTL (max 24h, default 8h for missions)
- Bash delegations require explicit patterns
- Delegations are persisted in `runtime-delegations.json`

## Mission lifecycle

<Steps>
1. **Init** -- `colmena mission init` creates a manifest
2. **Validate** -- `colmena mission validate` checks the schema
3. **Spawn** -- `colmena mission spawn` creates agents, delegations, and prompts
4. **Run** -- Agents work in the defined topology
5. **Review** -- Each agent submits for auditor review
6. **Deactivate** -- `colmena mission deactivate` revokes all delegations
</Steps>

## Mission enforcement

When `enforce_missions` is active:
- The `SubagentStop` hook blocks workers from stopping without `review_submit`
- The reviewer gate blocks reviewers from stopping without `review_evaluate`
- The mission revocation kill switch overrides CC session rules

## Related

- [ELO & Accountability](/concepts/elo) -- how trust is earned
- [Manifest Schema](/reference/manifest-schema) -- full YAML reference
- [CLI Commands](/reference/cli) -- all mission subcommands
