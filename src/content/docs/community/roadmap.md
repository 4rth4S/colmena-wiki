---
title: Roadmap
description: Past and planned milestones for Colmena development
---

import { Steps, Card, CardGrid } from '@astrojs/starlight/components';

Colmena is developed in numbered milestones. Each milestone ships a coherent set of features.

## Completed milestones

<CardGrid stagger>
  <Card title="M0" icon="check-circle">
    Trust Firewall + Approval Hub. Core rule engine and permission system.
  </Card>
  <Card title="M1" icon="check-circle">
    Wisdom Library + Pattern Selector + RRA hardening.
  </Card>
  <Card title="M2" icon="check-circle">
    Auditor Review Protocol + ELO Engine + Findings Store.
  </Card>
  <Card title="M3" icon="check-circle">
    Dynamic trust calibration. Role-bound permissions + ELO to firewall rules.
  </Card>
  <Card title="M4" icon="check-circle">
    Mentor prompt refinement. Debate pattern for prompt improvement.
  </Card>
  <Card title="M5" icon="check-circle">
    Plug-and-play onboarding: `colmena setup` command.
  </Card>
  <Card title="M6" icon="check-circle">
    Intelligent role and pattern creation. 8 role categories, 7 topologies.
  </Card>
  <Card title="M7" icon="check-circle">
    Generic roles, patterns, topology mapping, QPC auditor framework, inter-agent directive.
  </Card>
</CardGrid>

### M7 sub-milestones

| Sub | Focus | Status |
|-----|-------|--------|
| M7.1 | Mission Spawn + Mission Gate | Done |
| M7.2 | Mission Sizing / colmena suggest | Done |
| M7.3 | ELO cycle auto-closure | Done |
| M7.4 | Role creation ergonomics | Done |
| M7.5 | DevOps/SRE role expansion | Done |
| M7.6 | Install Mode B as first-class | Done |
| M7.8 | Prompt injection defense | Done |
| M7.10 | Chain-aware firewall evaluator | Done |
| M7.12 | Library extension mechanism | Done |
| M7.13 | crates.io publication | Design pending |

## Current state

**Version:** 0.14.0
**Branch:** feat/chain-aware-firewall -- M7.10 ready for PR.

## Planned work

| Area | Description |
|------|-------------|
| M7.7 | Multi-perspective reviewer diversification |
| M7.9 | Role creation CLI |
| M7.11 | Expanded patterns and topologies |
| crates.io | Publish Colmena crates to crates.io |
| Post-launch | serde_yml to serde_yaml_ng migration, RUSTSEC-2026-0097 rand upgrade |

## How to influence the roadmap

Open a [GitHub Issue](https://github.com/4rth4S/colmena/issues) for feature requests. No Discord, Slack, or community channels yet. Issues only for now.
