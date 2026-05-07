---
title: MCP Tools
description: Complete reference for all 27 Colmena MCP tools
---

import { Tabs, TabItem, Card, CardGrid } from '@astrojs/starlight/components';

Colmena exposes 27 tools via the MCP server. Claude Code calls them natively as `mcp__colmena__*`.

## Firewall and delegations (6 tools)

| Tool | Purpose | Rate Limited |
|------|---------|-------------|
| `config_check` | Validate firewall config | No |
| `evaluate` | Evaluate a tool call against firewall | No |
| `queue_list` | List pending approvals | No |
| `delegate` | Request delegation (returns CLI command) | No |
| `delegate_list` | List active delegations | No |
| `delegate_revoke` | Request revocation (returns CLI command) | No |

The `delegate` and `delegate_revoke` tools are **read-only** -- they return the CLI command for the operator to inspect and run. They never execute directly.

## Wisdom library (6 tools)

| Tool | Purpose | Rate Limited |
|------|---------|-------------|
| `library_list` | List roles and patterns | No |
| `library_show` | Show role or pattern details | No |
| `library_select` | Recommend patterns for a mission | No |
| `library_generate` | Generate CLAUDE.md per agent | Yes (30/min) |
| `library_create_role` | Create role with intelligent defaults | Yes (30/min) |
| `library_create_pattern` | Create pattern with topology detection | Yes (30/min) |

## Auditor review and findings (6 tools)

| Tool | Purpose | Rate Limited |
|------|---------|-------------|
| `review_submit` | Submit artifact for auditor review | Yes (30/min) |
| `review_list` | List auditor reviews (pending/completed) | No |
| `review_evaluate` | Submit scores and findings as reviewer | Yes (30/min) |
| `elo_ratings` | ELO leaderboard with temporal decay | No |
| `findings_query` | Search findings by role/category/severity/mission | No |
| `findings_list` | List recent findings | No |

## Alerts and calibration (4 tools)

| Tool | Purpose | Rate Limited |
|------|---------|-------------|
| `alerts_list` | List alerts by severity/acknowledged | No |
| `alerts_ack` | Acknowledge alert(s) by ID or "all" | Yes (30/min) |
| `calibrate_auditor` | Present evaluations for human calibration | No |
| `calibrate_auditor_feedback` | Submit calibration feedback | Yes (30/min) |

## Operations (5 tools)

| Tool | Purpose | Rate Limited |
|------|---------|-------------|
| `mission_spawn` | One-step mission creation | Yes (30/min) |
| `mission_suggest` | Analyze mission complexity (read-only) | No |
| `mission_deactivate` | Request deactivation (returns CLI command) | Yes (30/min) |
| `calibrate` | Show trust calibration state | No |
| `session_stats` | Show prompts saved and tokens saved | No |

## Rate limiting

Generative and state-modifying tools are rate-limited to **30 calls per minute** per tool. This includes:
- `library_generate`, `library_create_role`, `library_create_pattern`
- `review_submit`, `review_evaluate`
- `alerts_ack`, `calibrate_auditor_feedback`
- `mission_spawn`, `mission_deactivate`

## Error handling

All MCP error responses are sanitized to hide filesystem paths. Agents cannot learn internal directory structure through error messages.

## Session summary

Before ending a Claude Code session, call `mcp__colmena__session_stats` to print the value summary showing prompts saved and tokens saved.
