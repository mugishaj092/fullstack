import type { VaultNode } from '../types/vault';

/** Depth-first search for a node by id, across the whole forest. */
export function findNode(nodes: VaultNode[], id: string): VaultNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.type === 'folder') {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export interface VisibleRow {
  node: VaultNode;
  depth: number;
}

/** Flattens the currently-expanded tree into visible rows, for keyboard nav (spec-06). */
export function flattenVisible(
  nodes: VaultNode[],
  expanded: Set<string>,
  depth = 0,
  out: VisibleRow[] = [],
): VisibleRow[] {
  for (const node of nodes) {
    out.push({ node, depth });
    if (node.type === 'folder' && expanded.has(node.id)) {
      flattenVisible(node.children, expanded, depth + 1, out);
    }
  }
  return out;
}
