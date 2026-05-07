---
title: Scoped Autonomy
description: How Colmena balances agent freedom with deterministic enforcement
---

import { Card, CardGrid } from '@astrojs/starlight/components';

Colmena gives agents **freedom within their domain**, with **deterministic enforcement** at the boundary. This page explains the core design philosophy.

## The problem

Every team running Claude Code hits the same wall: approve every tool call by hand, or grant blanket permissions and hope for the best. Neither scales when multiple agents run in parallel and compliance matters.

- **Y-spam.** Answering "y" to every safe `Read` and `cargo test` is friction, not security.
- **Blanket allow.** Once you enable "allow all", you have no audit trail and no accountability.
- **Multi-agent chaos.** Spawning three agents in parallel with overlapping scopes ends in conflicts.
- **Opaque decisions.** When something goes wrong, you want to know which rule allowed it.

Colmena's position: **policy is code, review is mandatory, trust is earned.**

## Design principles

<CardGrid stagger>
  <Card title="Under 15ms latency" icon="clock">
    Pre-compiled regexes, no network calls, pure Rust. The hook path completes in under 15ms.
  </Card>
  <Card title="Safe fallback" icon="shield">
    Any hook failure returns <code>ask</code> -- never <code>deny</code> or crash. A broken hook must not trap the user.
  </Card>
  <Card title="Files over databases" icon="file">
    YAML config, JSON queue, JSONL logs, git-versionable. No external services or databases.
  </Card>
  <Card title="Human authority wins" icon="users">
    YAML overrides always beat ELO ratings. Revoke everything with a single command.
  </Card>
</CardGrid>

## The trust spectrum

Every role starts at **Uncalibrated** or **Standard** trust. As agents work and reviews accumulate, trust calibrates automatically:

- **Elevated.** Role tools are auto-approved. Bash patterns from the role YAML apply. No "y" prompts for routine work.
- **Standard.** Default rules apply. Routine operations are auto-approved, sensitive ones ask.
- **Restricted.** Every tool call goes through `ask` -- human confirms every time.
- **Probation.** Same as Restricted, with an alert generated.

## Comparison to auto-mode

Anthropic's `--enable-auto-mode` and Colmena solve different layers of the same problem. They are complementary, not competing.

| Dimension | Auto-mode | Colmena |
|-----------|-----------|---------|
| Decision model | Probabilistic (LLM) | Deterministic (YAML rules) |
| Per-call cost | Model tokens per classification | Zero -- no LLM call |
| Explainability | Opaque classifier output | `audit.log` line with matching rule ID |
| Scope | Single-agent intent detection | Single + multi-agent with auditor review |
| Accountability | Per tool call | Per agent + per role, ELO over time |

Auto-mode catches semantic intent the rule base cannot. Colmena enforces the policy you wrote and keeps a tamper-evident local record. Use them together.

## Key takeaway

Scoped autonomy means agents can do their work without friction, but only within boundaries you define. Every boundary is enforced deterministically, logged persistently, and adjustable without restarting.
