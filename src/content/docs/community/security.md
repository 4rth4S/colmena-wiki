---
title: Security
description: Security disclosure process, threat model, and security practices
---

import { Card, CardGrid } from '@astrojs/starlight/components';

## Disclosure process

If you discover a security vulnerability in Colmena, please follow this process:

1. **Do not open a public GitHub issue.** Security vulnerabilities should be reported privately.
2. Open a security issue via the [GitHub Security tab](https://github.com/4rth4S/colmena/security/advisories).
3. Include a description of the vulnerability, steps to reproduce, and potential impact.
4. You will receive a response within 48 hours.

## Threat model

Colmena ships with a documented STRIDE/DREAD threat model covering:

- **Spoofing** -- Can an agent pretend to be another agent?
- **Tampering** -- Can an agent modify audit logs or config files?
- **Repudiation** -- Can an agent deny its actions?
- **Information disclosure** -- Can an agent read files outside its scope?
- **Denial of service** -- Can an agent consume resources to block others?
- **Elevation of privilege** -- Can an agent escalate its trust level?

## Security practices

### Config file protection

Critical config files are protected in the firewall itself:

- `trust-firewall.yaml` -- Write blocked
- `runtime-delegations.json` -- Write blocked
- `audit.log` -- Write blocked
- `elo-overrides.json` -- Write blocked
- `alerts.json` -- Write blocked (append-only)

World-writable config files trigger a warning in `colmena doctor`.

### Secrets exclusion

The following file patterns are blocked from agent access by default:

- `*.env`
- `*credentials*`
- `*secret*`
- `*.key`
- `*.pem`

### Rate limiting

Generative MCP tools are rate-limited to 30 calls per minute per tool to prevent abuse.

### Error sanitization

All MCP error responses are sanitized to hide filesystem paths. Agents cannot learn internal directory structure through error messages.

### Audit trail tamper evidence

- Audit log is append-only with 10MB rotation
- ELO events are append-only JSONL
- Config file permissions checked on load
- Atomic file writes (temp + rename) prevent partial writes

## CI security checks

Every PR goes through:

- `cargo audit` -- dependency vulnerability scanning
- `cargo deny` -- license and advisory checking
- `cargo clippy -- -D warnings` -- lint enforcement

## Related

- [Contributing](/community/contributing) -- development guide
- [Roadmap](/community/roadmap) -- upcoming security features
- [Firewall Config](/reference/firewall-config) -- rule configuration
