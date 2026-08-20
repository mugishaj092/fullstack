import { useMemo } from 'react';
import { Search } from 'lucide-react';
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
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="glass relative flex shrink-0 items-center rounded-md">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vault..."
          aria-label="Search vault"
          className="w-full rounded-md bg-transparent py-1.5 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <kbd className="pointer-events-none absolute right-3 rounded border border-border px-1 py-0.5 text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>
      <p className="shrink-0 px-2 text-xs font-medium tracking-wide text-muted-foreground">WORKSPACE</p>
      <div
        role="tree"
        aria-label="Vault"
        className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto"
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
