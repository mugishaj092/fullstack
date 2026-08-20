import vaultData from '../../data/vault-data.json';
import type { VaultNode } from '../../types/vault';
import { findPath } from '../../lib/tree';
import { useTreeState } from '../tree/TreeStateContext';

const forest = vaultData as VaultNode[];

export function Breadcrumbs({ node }: { node: VaultNode | null }) {
  const { setSelectedId } = useTreeState();
  const path = node ? findPath(forest, node.id) : null;

  if (!path || path.length === 0) {
    return <p className="text-sm text-muted-foreground">Vault</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 text-sm">
      {path.map((ancestor, i) => {
        const isLast = i === path.length - 1;
        return (
          <span key={ancestor.id} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedId(ancestor.id)}
              disabled={isLast}
              className={isLast ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}
            >
              {ancestor.name}
            </button>
            {!isLast && <span className="text-muted-foreground">/</span>}
          </span>
        );
      })}
    </div>
  );
}
