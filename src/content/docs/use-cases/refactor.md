---
title: Refactor Mission
description: Cross-crate refactoring with iterative review cycles
---

import { Steps, Card, CardGrid } from '@astrojs/starlight/components';

**Persona.** Developer or tech lead. A Rust workspace with 4 crates needs a refactor that touches all crates. One agent cannot track cross-crate side effects.

**Pattern.** `colmena-self-dev` -- iterative topology with multiple developers, a code reviewer, and an architect.

## The problem

A refactor touches `colmena-core`, `colmena-cli`, `colmena-mcp`, and `colmena-filter` at the same time. If one agent owns the whole workspace, the context window is too small. You need agents scoped per crate, a coordinator to catch regressions, and a reviewer who reads the full diff.

## The manifest

```yaml
version: 1
mission_id: colmena-refactor
description: "Refactor Colmena's review subsystem to reduce coupling"
author: operator
pattern: colmena-self-dev
mission_ttl_hours: 16
agents:
  - role: colmena_developer
    count: 2
    instances: [core, cli]
    task: "Implement review subsystem refactor per ARCHITECT_PLAN"
  - role: colmena_code_reviewer
    task: "Review diffs with QPC framework"
  - role: auditor
scope:
  paths:
    - /home/user/colmena
  bash_patterns:
    extra_allow:
      - '^cargo (build|test|clippy|fmt)\b'
      - '^git (diff|log|status|add|commit)\b'
mission_gate: enforce
budget:
  max_hours: 16
  max_agents: 12
acceptance_criteria:
  - "All existing tests pass"
  - "No regression in review cycle"
  - "ELO events recorded for all agents"
tags: [dev, rust, colmena-self]
```

## Validate and spawn

```bash
colmena mission validate colmena-refactor.mission.yaml
colmena mission spawn --from colmena-refactor.mission.yaml
```

## Iterative workflow

<Steps>
1. **Iteration 1.** core agent refactors the review subsystem. CLI agent updates the CLI. Both submit for review.
2. **Review gate.** code_reviewer reads both diffs, checks for cross-crate dependency leaks, files findings.
3. **Architect decision.** If both pass review, the iteration closes. If either fails, agents get findings and start iteration 2.
4. **Auditor.** After the final iteration, the auditor scores the full cycle with QPC.
</Steps>

## Key features

- **`workspace_scope: repo-wide`** -- agents can read and write any file in the repo. Sensitive paths excluded automatically.
- **`path_within` scoped per crate** -- core agent owns `colmena-core/`, CLI agent owns `colmena-cli/` and `colmena-mcp/`.
- **Low scores trigger alerts** -- the architect sees them via `alerts_list`.

## Outcome

Refactor lands in 2 hours. 12 reviews. Zero regressions on `cargo test --workspace`. ELO moves for both developer and code_reviewer roles.
