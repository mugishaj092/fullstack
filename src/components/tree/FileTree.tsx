import { useMemo } from 'react';
import vaultData from '../../data/vault-data.json';
import type { VaultNode } from '../../types/vault';
import { TreeNode } from './TreeNode';
import { useTreeState } from './TreeStateContext';
import { useTreeKeyboardNav } from '../../hooks/useTreeKeyboardNav';
import { collectMatchAncestors, nodeOrDescendantMatches } from '../../lib/search';

const forest = vaultData as VaultNode[];

export function FileTree() {
  const { expanded, setExpanded, selectedId, setSelectedId, query, setQuery } = useTreeState();

  const effectiveExpanded = useMemo(() => {
    if (!query) return expanded;
    const forced = collectMatchAncestors(forest, query);
    return new Set([...expanded, ...forced]);
  }, [query, expanded]);

  const { handleKeyDown } = useTreeKeyboardNav(forest, effectiveExpanded);

  const handleToggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const hasAnyMatch = !query || forest.some((node) => nodeOrDescendantMatches(node, query));

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search vault..."
        aria-label="Search vault"
        className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div
        role="tree"
        aria-label="Vault"
        className="flex flex-col gap-0.5"
        onKeyDown={handleKeyDown}
      >
        {hasAnyMatch ? (
          forest.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              expanded={effectiveExpanded}
              onToggle={handleToggle}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ))
        ) : (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">No matches for '{query}'</p>
        )}
      </div>
    </div>
  );
}
