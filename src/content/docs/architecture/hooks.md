---
title: Hook Pipeline
description: How Colmena's four hooks integrate with Claude Code
---

import { Steps, Card, CardGrid } from '@astrojs/starlight/components';

Colmena registers four hooks in `~/.claude/settings.json`. Each hook intercepts a specific lifecycle event in Claude Code.

## PreToolUse hook

The hot path. Runs synchronously before every tool call with a 5-second watchdog.

### Precedence chain

The firewall evaluates rules in this exact order, stopping at the first match:

1. **Blocked** -- non-overridable rules
2. **Runtime delegations** -- session-scoped permissions with TTL
3. **Agent overrides (YAML)** -- role-specific rules in trust-firewall.yaml
4. **Agent overrides (ELO)** -- trust calibration overrides
5. **Restricted** -- ask the human
6. **Shell chain guard** -- Bash chains get per-piece evaluation
7. **Mission revocation** -- deactivated missions are blocked
8. **Trust circle** -- auto-approve safe operations
9. **Defaults** -- fallback action

After the chain, the **Mission Gate** fires for the `Agent` tool only. Missing mission marker in the prompt triggers Ask.

### Safe fallback

Any error in PreToolUse returns `ask` -- never `deny` or crash. A broken hook must not trap the user.

## PostToolUse hook

Fires after Bash commands complete. Only affects Bash -- other tools pass through untouched.

### Filter pipeline

Four filters run in sequence, each wrapped in `catch_unwind`:

<Steps>
1. **ANSI strip** -- remove escape sequences so subsequent filters see clean text
2. **Stderr-only** -- if exit code != 0 and stderr has content, discard stdout (noisy build output), keep stderr (errors)
3. **Dedup** -- collapse N+ consecutive identical lines (e.g. "Downloading crate..." x 50 to 1 line)
4. **Truncate** -- hard cap at 150 lines / 30K chars, preserves head + tail
</Steps>

Saves 30-50% of tokens from noisy commands.

## PermissionRequest hook

Fires when CC would prompt the user for permission. Only activates for agents with `source: "role"` delegation.

On first allow, writes CC session rules for all tools in the role's `tools_allowed`. Subsequent calls are auto-approved by CC itself without hitting the hook.

## SubagentStop hook

A lifecycle event (not a tool event). Intercepts when a subagent calls Stop.

### Worker gate

Checks if the agent has a `source: "role"` delegation. If so, requires `review_submit` before allowing Stop. The `auditor` role type is exempt.

### Reviewer gate

Agents with pending reviews as `reviewer_role` are blocked until they call `review_evaluate`. Checked before the review_submit gate.

### Behavior by role type

| Role type | SubagentStop behavior |
|-----------|----------------------|
| Worker | Must call review_submit before Stop |
| Reviewer | Must call review_evaluate before Stop |
| Auditor | Exempt -- can stop freely |

## Configuration

All hooks are registered by `colmena setup`. Re-run setup to ensure hooks are registered correctly:

```bash
colmena doctor   # Check all hooks are registered
colmena install  # Force hook re-registration
```
