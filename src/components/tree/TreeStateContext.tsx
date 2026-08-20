import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

export interface TreeStateContextValue {
  expanded: Set<string>;
  setExpanded: Dispatch<SetStateAction<Set<string>>>;
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
}

export const TreeStateContext = createContext<TreeStateContextValue | null>(null);

/** Lets spec-06 (keyboard) and spec-07 (search) reach tree state without prop-drilling. */
export function useTreeState(): TreeStateContextValue {
  const ctx = useContext(TreeStateContext);
  if (!ctx) throw new Error('useTreeState must be used within a TreeStateContext.Provider');
  return ctx;
}
