import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { TreeStateContext } from './TreeStateContext';

/** Owns expanded/selectedId/focusedId so FileTree and its siblings share one source of truth. */
export function TreeStateProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const nodeRefs = useRef<Record<string, HTMLElement | null>>({});

  const registerRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      nodeRefs.current[id] = el;
    },
    [],
  );

  useEffect(() => {
    if (focusedId) nodeRefs.current[focusedId]?.focus();
  }, [focusedId]);

  return (
    <TreeStateContext.Provider
      value={{ expanded, setExpanded, selectedId, setSelectedId, focusedId, setFocusedId, registerRef, query, setQuery }}
    >
      {children}
    </TreeStateContext.Provider>
  );
}
