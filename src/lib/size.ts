export function parseSizeToKB(size: string): number {
  const match = /^([\d.]+)\s*(KB|MB|GB)$/i.exec(size.trim());
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  const multiplier = unit === 'GB' ? 1_000_000 : unit === 'MB' ? 1_000 : 1;
  return value * multiplier;
}

export function formatKB(kb: number): string {
  if (kb >= 1_000_000) return `${(kb / 1_000_000).toFixed(1)} GB`;
  if (kb >= 1_000) return `${(kb / 1_000).toFixed(1)} MB`;
  return `${Math.round(kb)} KB`;
}
