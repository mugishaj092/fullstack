import type { VaultNode } from '../types/vault';

export function nodeOrDescendantMatches(node: VaultNode, query: string): boolean {
  const q = query.toLowerCase();
  if (node.name.toLowerCase().includes(q)) return true;
  if (node.type === 'folder') {
    return node.children.some(child => nodeOrDescendantMatches(child, q));
  }
  return false;
}

export function collectMatchAncestors(
  nodes: VaultNode[],
  query: string,
  path: string[] = [],
  out: Set<string> = new Set(),
): Set<string> {
  const q = query.toLowerCase();
  for (const node of nodes) {
    const matches = node.name.toLowerCase().includes(q);
    if (matches) path.forEach(id => out.add(id));
    if (node.type === 'folder') {
      collectMatchAncestors(node.children, query, [...path, node.id], out);
    }
  }
  return out;
}
