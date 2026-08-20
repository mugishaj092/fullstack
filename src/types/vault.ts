export type VaultNodeType = 'folder' | 'file';

export interface VaultFile {
  id: string;
  name: string;
  type: 'file';
  size: string; // e.g. "4.2MB" — as given, never reformatted at rest
}

export interface VaultFolder {
  id: string;
  name: string;
  type: 'folder';
  children: VaultNode[];
}

export type VaultNode = VaultFile | VaultFolder;

export interface NodeStats {
  fileCount: number;
  totalKB: number; // normalized to KB, decimal (1MB = 1000KB), matching how the sizes were authored
}
