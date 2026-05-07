---
title: Trust Firewall
description: How the firewall evaluates every tool call deterministically
---

import { Tabs, TabItem, Steps, Card, CardGrid } from '@astrojs/starlight/components';

The trust firewall is the core of Colmena. It evaluates every tool call against YAML rules before the call executes.

## Rule structure

A rule in `trust-firewall.yaml` has four fields:

```yaml
- tools: [Bash, Write]
  conditions:
    bash_pattern: '^ls\b'
    path_within: ['${PROJECT_DIR}']
    path_not_match: ['*.env', '*secret*']
  action: auto-approve
  reason: 'Safe operations'
```

- `tools` -- which tools this rule applies to
- `conditions` -- optional filters (all must match when present)
- `action` -- `auto-approve`, `ask`, or `block`
- `reason` -- human-readable explanation logged to audit trail

## The three tiers

Rules are organized into three tiers, evaluated in order:

<CardGrid stagger>
  <Card title="Trust Circle" icon="check-circle">
    Auto-approve for known-safe operations. Read calls, build tools, git history inspection.
  </Card>
  <Card title="Restricted" icon="question-circle">
    Ask the human. Potentially destructive or risky operations that need confirmation.
  </Card>
  <Card title="Blocked" icon="x-circle">
    Non-overridable denial. Force push, secret access, unsafe patterns. No prompt, no override.
  </Card>
</CardGrid>

## Precedence chain

The firewall follows this exact order. Stop at the first match.

1. **Blocked** -- non-overridable rules
2. **Runtime delegations** -- session-scoped permissions
3. **Agent overrides (YAML)** -- role-specific rules in config
4. **Agent overrides (ELO)** -- trust calibration overrides
5. **Restricted** -- ask the human
6. **Shell chain guard** -- complex Bash chains get scrutiny
7. **Mission revocation** -- deactivated missions are blocked
8. **Trust circle** -- auto-approve safe operations
9. **Defaults** -- fallback action

## Chain-aware evaluation

Bash commands with `&&`, `||`, `;`, or `|` are split into individual pieces and each piece is evaluated independently:

```bash
mkdir && cd project && git clone https://example.com/repo.git && echo done
```

Each of the four commands goes through the full rule set. One blocked piece blocks the whole chain. Bare assignments like `KEY=value` auto-approve as no-op.

## The audit log

Every firewall decision is recorded in `config/audit.log`:

```
[2026-04-15T10:30:00Z] ALLOW session=sess_abc agent=* tool=Read key="src/main.rs" rule=trust_circle
[2026-04-15T10:30:05Z] ASK   session=sess_abc agent=developer tool=Bash key="rm -rf target/" rule=restricted
[2026-04-15T10:30:10Z] BLOCK session=sess_abc agent=* tool=Bash key="git push --force origin main" rule=blocked
```

The log is append-only with 10MB rotation. Every entry includes session ID, agent, tool, the matched key, and the rule ID that decided it.

## Customizing rules

### Auto-approve npm install

```yaml
trust_circle:
  - tools: [Bash]
    conditions:
      bash_pattern: '^npm install\b'
    action: auto-approve
    reason: 'Package installation'
```

### Block curl outright

```yaml
blocked:
  - tools: [Bash]
    conditions:
      bash_pattern: '^curl\b'
    action: block
    reason: 'No network requests'
```

### Validate after editing

```bash
colmena config check
```

## Related

- [Scoped Autonomy](/concepts/scoped-autonomy) -- the design philosophy
- [Missions & Delegations](/concepts/missions) -- runtime permission scoping
- [Firewall Config](/reference/firewall-config) -- full YAML reference
