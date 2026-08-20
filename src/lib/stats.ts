import type { VaultNode, NodeStats } from '../types/vault';
import { parseSizeToKB } from './size';

const statsCache = new WeakMap<VaultNode, NodeStats>();

/**
 * Recursive, post-order: a folder's stats are the sum of its children's stats,
 * each resolved before the parent totals them. Memoized per node object since
 * vault-data.json is static for the lifetime of the app.
 */
export function computeStats(node: VaultNode): NodeStats {
  const cached = statsCache.get(node);
  if (cached) return cached;

  let stats: NodeStats;
  if (node.type === 'file') {
    stats = { fileCount: 1, totalKB: parseSizeToKB(node.size) };
  } else {
    stats = node.children.reduce<NodeStats>(
      (acc, child) => {
        const childStats = computeStats(child);
        return {
          fileCount: acc.fileCount + childStats.fileCount,
          totalKB: acc.totalKB + childStats.totalKB,
        };
      },
      { fileCount: 0, totalKB: 0 },
    );
  }
  statsCache.set(node, stats);
  return stats;
}
