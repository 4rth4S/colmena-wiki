---
title: Firewall Config
description: Complete reference for the trust-firewall.yaml configuration
---

import { Tabs, TabItem, Card, CardGrid } from '@astrojs/starlight/components';

The `trust-firewall.yaml` file is the core configuration for Colmena's deterministic rule engine. It defines what tool calls are allowed, asked, or blocked.

## File location

```
config/trust-firewall.yaml
```

Created by `colmena setup`. Edit this file to customize your trust rules.

## Top-level structure

```yaml
version: 1
defaults:
  action: ask
  reason: 'Default action'
trust_circle:
  - tools: [ToolName]
    conditions:
      bash_pattern: '^regex$'
      path_within: ['path']
      path_not_match: ['*.env']
    action: auto-approve
    reason: 'Description'
restricted:
  - tools: [ToolName]
    conditions:
      bash_pattern: '^regex$'
    action: ask
    reason: 'Description'
blocked:
  - tools: [ToolName]
    conditions:
      bash_pattern: '^regex$'
    action: block
    reason: 'Description'
agent_overrides:
  agent_id:
    - tools: [ToolName]
      action: auto-approve
      reason: 'Description'
notifications:
  enabled: true
  on_review: warning
  on_alert: critical
```

## Sections

### defaults

```yaml
defaults:
  action: ask
  reason: 'Default action'
```

Fallback action when no rule matches. Typically `ask`.

### trust_circle

Auto-approved operations. Matched against known-safe patterns:

```yaml
trust_circle:
  - tools: [Read]
    action: auto-approve
    reason: 'Read-only local operations'
  - tools: [Bash]
    conditions:
      bash_pattern: '^cargo (build|test|check|clippy|fmt)\b'
    action: auto-approve
    reason: 'Build tools'
  - tools: [Bash]
    conditions:
      bash_pattern: '^git (log|diff|status|show|branch)\b'
    action: auto-approve
    reason: 'Git inspection'
```

### restricted

Operations that require human confirmation:

```yaml
restricted:
  - tools: [Bash]
    conditions:
      bash_pattern: '^rm\b'
    action: ask
    reason: 'File removal'
  - tools: [Bash]
    conditions:
      bash_pattern: '^git push\b'
    action: ask
    reason: 'Push requires confirmation'
```

### blocked

Non-overridable denials. No prompt, no delegation override:

```yaml
blocked:
  - tools: [Bash]
    conditions:
      bash_pattern: '^git push --force\b'
    action: block
    reason: 'Destructive operation'
  - tools: [Write, Edit]
    conditions:
      path_not_match: ['*.env', '*credentials*', '*secret*', '*.key', '*.pem']
    action: block
    reason: 'Protected files'
```

### Rule fields

Each rule has:

| Field | Type | Description |
|-------|------|-------------|
| `tools` | string[] | Tools this rule applies to |
| `conditions.bash_pattern` | string (regex) | Bash command pattern |
| `conditions.path_within` | string[] | Path must be within these dirs |
| `conditions.path_not_match` | string[] | Path must not match these globs |
| `action` | string | `auto-approve`, `ask`, or `block` |
| `reason` | string | Human-readable explanation |

### Validation

After editing:

```bash
colmena config check
```

Checks YAML validity, regex compilability, and schema conformance.

## Precendence

The firewall evaluates rules in this order:

1. Blocked
2. Runtime delegations
3. Agent overrides (YAML)
4. Agent overrides (ELO)
5. Restricted
6. Shell chain guard
7. Mission revocation
8. Trust circle
9. Defaults

Stop at the first match.
