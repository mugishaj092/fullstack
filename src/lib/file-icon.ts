export interface FileTypeBadge {
  label: string;
  colorClass: string;
}

const EXTENSION_LABELS: Record<string, string> = {
  yaml: 'YML',
  yml: 'YML',
};

export function getFileTypeBadge(name: string): FileTypeBadge {
  const lower = name.toLowerCase();
  const ext = lower.split('.').pop() ?? '';

  if (lower.includes('log')) return { label: 'LOG', colorClass: 'text-chart-4 bg-chart-4/15' };
  if (ext === 'pdf') return { label: 'PDF', colorClass: 'text-chart-1 bg-chart-1/15' };
  if (['doc', 'docx', 'txt', 'md'].includes(ext)) return { label: 'DOC', colorClass: 'text-chart-2 bg-chart-2/15' };
  if (['xls', 'xlsx', 'csv'].includes(ext)) return { label: 'XLS', colorClass: 'text-chart-3 bg-chart-3/15' };
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
    return { label: 'IMG', colorClass: 'text-chart-5 bg-chart-5/15' };
  }

  const label = EXTENSION_LABELS[ext] ?? (ext || name).slice(0, 3).toUpperCase();
  return { label, colorClass: 'text-muted-foreground bg-muted/70' };
}
