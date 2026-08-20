import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

export interface TreeStateContextValue {
  expanded: Set<string>;
  setExpanded: Dispatch<SetStateAction<Set<string>>>;
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  focusedId: string | null;
  setFocusedId: Dispatch<SetStateAction<string | null>>;
  registerRef: (id: string) => (el: HTMLElement | null) => void;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

export const TreeStateContext = createContext<TreeStateContextValue | null>(null);

export function useTreeState(): TreeStateContextValue {
  const ctx = useContext(TreeStateContext);
  if (!ctx) throw new Error('useTreeState must be used within a TreeStateContext.Provider');
  return ctx;
}
