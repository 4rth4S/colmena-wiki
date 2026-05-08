---
title: Docs Generation
description: Multi-agent technical writing with architectural review
---

import { Tabs, TabItem, Steps, Card, CardGrid } from '@astrojs/starlight/components';

**Persona.** Technical writer. You need to produce documentation from source material -- getting-started guides, use-case docs, reference manuals -- and ensure architectural accuracy.

**Pattern.** `code-review-cycle` -- sequential topology with writers, an architect, and an auditor.

## The problem

A documentation project involves multiple sections that must be consistent in voice, style, and technical accuracy. One writer cannot produce 20+ pages quickly. Multiple writers need coordination, architectural review for correctness, and centralized quality evaluation.

## The manifest

```yaml
version: 1
mission_id: docs-gen-colmena
description: "Generate wiki content pages from source material"
author: operator
pattern: code-review-cycle
mission_ttl_hours: 12
agents:
  - role: technical_writer
    count: 3
    instances: [quickstart-concepts, use-cases, reference-arch-community]
    task: "Write wiki content from source material per section assignment"
  - role: architect
    task: "Review all pages for architectural accuracy and structural consistency"
  - role: auditor
scope:
  paths:
    - /home/user/colmena-wiki/src/content/docs
  bash_patterns:
    extra_allow:
      - '^git (diff|log|status|add|commit)\b'
      - '^ls\b'
      - '^find\b'
      - '^mkdir\b'
mission_gate: enforce
auditor_pool: ["auditor"]
acceptance_criteria:
  - "All pages follow Starlight format with valid frontmatter"
  - "Every YAML manifest in use cases is valid"
  - "Cross-references between pages are correct"
  - "Design rules match: dark theme #0a0a0f, amber #f59e0b"
tags: [docs, writing, starlight]
```

## Validate and spawn

```bash
colmena mission validate docs-gen-colmena.mission.yaml
colmena mission spawn --from docs-gen-colmena.mission.yaml
```

## Agent assignments

<Steps>

1. **Three writers work in parallel** -- each writes their assigned section
   - Writer 1: Quickstart (3 pages) + Concepts (4 pages) + Index
   - Writer 2: Use Cases (6 pages with manifest YAML)
   - Writer 3: Reference (5 pages) + Architecture (3 pages) + Community (3 pages)
2. **Architect reviews** all pages for architectural accuracy, cross-reference correctness, manifest YAML validity
3. **Auditor evaluates** with QPC framework -- scores all pages

</Steps>

## Design requirements

- Starlight components: `Card`, `CardGrid`, `Tabs`, `Steps`
- Dark theme `#0a0a0f`, amber accent `#f59e0b`
- Tabs for CLI/MCP, Mode A/B
- Every YAML manifest valid
- Every code snippet correct

## Outcome

25 pages generated. All follow Starlight format. Every manifest is valid YAML. Cross-references confirmed correct. ELO recorded for all agents.
