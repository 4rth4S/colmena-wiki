// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.colmena.space',
  integrations: [
    starlight({
      title: 'Colmena',
      description: 'Deterministic governance for multi-agent Claude Code',
      logo: {
        src: './src/assets/logo.svg',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/4rth4S/colmena' },
      ],
      customCss: ['/src/styles/custom.css'],
      sidebar: [
        {
          label: 'Quickstart',
          items: [
            { label: 'Getting Started', slug: 'quickstart/getting-started' },
            { label: 'Your First Mission', slug: 'quickstart/first-mission' },
            { label: 'Install Mode B', slug: 'quickstart/install-mode-b' },
          ],
        },
        {
          label: 'Core Concepts',
          items: [
            { label: 'Scoped Autonomy', slug: 'concepts/scoped-autonomy' },
            { label: 'Trust Firewall', slug: 'concepts/trust-firewall' },
            { label: 'Missions & Delegations', slug: 'concepts/missions' },
            { label: 'ELO & Accountability', slug: 'concepts/elo' },
          ],
        },
        {
          label: 'Use Cases',
          items: [
            { label: 'Pentest BBP', slug: 'use-cases/pentest' },
            { label: 'Code Review', slug: 'use-cases/code-review' },
            { label: 'Incident Response', slug: 'use-cases/incident-response' },
            { label: 'Docs Generation', slug: 'use-cases/docs-generation' },
            { label: 'Refactor Mission', slug: 'use-cases/refactor' },
            { label: 'Custom Pattern', slug: 'use-cases/custom-pattern' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Manifest Schema', slug: 'reference/manifest-schema' },
            { label: 'CLI Commands', slug: 'reference/cli' },
            { label: 'MCP Tools', slug: 'reference/mcp-tools' },
            { label: 'Role YAML', slug: 'reference/role-yaml' },
            { label: 'Firewall Config', slug: 'reference/firewall-config' },
          ],
        },
        {
          label: 'Architecture',
          items: [
            { label: 'System Overview', slug: 'architecture/overview' },
            { label: 'Hook Pipeline', slug: 'architecture/hooks' },
            { label: 'Mission Lifecycle', slug: 'architecture/mission-lifecycle' },
          ],
        },
        {
          label: 'Community',
          items: [
            { label: 'Contributing', slug: 'community/contributing' },
            { label: 'Roadmap', slug: 'community/roadmap' },
            { label: 'Security', slug: 'community/security' },
          ],
        },
      ],
    }),
  ],
});
