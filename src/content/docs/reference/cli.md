---
title: CLI Commands
description: Complete reference for all colmena CLI subcommands
---

The `colmena` CLI is the primary interface for configuration, management, and monitoring.

## Setup and onboarding

| Command | Purpose |
|---------|---------|
| `colmena setup` | One-command onboarding: config, hooks, MCP registration |
| `colmena setup --dry-run` | Preview without writing |
| `colmena setup --force` | Overwrite custom files |
| `colmena doctor` | Full health check (7 categories) |
| `colmena install` | Register hooks in settings.json |
| `colmena upgrade [--verbose]` | Check crates.io for newer versions |

## Firewall and config

| Command | Purpose |
|---------|---------|
| `colmena config check` | Validate trust-firewall.yaml |
| `colmena hook` | Hot path: stdin JSON to evaluate to stdout JSON |

## Delegations

| Command | Purpose |
|---------|---------|
| `colmena delegate add --tool X [--agent Y] [--ttl 4] [--session S]` | Add delegation (max 24h) |
| `colmena delegate list` | List active delegations |
| `colmena delegate revoke --tool X` | Revoke a delegation |

## Missions

| Command | Purpose |
|---------|---------|
| `colmena mission init <slug> --for "description"` | Create a manifest |
| `colmena mission init --from-history` | Generate from audit log |
| `colmena mission validate <file>.mission.yaml` | Check schema and library refs |
| `colmena mission spawn --from <file>.mission.yaml` | Create agents and delegations |
| `colmena mission spawn --from <file>.mission.yaml --dry-run` | Preview first |
| `colmena mission spawn --from <file>.mission.yaml --auto-spawn` | Flat-team orchestration: writes ORCHESTRATE.md so Claude Code spawns all agents as teammates |
| `colmena mission list` | List active missions |
| `colmena mission deactivate --id <id>` | Revoke all delegations |
| `colmena mission abort --id <id>` | Emergency stop |

## Library

| Command | Purpose |
|---------|---------|
| `colmena library list` | List roles and patterns |
| `colmena library show <id>` | Show role or pattern details |
| `colmena library select --mission "..."` | Pattern selector and mission generator |
| `colmena library create-role` | Create a new role with intelligent defaults |
| `colmena library create-pattern` | Create a new pattern with topology detection |

## Role management

| Command | Purpose |
|---------|---------|
| `colmena role clone <existing> --as <new_id>` | Copy a role as a template |
| `colmena role doctor <id>` | Validate YAML and suggest improvements |

## Reviews and ELO

| Command | Purpose |
|---------|---------|
| `colmena review list [--state pending]` | List auditor reviews |
| `colmena review show <review-id>` | Review detail |
| `colmena elo show` | ELO leaderboard |

## Calibration

| Command | Purpose |
|---------|---------|
| `colmena calibrate run` | Apply ELO to firewall overrides |
| `colmena calibrate show` | Show current trust tiers |
| `colmena calibrate reset` | Clear all ELO-based overrides |

## Monitoring

| Command | Purpose |
|---------|---------|
| `colmena suggest "<mission>"` | Analyze complexity, recommend Colmena vs CC |
| `colmena stats` | Combined firewall and filter savings |
| `colmena stats --session <id>` | Per-session detail |
| `colmena queue list` | List pending approval items |
| `colmena queue prune --older-than 7` | Prune old queue entries |
