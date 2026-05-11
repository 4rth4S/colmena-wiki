---
title: Your First Mission
description: Create a manifest and spawn your first multi-agent mission
---

import { Tabs, TabItem, Card, CardGrid } from '@astrojs/starlight/components';

Missions start with a manifest -- a YAML file that defines the squad, their roles, their scope, and how they work together.

## Creating the manifest

```bash
colmena mission init my-first-mission --for "review the auth module and improve test coverage"
```

This generates `my-first-mission.mission.yaml` in the current directory:

```yaml
version: 1
mission_id: my-first-mission
description: "review the auth module and improve test coverage"
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
      - '^git (diff|log|status)\b'
mission_gate: enforce
```

Every manifest has a `version`, a `mission_id`, a list of `agents` with roles and tasks, and a `scope` section.

## Validate the manifest

```bash
colmena mission validate my-first-mission.mission.yaml
```

This checks the schema, verifies role IDs exist in the library, and confirms the pattern is valid.

## Dry run first

See what would happen before committing:

```bash
colmena mission spawn --from my-first-mission.mission.yaml --dry-run
```

The dry run prints three sections:

- **Pattern and topology** -- the order agents work in
- **Agent prompts (preview)** -- each agent gets a scoped prompt
- **Delegations (preview)** -- each role gets time-limited permissions

## Spawn for real

```bash
colmena mission spawn --from my-first-mission.mission.yaml
```

This writes agent prompts, creates time-limited delegations, and embeds mission markers.

### Auto-spawn

For missions with 3+ agents, use `--auto-spawn` to generate a Mission Lead:

```bash
colmena mission spawn --from my-first-mission.mission.yaml --auto-spawn
```

This generates a single Mission Lead subagent that orchestrates the entire squad — one prompt into CC handles the full mission. Without the flag, mission_spawn writes individual agent prompts to stdout.

## Run the mission

<Tabs>
<TabItem label="Phase 1: Developer">

Paste the developer prompt into an Agent tool call. The developer reads the auth module, writes tests, and runs them. When the developer tries to stop, the `SubagentStop` hook intercepts and requires `review_submit` first.

</TabItem>
<TabItem label="Phase 2: Reviewer">

Paste the code reviewer prompt. The reviewer reads the diff, comments on test coverage, and files findings. The reviewer must also submit before stopping.

</TabItem>
<TabItem label="Phase 3: Auditor">

Paste the auditor prompt. The auditor reads both artifacts and evaluates with QPC scores (Quality, Precision, Comprehensiveness). Scores feed ELO ratings.

</TabItem>
</Tabs>

## Mission enforcement

- **SubagentStop hook** -- blocks agents from stopping without `review_submit`
- **Reviewer gate** -- blocks reviewers from stopping without `review_evaluate`
- **Mission deactivation** -- `colmena mission deactivate --id my-first-mission` revokes all delegations
- **Every tool call is logged** to `config/audit.log`

## Next steps

- [Trust Firewall](/concepts/trust-firewall) -- understand the rule system
- [Missions & Delegations](/concepts/missions) -- learn about mission lifecycle
- [CLI Commands](/reference/cli) -- full command reference
