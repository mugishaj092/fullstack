import { useCallback, useEffect, useMemo, type KeyboardEvent } from 'react';
import type { VaultNode } from '../types/vault';
import { flattenVisible } from '../lib/tree';
import { useTreeState } from '../components/tree/TreeStateContext';

export function useTreeKeyboardNav(rootNodes: VaultNode[], effectiveExpanded: Set<string>) {
  const { expanded, setExpanded, setSelectedId, focusedId, setFocusedId } = useTreeState();
  useEffect(() => {
    if (focusedId === null && rootNodes[0]) {
      setFocusedId(rootNodes[0].id);
    }
  }, []);

  const visibleRows = useMemo(
    () => flattenVisible(rootNodes, effectiveExpanded),
    [rootNodes, effectiveExpanded],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const focusedIndex = visibleRows.findIndex((row) => row.node.id === focusedId);
      if (focusedIndex === -1) return;

      const focusedRow = visibleRows[focusedIndex];

      const openFolder = (id: string) => {
        setExpanded((prev) => new Set(prev).add(id));
      };

      const closeFolder = (id: string) => {
        setExpanded((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      };

      // Starting just above this row, walk upward until we find a row that's one
      // level shallower — that's this row's parent folder.
      const findParentRow = () => {
        for (let i = focusedIndex - 1; i >= 0; i--) {
          if (visibleRows[i].depth < focusedRow.depth) {
            return visibleRows[i];
          }
        }
        return null;
      };

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex = Math.min(focusedIndex + 1, visibleRows.length - 1);
          setFocusedId(visibleRows[nextIndex].node.id);
          break;
        }

        case 'ArrowUp': {
          e.preventDefault();
          const previousIndex = Math.max(focusedIndex - 1, 0);
          setFocusedId(visibleRows[previousIndex].node.id);
          break;
        }

        case 'ArrowRight': {
          e.preventDefault();
          if (focusedRow.node.type !== 'folder') break; // files have nothing to expand

          if (!expanded.has(focusedRow.node.id)) {
            openFolder(focusedRow.node.id);
          } else {
            // Already open — step down into its first child instead.
            const firstChild = visibleRows[focusedIndex + 1];
            if (firstChild && firstChild.depth > focusedRow.depth) {
              setFocusedId(firstChild.node.id);
            }
          }
          break;
        }

        case 'ArrowLeft': {
          e.preventDefault();
          if (focusedRow.node.type === 'folder' && expanded.has(focusedRow.node.id)) {
            // Open folder — close it, staying focused right where we are.
            closeFolder(focusedRow.node.id);
          } else {
            // Already closed (or this is a file) — jump up to the parent folder.
            const parentRow = findParentRow();
            if (parentRow) {
              setFocusedId(parentRow.node.id);
            }
          }
          break;
        }

        case 'Enter': {
          e.preventDefault();
          // Enter always selects the focused row...
          setSelectedId(focusedRow.node.id);
          // ...and if it's a folder, also toggles it open/closed.
          if (focusedRow.node.type === 'folder') {
            if (expanded.has(focusedRow.node.id)) {
              closeFolder(focusedRow.node.id);
            } else {
              openFolder(focusedRow.node.id);
            }
          }
          break;
        }
      }
    },
    [visibleRows, focusedId, expanded, setExpanded, setSelectedId, setFocusedId],
  );

  return { handleKeyDown };
}
