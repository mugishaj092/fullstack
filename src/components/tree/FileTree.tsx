import vaultData from '../../data/vault-data.json';
import type { VaultNode } from '../../types/vault';
import { TreeNode } from './TreeNode';
import { useTreeState } from './TreeStateContext';

const forest = vaultData as VaultNode[];

export function FileTree() {
  const { expanded, setExpanded, selectedId, setSelectedId } = useTreeState();

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

  return (
    <div role="tree" aria-label="Vault" className="flex flex-col gap-0.5">
      {forest.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          expanded={expanded}
          onToggle={handleToggle}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      ))}
    </div>
  );
}
