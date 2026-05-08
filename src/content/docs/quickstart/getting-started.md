---
title: Getting Started
description: Zero to a working trust firewall in 5 minutes
---

import { Tabs, TabItem, Steps, Card, CardGrid } from '@astrojs/starlight/components';

Zero to a working trust firewall in 5 minutes, then your first multi-agent mission.

## Prerequisites

- **Claude Code** installed and working (the `claude` command is available).
- **Rust toolchain** (stable) via [rustup](https://rustup.rs/) -- only needed if you build from source.
- **Linux or macOS.** Windows is not tested but may work under WSL2.
- A real `$HOME` directory. Colmena refuses to fall back to `/tmp` on purpose.

## Installation

Colmena offers two installation paths. Both end at `colmena doctor` green.

<Tabs>
<TabItem label="Mode A -- From Source">

```bash
git clone https://github.com/4rth4S/colmena.git
cd colmena
cargo build --workspace --release
./target/release/colmena setup
./target/release/colmena doctor
```

</TabItem>
<TabItem label="Mode B -- CC Bootstraps">

Point your Claude Code at the Colmena repo and let it bootstrap everything:

> Read CLAUDE.md and set up Colmena on this machine. Build the binaries, run colmena setup, register the MCP server, and explain the default trust rules before I approve any delegation.

See the [Install Mode B](/quickstart/install-mode-b) page for the full walkthrough.

</TabItem>
</Tabs>

## What `colmena setup` does

<Steps>
**Detects mode.** Repo mode if a Cargo workspace is nearby (config at `<project>/config/`), otherwise standalone (`~/.colmena/config/`).
**Creates config directories.** `library/roles`, `library/patterns`, `library/prompts`, `queue/pending`, `queue/decided`.
**Writes default config.** All defaults embedded in the binary -- no downloads needed.
**Registers hooks** in `~/.claude/settings.json`:
   - `PreToolUse` -- evaluates every tool call against the firewall
   - `PostToolUse` -- filters noisy Bash output before Claude sees it
   - `PermissionRequest` -- auto-approves tools within a role's scope
   - `SubagentStop` -- blocks agents from stopping without submitting for auditor review
**Registers MCP** in `~/.mcp.json` so Claude Code sees the Colmena tools natively.
</Steps>

## Verify the install

```bash
./target/release/colmena doctor
```

Seven categories: config validity, hook registration, MCP registration, library integrity, runtime state, file permissions, version consistency. All should be green.

## The firewall in action

Open Claude Code in any project. The firewall is live from the first tool call.

<CardGrid stagger>
  <Card title="Read call" icon="open-book">
    Auto-approved. No prompt. The file loads.
  </Card>
  <Card title="Build command" icon="rocket">
    <code>cargo test --workspace</code> -- auto-approved by the build tools rule.
  </Card>
  <Card title="Destructive op" icon="warning">
    <code>rm -rf target/</code> -- the firewall asks: "Potentially destructive system command. Allow?"
  </Card>
  <Card title="Force push" icon="padlock">
    <code>git push --force origin main</code> -- blocked outright. No prompt, no override.
  </Card>
</CardGrid>

Every decision writes a line to `config/audit.log` with the matching rule ID.

## Next steps

- [Your First Mission](/quickstart/first-mission) -- create a manifest and spawn agents
- [Install Mode B](/quickstart/install-mode-b) -- let your Claude Code bootstrap Colmena
- [Scoped Autonomy](/concepts/scoped-autonomy) -- understand the core design principles
