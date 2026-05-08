---
title: Mission Lifecycle
description: How missions flow from spawn through review to deactivation
---

import { Steps, Card, CardGrid } from '@astrojs/starlight/components';

The mission lifecycle is the end-to-end flow from manifest creation to deactivation, with the ELO cycle closed at every step.

## End-to-end flow

```
MissionManifest → spawn_mission() → Agent tool calls → 
review_submit → SubagentStop → review_evaluate → 
ELO update → calibrate run → mission deactivate
```

<Steps>

1. **Manifest validation.** `MissionManifest::from_path` validates id, pattern, TTL, roles, and ownership.
2. **Border case check.** If `enforce_missions: false` is explicit and there are 3+ roles, the spawn aborts with options. The operator wins.
3. **Spawn.** `spawn_mission()` resolves the pattern, maps roles to slots, composes prompts, writes subagent files, and creates delegations.
4. **Mission Gate.** Computed from config: explicit true/false honored, auto-activates when role delegations exist.
5. **Agent execution.** Agents work. Every tool call goes through PreToolUse with mission scope.
6. **Review submission.** Worker calls review_submit. Artifact hash-verified, reviewer assigned.
7. **SubagentStop.** Worker blocked from stopping until review submitted. Reviewer blocked until evaluation submitted.
8. **Evaluation.** Auditor calls review_evaluate with QPC scores.
9. **ELO update.** Scores feed per-role ELO with temporal decay. Findings stored.
10. **Calibration.** `colmena calibrate run` maps ELO to trust tiers.
11. **Deactivation.** `colmena mission deactivate` revokes all delegations, marks agents as revoked.

</Steps>

## spawn_mission() internals

The one-step pipeline in `selector.rs`:

```
manifest → resolve pattern → map roles to slots → for each role:
    compose CLAUDE.md (scope + task + review protocol + inter-agent directive)
    + embed MISSION_MARKER_PREFIX
    + write ~/.claude/agents/<role>.md
    + generate RuntimeDelegations
  → decide_merge each delegation
  → persist runtime-delegations.json
  → return SpawnResult
```

## Subagent files

Each role gets `~/.claude/agents/<role_id>.md` with:

```yaml
---
name: <mission_id>__<role>-<instance>
description: "<role description from library>"
colmena_auto_generated: true
tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, mcp__colmena__review_submit, mcp__colmena__review_evaluate
---
```

The `name` field MUST match the delegation agent_id for ELO to track correctly. CC propagates this name as the agent identity in hook payloads.

## Delegation lifecycle

1. **Create** -- by `mission spawn` with TTL (default 8h, max 24h)
2. **Use** -- loaded on every PreToolUse. Expired entries pruned and logged
3. **Merge on re-spawn** -- `decide_merge` checks existing TTL coverage
4. **Revoke** -- by `mission deactivate` (bulk) or `delegate revoke` (single)

## Mission Gate activation

Three-state decision:

- `Some(true)`: gate always on. Agent tool without marker triggers Ask.
- `Some(false)`: gate off. Operator consciously opted out.
- `None` (unset): gate auto-activates when role delegations exist, deactivates when the last one expires.

The `--session-gate` flag on `mission spawn` overrides explicit `false` for one session.

## Related

- [ELO & Accountability](/concepts/elo) -- trust calibration
- [Missions & Delegations](/concepts/missions) -- manifest format
- [Manifest Schema](/reference/manifest-schema) -- YAML reference
