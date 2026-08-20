export type FileCategory = 'pdf' | 'image' | 'document' | 'spreadsheet' | 'code' | 'other';

const EXTENSION_CATEGORIES: Record<string, FileCategory> = {
  pdf: 'pdf',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  svg: 'image',
  webp: 'image',
  doc: 'document',
  docx: 'document',
  txt: 'document',
  md: 'document',
  xls: 'spreadsheet',
  xlsx: 'spreadsheet',
  csv: 'spreadsheet',
  ts: 'code',
  tsx: 'code',
  js: 'code',
  jsx: 'code',
  json: 'code',
  yaml: 'code',
  yml: 'code',
  ttf: 'code',
};

/** Derives a coarse category from a file's extension, used to pick an icon and color. */
export function getFileCategory(name: string): FileCategory {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_CATEGORIES[ext] ?? 'other';
}

const CATEGORY_COLOR_CLASSES: Record<FileCategory, string> = {
  pdf: 'text-chart-1',
  image: 'text-chart-5',
  document: 'text-chart-2',
  spreadsheet: 'text-chart-3',
  code: 'text-chart-4',
  other: 'text-muted-foreground',
};

export function fileCategoryColorClass(category: FileCategory): string {
  return CATEGORY_COLOR_CLASSES[category];
}
