/**
 * Rehype plugin to strip leaked MDX import statements from HTML output.
 *
 * Astro 6 / @astrojs/mdx 5 duplicates ESM import lines as <p> text
 * in the rendered output. This strips those paragraphs.
 */
export function rehypeStripImports() {
  return (tree) => {
    const children = tree.children || [];
    for (let i = children.length - 1; i >= 0; i--) {
      const node = children[i];
      if (node.type === 'element' && node.tagName === 'p') {
        const text = (node.children || [])
          .filter((c) => c.type === 'text')
          .map((c) => c.value)
          .join('');
        if (text.startsWith('import {') && text.includes('starlight')) {
          children.splice(i, 1);
        }
      }
    }
  };
}
