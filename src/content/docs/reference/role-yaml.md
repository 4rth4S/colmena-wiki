---
title: Role YAML
description: Complete reference for the role YAML configuration format
---

Roles are defined in YAML files in the library. Each role declares its tools, permissions, and trust configuration.

## Structure

```yaml
id: developer
name: Developer
description: "Full-stack development with auto-approve for cargo and git"
category: development
tools_allowed:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
  - WebFetch
  - WebSearch
  - mcp__colmena__review_submit
  - mcp__colmena__findings_query
permissions:
  bash_patterns:
    - '^cargo\b'
    - '^git\b'
  path_within:
    - '${MISSION_DIR}'
trust:
  default_trust: ask
  elevated: true
role_type: worker
model: claude-sonnet-4-7
```

## Core fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Human-readable name |
| `description` | string | Yes | What this role does |
| `category` | string | Yes | One of 8 categories |

## Categories

Colmena supports 8 role categories:

- `offensive` -- pentesting, exploitation
- `defensive` -- hardening, monitoring
- `compliance` -- audit, policy review
- `architecture` -- system design, ADRs
- `research` -- analysis, investigation
- `development` -- coding, testing
- `operations` -- deployment, SRE
- `creative` -- writing, design

## Tools and permissions

### tools_allowed

List of tools this role can use. Supports glob patterns:

```yaml
tools_allowed:
  - Read
  - Write
  - Edit
  - Bash
  - mcp__caido__*       # matches all Caido MCP tools
  - mcp__colmena__review_submit
```

### permissions.bash_patterns

Bash command patterns that are auto-approved for this role:

```yaml
permissions:
  bash_patterns:
    - '^cargo (build|test|check|clippy)\b'
    - '^git (diff|log|status)\b'
```

### permissions.path_within

Filesystem paths the role can access:

```yaml
permissions:
  path_within:
    - '${MISSION_DIR}'
    - 'docs/'
```

## Trust configuration

```yaml
trust:
  default_trust: ask       # ask | auto-approve | block
  elevated: true           # can reach Elevated tier
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `default_trust` | string | `ask` | Starting trust level |
| `elevated` | bool | `false` | Eligible for Elevated tier |

## Role type

```yaml
role_type: worker   # worker | reviewer | auditor
```

- `worker` -- produces artifacts, must submit for review
- `reviewer` -- evaluates worker artifacts
- `auditor` -- centralized evaluator, exempt from SubagentStop

## Private library

Roles can be stored in a private library outside version control:

```bash
export COLMENA_PRIVATE_LIBRARY=/path/to/private-library
```

Private entries with the same `id` override public ones. Use this for experimental or personal roles.

## CLI commands

Create, clone, and validate roles from the command line:

```bash
colmena library create-role --id my_role --description "..." --category development
colmena role clone pentester --as my_pentester
colmena role doctor my_role
```

See the [CLI reference](/reference/cli) for all role management commands.
