---
title: Install Mode B
description: Let your Claude Code bootstrap Colmena from the repo
---

import { Card, CardGrid } from '@astrojs/starlight/components';

Mode B is the "point your Claude Code at this repo" path. Instead of reading the docs and running commands yourself, your Claude Code reads `CLAUDE.md`, builds Colmena, runs `setup`, and registers the MCP server -- all from a single prompt.

## When to choose Mode B

- You already use Claude Code daily and want to stay in the flow.
- You prefer to bootstrap without reading setup docs first.
- You trust your CC to run `cargo build`, `colmena setup`, and verify the result.

If you prefer to run each command yourself, use [Mode A](/quickstart/getting-started).

## Step by step

1. **Clone and open**

```bash
git clone git@github.com:4rth4S/colmena.git
cd colmena
```

Open the directory in Claude Code. CC autoloads `CLAUDE.md` at startup.

2. **Ask CC to set Colmena up**

Prompt your Claude Code:

> Read CLAUDE.md and set up Colmena on this machine. Build the binaries, run colmena setup, register the MCP server, and explain the default trust rules before I approve any delegation.

CC will:
- Read `CLAUDE.md` to understand the architecture
- Build the binaries with `cargo build --workspace --release`
- Run `colmena setup` to write config and register hooks
- Verify with `colmena doctor`
- Summarize the default trust rules

3. **Start your first mission**

Once installed, CC can use Colmena tools natively:

> Use mission_suggest to see if this repo needs Colmena for a small doc task. If yes, use mission_spawn to create the squad.



## Mode A vs Mode B

| | Mode A | Mode B |
|---|--------|--------|
| Who reads the docs | The user | The user's CC |
| Onboarding time | 5-10 minutes | 2-3 minutes |
| Required knowledge | What Colmena is and why | Just what you want to accomplish |
| Trust model | Unchanged | Unchanged |
| Good for | Solo users, CI | Teams, daily CC drivers |

Both modes end at the same place: `colmena setup` run, hooks registered, MCP registered, `colmena doctor` green.

## Tips

- Re-running `colmena setup` over an existing install is safe. Custom files are preserved.
- Start a fresh CC session in the cloned directory.
- For teams: one person does Mode A on shared infrastructure. The rest use Mode B on their laptops.

## Troubleshooting

- **`colmena doctor` warns about world-writable config files.** Tighten permissions: `chmod 600 config/trust-firewall.yaml config/runtime-delegations.json`.
- **Agents still prompt after setup.** Check `~/.claude/settings.json` for hook entries and re-run `colmena install`.
- **MCP server not visible.** Confirm the absolute path in `~/.mcp.json` points to the built binary.
