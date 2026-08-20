import type { VaultNode } from '../../types/vault';
import { computeStats } from '../../lib/stats';
import { formatKB } from '../../lib/size';
import { getFileCategory, fileCategoryColorClass } from '../../lib/file-icon';
import { ChevronIcon, FolderIcon, FileIcon } from './icons';
import { useTreeState } from './TreeStateContext';

export interface TreeNodeProps {
  node: VaultNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TreeNode({ node, depth, expanded, onToggle, selectedId, onSelect }: TreeNodeProps) {
  const { focusedId, setFocusedId, registerRef } = useTreeState();
  const isSelected = selectedId === node.id;
  const isFocused = focusedId === node.id;
  const stats = computeStats(node);
  const indentStyle = { paddingLeft: depth * 16 + 8 };

  const rowClasses = `flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-sm transition-colors ${
    isSelected ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50'
  } ${isFocused ? 'outline outline-2 outline-ring outline-offset-[-2px]' : ''}`;

  if (node.type === 'folder') {
    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children.length > 0;

    const handleClick = () => {
      setFocusedId(node.id);
      onToggle(node.id);
      onSelect(node.id);
    };

    return (
      <div>
        <button
          ref={registerRef(node.id)}
          type="button"
          role="treeitem"
          aria-selected={isSelected}
          aria-expanded={isExpanded}
          tabIndex={isFocused ? 0 : -1}
          onClick={handleClick}
          style={indentStyle}
          className={rowClasses}
        >
          {hasChildren ? (
            <ChevronIcon
              className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          ) : (
            <span className="h-3.5 w-3.5 shrink-0" />
          )}
          <FolderIcon open={isExpanded} className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate">{node.name}</span>
          <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
            {stats.fileCount}
          </span>
        </button>
        {isExpanded && hasChildren && (
          <div role="group">
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const category = getFileCategory(node.name);

  return (
    <button
      ref={registerRef(node.id)}
      type="button"
      role="treeitem"
      aria-selected={isSelected}
      tabIndex={isFocused ? 0 : -1}
      onClick={() => {
        setFocusedId(node.id);
        onSelect(node.id);
      }}
      style={indentStyle}
      className={rowClasses}
    >
      <span className="h-3.5 w-3.5 shrink-0" />
      <FileIcon className={`h-4 w-4 shrink-0 ${fileCategoryColorClass(category)}`} />
      <span className="flex-1 truncate">{node.name}</span>
      <span className="shrink-0 text-xs text-muted-foreground">{formatKB(stats.totalKB)}</span>
    </button>
  );
}
