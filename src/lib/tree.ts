import type { VaultFile, VaultNode } from '../types/vault';

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

/** Depth-first search for a folder by exact name, across the whole forest. */
export function findFolderByName(nodes: VaultNode[], name: string): VaultNode | null {
  for (const node of nodes) {
    if (node.type === 'folder') {
      if (node.name === name) return node;
      const found = findFolderByName(node.children, name);
      if (found) return found;
    }
  }
  return null;
}

/** The ancestor chain from a root down to (and including) the given node, for breadcrumbs. */
export function findPath(nodes: VaultNode[], id: string, trail: VaultNode[] = []): VaultNode[] | null {
  for (const node of nodes) {
    if (node.id === id) return [...trail, node];
    if (node.type === 'folder') {
      const found = findPath(node.children, id, [...trail, node]);
      if (found) return found;
    }
  }
  return null;
}

export interface FileWithParent {
  file: VaultFile;
  parentName: string | null;
}

/** Every file across the whole forest, paired with its direct parent folder's name. */
export function collectAllFiles(
  nodes: VaultNode[],
  parentName: string | null = null,
  out: FileWithParent[] = [],
): FileWithParent[] {
  for (const node of nodes) {
    if (node.type === 'file') {
      out.push({ file: node, parentName });
    } else {
      collectAllFiles(node.children, node.name, out);
    }
  }
  return out;
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
