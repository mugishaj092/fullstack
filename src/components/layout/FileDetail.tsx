import type { VaultFile } from '../../types/vault';
import { getFileTypeBadge } from '../../lib/file-icon';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import { Breadcrumbs } from './Breadcrumbs';
import { Button } from '../ui/Button';

export function FileDetail({ file }: { file: VaultFile }) {
  const badge = getFileTypeBadge(file.name);

  return (
    <div>
      <Breadcrumbs node={file} />

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${badge.colorClass}`}>
            {badge.label}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold text-foreground">{file.name}</h1>
            <p className="text-sm text-muted-foreground">{file.size}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" disabled title="Not available — this is a static, read-only demo">
            Download
          </Button>
          <Button disabled title="Not available — this is a static, read-only demo">
            Share
          </Button>
        </div>
      </div>

      <div className="mt-6 flex gap-6">
        <div className="glass flex min-h-[420px] flex-1 flex-col items-center justify-center rounded-lg p-8 text-center">
          <span className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg text-base font-semibold ${badge.colorClass}`}>
            {badge.label}
          </span>
          <p className="text-sm font-medium text-foreground">No preview available</p>
        </div>
        <div className="w-72 shrink-0">
          <PropertiesPanel node={file} />
        </div>
      </div>
    </div>
  );
}
