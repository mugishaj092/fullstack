import { ShieldCheck } from 'lucide-react';
import { FileTree } from '../tree/FileTree';

export function Sidebar() {
  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex shrink-0 items-center gap-2.5 px-4 pb-4 pt-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <ShieldCheck className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">SecureVault</p>
          <p className="truncate text-xs text-muted-foreground">Document Control</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-3">
        <FileTree />
      </div>

      <div className="shrink-0 border-t border-sidebar-border px-4 py-2.5 text-xs text-muted-foreground">
        ↑↓ move · → expand · ← collapse · ⏎ select
      </div>
    </aside>
  );
}
