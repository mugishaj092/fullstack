import { useCallback, useEffect, useMemo, type KeyboardEvent } from 'react';
import type { VaultNode } from '../types/vault';
import { flattenVisible } from '../lib/tree';
import { useTreeState } from '../components/tree/TreeStateContext';

/** Keyboard navigation over the flattened visible-rows list. */
export function useTreeKeyboardNav(rootNodes: VaultNode[]) {
  const { expanded, setExpanded, setSelectedId, focusedId, setFocusedId } = useTreeState();

  useEffect(() => {
    if (focusedId === null && rootNodes[0]) {
      setFocusedId(rootNodes[0].id);
    }
    // Only seed the initial focus once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleRows = useMemo(() => flattenVisible(rootNodes, expanded), [rootNodes, expanded]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const idx = visibleRows.findIndex((r) => r.node.id === focusedId);
      if (idx === -1) return;
      const row = visibleRows[idx];

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedId(visibleRows[Math.min(idx + 1, visibleRows.length - 1)].node.id);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedId(visibleRows[Math.max(idx - 1, 0)].node.id);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (row.node.type === 'folder') {
            if (!expanded.has(row.node.id)) {
              setExpanded((prev) => new Set(prev).add(row.node.id));
            } else if (visibleRows[idx + 1]?.depth > row.depth) {
              setFocusedId(visibleRows[idx + 1].node.id);
            }
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (row.node.type === 'folder' && expanded.has(row.node.id)) {
            setExpanded((prev) => {
              const next = new Set(prev);
              next.delete(row.node.id);
              return next;
            });
          } else {
            for (let i = idx - 1; i >= 0; i--) {
              if (visibleRows[i].depth < row.depth) {
                setFocusedId(visibleRows[i].node.id);
                break;
              }
            }
          }
          break;
        case 'Enter':
          e.preventDefault();
          setSelectedId(row.node.id);
          if (row.node.type === 'folder') {
            setExpanded((prev) => {
              const next = new Set(prev);
              if (next.has(row.node.id)) {
                next.delete(row.node.id);
              } else {
                next.add(row.node.id);
              }
              return next;
            });
          }
          break;
      }
    },
    [visibleRows, focusedId, expanded, setExpanded, setSelectedId, setFocusedId],
  );

  return { handleKeyDown };
}
