---
title: Manifest Schema
description: Complete reference for the mission manifest YAML format
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

A mission manifest defines who works on what, with what permissions, and how the work is reviewed. This page documents every field.

## Structure

```yaml
version: 1
mission_id: "<unique-id>"
description: "<human-readable description>"
author: "<operator-id>"
pattern: "<pattern-id>"
mission_ttl_hours: 8
agents:
  - role: "<role-id>"
    task: "<task-description>"
    [count: 1]
    [instances: [name-a, name-b]]
    [model: claude-opus-4-7]
scope:
  paths:
    - "<path>"
  [path_not_match:]
    - "*.env"
  [bash_patterns:]
    [extra_allow:]
      - '^regex$'
    [extra_deny:]
      - '^regex$'
[mission_gate:] enforce
[auditor_pool:]
  - "auditor"
[budget:]
  [max_hours:] 8
  [max_agents:] 6
[acceptance_criteria:]
  - "criterion 1"
[metadata:]
  [key:] value
[tags:]
  - "<tag>"
```

## Field reference

### Required fields

<Tabs>
<TabItem label="version">

```yaml
version: 1
```

Schema version. Currently always `1`.

</TabItem>
<TabItem label="mission_id">

```yaml
mission_id: my-unique-mission
```

Unique identifier for the mission. Used in audit log, delegations, and ELO events.

</TabItem>
<TabItem label="agents">

```yaml
agents:
  - role: developer
    task: "Add tests for auth module"
  - role: code_reviewer
    task: "Review changes"
  - role: auditor
```

List of agent roles with their tasks. Each agent must have a `role` and `task`. The `auditor` role is mandatory.

</TabItem>
<TabItem label="scope.paths">

```yaml
scope:
  paths:
    - /home/user/project
```

Filesystem paths the agents are allowed to access. Used to generate `path_within` conditions.

</TabItem>
</Tabs>

### Optional fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `description` | string | `""` | Human-readable description |
| `author` | string | `"operator"` | Who created the manifest |
| `pattern` | string | `"code-review-cycle"` | Orchestration pattern |
| `mission_ttl_hours` | int | `8` | Mission lifetime (1-24) |
| `agents[].count` | int | `1` | Number of instances |
| `agents[].instances` | string[] | `[]` | Instance names |
| `agents[].model` | string | unset | Preferred model |
| `mission_gate` | string | unset | `"enforce"` to activate gate |
| `tags` | string[] | `[]` | Classification tags |

## Patterns

Valid pattern IDs from the built-in library:

- `code-review-cycle` -- sequential: developer, reviewer, auditor
- `bbp-impact-chain` -- fan-out-merge: pentesters, weaponizer, auditor
- `plan-then-execute` -- hierarchical: coordinator, workers
- `pipeline` -- sequential: multi-stage pipeline
- `colmena-self-dev` -- iterative: developers, reviewer, architect, auditor
- And 8 more in the full library

## Validation

```bash
colmena mission validate my-manifest.mission.yaml
```

Checks schema validity, role ID existence in the library, and pattern validity.
