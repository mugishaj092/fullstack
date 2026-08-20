import { useCallback, useEffect, useMemo, type KeyboardEvent } from 'react';
import type { VaultNode } from '../types/vault';
import { flattenVisible } from '../lib/tree';
import { useTreeState } from '../components/tree/TreeStateContext';

/**
 * Makes the tree navigable with just a keyboard: Up/Down move focus between rows,
 * Right expands a folder (or steps into it if already open), Left collapses a folder
 * (or jumps up to its parent), and Enter selects the focused row.
 *
 * The tricky part is that the tree is nested, but only *expanded* folders show their
 * children — so "the next row down" isn't just "the next item in the data," it depends
 * on what's currently open. `flattenVisible` (spec-03) solves that by turning the nested
 * tree into a single top-to-bottom list of exactly what's on screen right now. Once we
 * have that list, arrow-key navigation is just moving an index up or down it.
 *
 * `effectiveExpanded` (raw `expanded` plus any search-forced folders, spec-07) is what
 * decides which rows are visible; Left/Right still read and write the real `expanded`
 * state from context, so search never overwrites what the user manually opened/closed.
 */
export function useTreeKeyboardNav(rootNodes: VaultNode[], effectiveExpanded: Set<string>) {
  const { expanded, setExpanded, setSelectedId, focusedId, setFocusedId } = useTreeState();

  // Nothing is focused when the tree first mounts — start on the first row so arrow
  // keys have somewhere to move from.
  useEffect(() => {
    if (focusedId === null && rootNodes[0]) {
      setFocusedId(rootNodes[0].id);
    }
    // Only seed the initial focus once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleRows = useMemo(
    () => flattenVisible(rootNodes, effectiveExpanded),
    [rootNodes, effectiveExpanded],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const focusedIndex = visibleRows.findIndex((row) => row.node.id === focusedId);
      if (focusedIndex === -1) return; // nothing focused right now, nothing to move from

      const focusedRow = visibleRows[focusedIndex];

      // Small helpers so the switch below reads like plain English instead of
      // repeating "copy the Set, add/remove one id, save it back" every time.
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
