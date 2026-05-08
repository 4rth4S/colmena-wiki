---
title: ELO & Accountability
description: How agents earn trust through auditor review
---

import { Steps, Card, CardGrid } from '@astrojs/starlight/components';

ELO is Colmena's trust calibration system. Agents earn trust through auditor review, and that trust determines what they can do autonomously.

## How it works

Every review produces scores on three dimensions:

- **Quality (1-10)** -- Is the work well-executed?
- **Precision (1-10)** -- Does the output match the objective?
- **Comprehensiveness (1-10)** -- How thorough is the coverage?

These scores feed into a per-role ELO rating that changes over time.

## Trust tiers

| Tier | ELO | Min Reviews | Effect |
|------|-----|-------------|--------|
| Elevated | 1600+ | 3+ | Auto-approve role's tools |
| Standard | 1300-1599 | 3+ | Default rules |
| Restricted | 1100-1299 | 3+ | Ask for everything |
| Probation | Below 1100 | 3+ | Bash and WebFetch blocked |
| Uncalibrated | Any | Below 3 | Warm-up period |

## Rating mechanics

ELO ratings use temporal decay -- recent reviews matter more than old ones:

- **Under 7 days** -- full weight (1.0)
- **7-30 days** -- moderate decay (0.7)
- **30-90 days** -- significant decay (0.4)
- **Over 90 days** -- minimal weight (0.1)

### Score impacts

- **Score 8.0+** -- author gains ELO: `+(score-7)*3`
- **Score 5.0-7.0** -- no ELO change
- **Score below 5.0** -- author loses ELO: `-(6-score)*4`
- **Critical finding** -- author loses 10 ELO
- **High finding** -- author loses 5 ELO
- **Reviewer reward** -- +5 ELO per finding submitted

## Calibration

Run calibration to apply ELO ratings to firewall rules:

```bash
colmena calibrate run     # Apply ELO to firewall overrides
colmena calibrate show    # Show current trust tiers
colmena calibrate reset   # Clear all ELO-based overrides
```

The Elevated Bash guard ensures that even Elevated agents get Ask for Bash unless the role defines explicit `bash_patterns`. This prevents unscoped Bash auto-approve.

## YAML overrides always win

Human authority is always above ELO. If you write a rule that says "developer is blocked from Write", no ELO rating overrides that. YAML `agent_overrides` take precedence over ELO in the firewall precedence chain.

## The accountability cycle

<Steps>
1. **Mission spawns** -- agents get scoped permissions based on current trust
2. **Agents work** -- tool calls are evaluated by the firewall
3. **Review submitted** -- auditor evaluates with QPC framework
4. **ELO updates** -- scores feed into per-role ELO with temporal decay
5. **Trust adjusts** -- calibration maps ELO to new trust tier
6. **Next mission** -- agents operate at updated trust level
</Steps>

## Related

- [Review Cycle](/concepts/missions) -- how reviews work in missions
- [Trust Firewall](/concepts/trust-firewall) -- how rules are enforced
- [CLI Commands](/reference/cli) -- calibration commands
