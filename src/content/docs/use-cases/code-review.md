---
title: Code Review
description: Structured code review with centralized auditor evaluation
---

import { Steps, Card, CardGrid } from '@astrojs/starlight/components';

## The problem

A refactor touches multiple crates at the same time. If one agent owns the whole workspace, the context window is too small. If you split manually, you miss dependencies. You need agents scoped per crate, a coordinator to catch regressions, and a reviewer who reads the full diff.

## The manifest

```yaml
version: 1
mission_id: code-review-auth
description: "Review auth module and harden error handling"
author: operator
pattern: code-review-cycle
mission_ttl_hours: 8
agents:
  - role: developer
    task: "Review auth module, add tests, fix error handling gaps"
  - role: code_reviewer
    task: "Review diffs for logic errors, test coverage, edge cases"
  - role: auditor
scope:
  paths:
    - /home/user/project
  bash_patterns:
    extra_allow:
      - '^cargo (build|test|clippy|fmt)\b'
      - '^git (diff|log|status|add|commit)\b'
mission_gate: enforce
acceptance_criteria:
  - "All existing tests pass"
  - "No regression in auth module"
  - "Error handling covers all public API paths"
tags: [dev, rust, review]
```

## Validate and spawn

```bash
colmena mission validate code-review-auth.mission.yaml
colmena mission spawn --from code-review-auth.mission.yaml
```

## The review cycle

<Steps>

1. **Developer** reads the auth module, writes tests, fixes error handling, and submits for review
2. **Code reviewer** reads the diff, checks for logic errors and test coverage gaps, files findings
3. **Auditor** evaluates both with QPC: Quality, Precision, Comprehensiveness
4. Scores feed ELO. If scores are low, alerts fire and the developer's trust adjusts

</Steps>

## Key benefits

- Code reviewer is genuinely read-only -- no `Write` or `Edit` access
- Every decision is logged to the audit trail
- ELO ratings track accountability over time
- Findings store maintains a searchable record of all issues found

## Outcome

All tests pass. Error handling hardened. ELO events recorded for developer and code_reviewer roles. The audit trail serves as evidence for compliance reviews.
