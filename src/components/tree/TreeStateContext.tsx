import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

export interface TreeStateContextValue {
  expanded: Set<string>;
  setExpanded: Dispatch<SetStateAction<Set<string>>>;
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
}

export const TreeStateContext = createContext<TreeStateContextValue | null>(null);

export function useTreeState(): TreeStateContextValue {
  const ctx = useContext(TreeStateContext);
  if (!ctx) throw new Error('useTreeState must be used within a TreeStateContext.Provider');
  return ctx;
}

/** Owns expanded/selectedId so FileTree and its siblings (properties panel, search) share one source of truth. */
export function TreeStateProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <TreeStateContext.Provider value={{ expanded, setExpanded, selectedId, setSelectedId }}>
      {children}
    </TreeStateContext.Provider>
  );
}
