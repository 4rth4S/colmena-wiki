---
title: System Overview
description: High-level architecture of Colmena's four crates and five integration points
---

import { Card, CardGrid } from '@astrojs/starlight/components';

Colmena is a Rust workspace (edition 2021, stable toolchain) with four crates and two binaries.

## Workspace layout

```
colmena/
  Cargo.toml              # Workspace root, single version (0.14.0)
  colmena-core/           # Shared library -- all business logic, zero platform deps
  colmena-cli/            # CLI binary: `colmena` (hooks + subcommands)
  colmena-filter/         # Output-filtering pipeline (used by CLI PostToolUse)
  colmena-mcp/            # MCP server binary: `colmena-mcp`
  config/                 # Default YAML/JSON config + library files (embedded via include_str!)
```

### Dependency graph

```
colmena-cli ──┐
              ├──> colmena-core  (all business logic)
colmena-mcp ──┘          ^
      │                  │
      └──> colmena-filter ┘  (depends only on serde/regex)
```

- **colmena-core** -- no platform dependencies. Owns config parsing, firewall evaluator, delegations, ELO engine, reviews, calibration, wisdom library, mission manifest.
- **colmena-cli** -- depends on `colmena-core` for logic and `colmena-filter` for PostToolUse. Uses `clap` (derive).
- **colmena-mcp** -- depends on `colmena-core` and `colmena-filter`. Uses `rmcp` + `tokio` for stdio JSON-RPC.
- **colmena-filter** -- consumer of `serde`/`regex` with a trait and four filters.

## The five CC integration points

<CardGrid stagger>
  <Card title="PreToolUse" icon="analytics">
    Reactive. Before every tool call. Evaluates against firewall rules, delegations, ELO, and mission gate. Completes in under 100ms.
  </Card>
  <Card title="PostToolUse" icon="magnifier">
    Reactive. After Bash completes. Runs filter pipeline: ANSI strip, stderr-only, dedup, truncate. Saves 30-50% tokens.
  </Card>
  <Card title="PermissionRequest" icon="approve-check-circle">
    Reactive. When CC would prompt. Auto-approves role-scoped tools via CC session rules. Only for source:"role" delegations.
  </Card>
  <Card title="SubagentStop" icon="error">
    Reactive. When a subagent finishes. Blocks mission workers without review_submit. Reviewer gate blocks without review_evaluate.
  </Card>
  <Card title="MCP Server" icon="server">
    Proactive. 27 tools: firewall, library, review, ELO, findings, alerts, mission spawn, stats. Callable from CC as mcp__colmena__*.
  </Card>
</CardGrid>

## File-based state

No databases, no servers. All state is on disk:

| File | Purpose |
|------|---------|
| `runtime-delegations.json` | Live role/human delegations |
| `runtime-agent-overrides.json` | Calibration-produced agent-scoped rule overrides |
| `alerts.json` | Append-only alert list |
| `audit.log` | Every firewall decision (append, 10MB rotation) |
| `elo/events.jsonl` | Every ELO delta (append-only) |
| `reviews/pending/*.json` | Auditor review lifecycle |
| `findings/<mission>/*.json` | Findings from reviews (5000 hard cap) |

## Key design principles

- **Under 100ms** PreToolUse latency budget -- Rust, pre-compiled regexes, no network calls
- **Safe fallback** -- any hook failure returns `ask`, never `deny` or crash
- **Files over databases** -- YAML config, JSON queue, JSONL logs, git-versionable
- **Human authority wins** -- YAML overrides always beat ELO
