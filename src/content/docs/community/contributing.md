---
title: Contributing
description: How to set up, build, test, and submit changes to Colmena
---

import { Steps, Card, CardGrid } from '@astrojs/starlight/components';

Colmena is open source and welcomes contributions. This page covers the development workflow.

## Development setup

<Steps>
**Clone the repository**

```bash
git clone git@github.com:4rth4S/colmena.git
cd colmena
```

**Build**

```bash
cargo build --workspace --release
```

Target binaries: `target/release/colmena` (CLI) and `target/release/colmena-mcp` (MCP server).

**Run tests**

```bash
cargo test --workspace
```

Test a single crate:

```bash
cargo test -p colmena-core
```

**Lint**

```bash
cargo clippy --workspace -- -D warnings
```

CI enforces `-D` since PR #25. Run clippy before every PR.

**Format**

```bash
cargo fmt --all --check
```

CI-enforced. Run before every PR.

</Steps>

## Project conventions

- **Git:** Always use branches (feature/, fix/, chore/, docs/). Never commit to main. MR workflow.
- **Error handling:** `anyhow::Result` everywhere. Never panic in the hook path.
- **HOME fallback:** to /tmp is banned. Fail explicitly if HOME is not set.
- **Release:** Run clippy before release -- must be clean.
- **Signature:** "built with love by AppSec" on all public-facing docs and commit trailers.

## Codebase structure

| Directory | Purpose |
|-----------|---------|
| `colmena-core/` | All business logic, zero platform deps |
| `colmena-cli/` | CLI binary (hooks + subcommands) |
| `colmena-filter/` | Output filtering pipeline |
| `colmena-mcp/` | MCP server binary |
| `config/` | Default YAML/JSON config and library files |

## CI pipeline

- **ci.yml** -- fmt + test + clippy `-D warnings` + build + audit + deny on PRs
- **release.yml** -- tag-triggered releases
- **dependabot** weekly for cargo + github-actions

## Adding a new role

```bash
colmena library create-role --id my_role \
  --description "Description of what this role does" \
  --category development
```

This generates a complete role definition -- YAML config with scoped tool permissions, a system prompt, and trust configuration.

## Adding a new pattern

```bash
colmena library create-pattern --id my-pattern \
  --description "Description of this pattern" \
  --topology sequential
```

Patterns define agent topology: sequential, fan-out-merge, hierarchical, adversarial, peer, iterative, recursive.

## Testing

- Integration tests spawn the CLI binary as subprocess and pipe JSON via stdin
- Core library tests use `env!("CARGO_MANIFEST_DIR")` + `../config/` to reach workspace root
- Integration test paths use `Path::parent()` for workspace root

## Related

- [Architecture Overview](/architecture/overview) -- code walkthrough
- [Roadmap](/community/roadmap) -- upcoming features
- [Security](/community/security) -- disclosure process
