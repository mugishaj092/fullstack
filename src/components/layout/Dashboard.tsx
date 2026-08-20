import { useState } from 'react';
import { Folder } from 'lucide-react';
import vaultData from '../../data/vault-data.json';
import type { VaultFolder, VaultNode } from '../../types/vault';
import { collectAllFiles, findFolderByName } from '../../lib/tree';
import { computeStats } from '../../lib/stats';
import { formatKB } from '../../lib/size';
import { getFileTypeBadge } from '../../lib/file-icon';
import { useTreeState } from '../tree/TreeStateContext';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import { Button } from '../ui/Button';
import { Breadcrumbs } from './Breadcrumbs';

const forest = vaultData as VaultNode[];
const vaultStats = computeStats({ id: '__root__', name: 'Vault', type: 'folder', children: forest });

const activeCasesFolder = findFolderByName(forest, 'Active_Cases');
const activeCasesCount =
  activeCasesFolder?.type === 'folder'
    ? activeCasesFolder.children.filter((child) => child.type === 'folder').length
    : 0;

const allFiles = collectAllFiles(forest);

const DEPARTMENT_BAR_COLORS = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4'];

const FILE_FILTERS = ['All', 'PDF', 'DOC', 'XLS', 'IMG', 'LOG'] as const;
type FileFilter = (typeof FILE_FILTERS)[number];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-lg p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function DocumentsTable({ folderNode }: { folderNode: VaultFolder | null }) {
  const { setSelectedId } = useTreeState();
  const [filter, setFilter] = useState<FileFilter>('All');

  const fileRows = folderNode
    ? folderNode.children
        .filter((child): child is Extract<VaultNode, { type: 'file' }> => child.type === 'file')
        .map((file) => ({ file, parentName: folderNode.name }))
    : allFiles;
  const folderRows = folderNode ? folderNode.children.filter((child) => child.type === 'folder') : [];

  const visibleFiles = fileRows.filter(({ file }) => filter === 'All' || getFileTypeBadge(file.name).label === filter);
  const isEmpty = visibleFiles.length === 0 && folderRows.length === 0;

  return (
    <div className="glass rounded-lg">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold text-foreground">Documents</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FileFilter)}
          aria-label="Filter documents by type"
          className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground"
        >
          {FILE_FILTERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {isEmpty ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            {folderNode ? 'This folder is empty.' : 'No documents match this filter.'}
          </p>
        ) : (
          <>
            {folderRows.map((folder) => {
              const stats = computeStats(folder);
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedId(folder.id)}
                  className="flex w-full items-center gap-3 border-b border-border px-4 py-2.5 text-left last:border-b-0 hover:bg-accent/15"
                >
                  <Folder className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">{folder.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {stats.fileCount === 0 ? 'Empty' : `${stats.fileCount} files`}
                  </span>
                </button>
              );
            })}
            {visibleFiles.map(({ file, parentName }) => {
              const badge = getFileTypeBadge(file.name);
              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setSelectedId(file.id)}
                  className="flex w-full items-center gap-3 border-b border-border px-4 py-2.5 text-left last:border-b-0 hover:bg-accent/15"
                >
                  <span className={`shrink-0 rounded px-1.5 py-1 text-[10px] font-semibold ${badge.colorClass}`}>
                    {badge.label}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">{file.name}</span>
                    {parentName && <span className="block truncate text-xs text-muted-foreground">{parentName}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{file.size}</span>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function QuickAccess() {
  const { setSelectedId } = useTreeState();

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-foreground">Quick Access</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {forest.filter((node) => node.type === 'folder').map((node) => {
          const stats = computeStats(node);
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedId(node.id)}
              className="glass rounded-lg p-3 text-left transition-colors hover:bg-accent/15"
            >
              <p className="truncate text-sm font-medium text-foreground">{node.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stats.fileCount === 0 ? 'Empty' : `${stats.fileCount} files · ${formatKB(stats.totalKB)}`}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StorageByDepartment() {
  const { setSelectedId } = useTreeState();
  const departments = forest
    .filter((node) => node.type === 'folder')
    .map((node) => ({ node, stats: computeStats(node) }))
    .sort((a, b) => b.stats.totalKB - a.stats.totalKB);
  const maxKB = Math.max(...departments.map((d) => d.stats.totalKB), 1);

  return (
    <div className="glass rounded-lg p-4">
      <h2 className="mb-3 text-sm font-semibold text-foreground">Storage by Department</h2>
      <div className="flex flex-col gap-3">
        {departments.map(({ node, stats }, i) => (
          <button
            key={node.id}
            type="button"
            onClick={() => setSelectedId(node.id)}
            className="block w-full text-left"
          >
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="truncate text-foreground">{node.name}</span>
              <span className="shrink-0 text-muted-foreground">{formatKB(stats.totalKB)}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className={`h-1.5 rounded-full ${DEPARTMENT_BAR_COLORS[i % DEPARTMENT_BAR_COLORS.length]}`}
                style={{ width: `${(stats.totalKB / maxKB) * 100}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Dashboard({ node }: { node: VaultNode | null }) {
  const isFolder = node === null || node.type === 'folder';
  const folderNode = isFolder ? (node as VaultFolder | null) : null;
  const stats = folderNode ? computeStats(folderNode) : vaultStats;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Breadcrumbs node={node} />
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" disabled title="Not available — this is a static, read-only demo">
            New Folder
          </Button>
          <Button disabled title="Not available — this is a static, read-only demo">
            Upload
          </Button>
        </div>
      </div>

      <h1 className="text-4xl font-semibold text-foreground">{folderNode ? folderNode.name : 'Vault Dashboard'}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {stats.fileCount} files · {formatKB(stats.totalKB)}
      </p>

      <div className="mt-6 flex gap-6">
        <div className="min-w-0 flex-1">
          <div className="mb-6 grid grid-cols-3 gap-4">
            <StatCard label="TOTAL DOCUMENTS" value={String(vaultStats.fileCount)} />
            <StatCard label="ACTIVE CASES" value={String(activeCasesCount)} />
            <StatCard label="STORAGE USED" value={formatKB(vaultStats.totalKB)} />
          </div>

          <div className="mb-6">
            <DocumentsTable folderNode={folderNode} />
          </div>

          <QuickAccess />
        </div>

        <div className="w-72 shrink-0 space-y-4">
          <StorageByDepartment />
          {node && <PropertiesPanel node={node} />}
        </div>
      </div>
    </div>
  );
}
