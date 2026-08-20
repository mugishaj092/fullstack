import type { VaultNode } from '../../types/vault';
import { computeStats } from '../../lib/stats';
import { formatKB } from '../../lib/size';

interface PropertiesPanelProps {
  node: VaultNode | null;
}

/** Derives a type label from the filename's extension — e.g. "Email.pdf" -> "PDF". No invented MIME types. */
function getFileTypeLabel(name: string): string {
  const ext = name.split('.').pop();
  return ext ? ext.toUpperCase() : name.toUpperCase();
}

export function PropertiesPanel({ node }: PropertiesPanelProps) {
  if (!node) {
    return (
      <div className="glass rounded-lg p-4">
        <p className="text-sm text-muted-foreground">Select a file or folder to see its properties.</p>
      </div>
    );
  }

  const rows =
    node.type === 'file'
      ? [
          { label: 'Name', value: node.name },
          { label: 'Type', value: getFileTypeLabel(node.name) },
          { label: 'Size', value: node.size },
        ]
      : (() => {
          const stats = computeStats(node);
          return [
            { label: 'Name', value: node.name },
            { label: 'Type', value: 'Folder' },
            { label: 'Contains', value: `${stats.fileCount} files` },
            { label: 'Total size', value: formatKB(stats.totalKB) },
          ];
        })();

  return (
    <div className="glass rounded-lg">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0">
          <span className="text-sm text-muted-foreground">{row.label}</span>
          <span className="text-sm font-medium text-foreground">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
