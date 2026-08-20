import { describe, expect, it } from 'vitest';
import vaultData from '../../data/vault-data.json';
import type { VaultFolder, VaultNode } from '../../types/vault';
import { computeStats } from '../stats';
import { parseSizeToKB } from '../size';
import { findNode } from '../tree';

const forest = vaultData as VaultNode[];

describe('computeStats', () => {
  it('counts files in 01_Legal_Department', () => {
    const node = findNode(forest, 'root_1');
    expect(node).not.toBeNull();
    expect(computeStats(node as VaultNode).fileCount).toBe(4);
  });

  it('sums the whole forest', () => {
    const totals = forest.reduce(
      (acc, node) => {
        const stats = computeStats(node);
        return {
          fileCount: acc.fileCount + stats.fileCount,
          totalKB: acc.totalKB + stats.totalKB,
        };
      },
      { fileCount: 0, totalKB: 0 },
    );
    expect(totals.fileCount).toBe(14);
    expect(totals.totalKB).toBeCloseTo(75696, 0);
  });

  it('returns zero stats for an empty folder', () => {
    const node = findNode(forest, 'leg_2') as VaultFolder;
    expect(node).not.toBeNull();
    expect(computeStats(node)).toEqual({ fileCount: 0, totalKB: 0 });
  });
});

describe('parseSizeToKB', () => {
  it('parses MB', () => {
    expect(parseSizeToKB('4.2MB')).toBe(4200);
  });

  it('parses KB', () => {
    expect(parseSizeToKB('45KB')).toBe(45);
  });
});
