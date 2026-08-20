import { Sidebar } from './components/layout/Sidebar'
import { TreeStateProvider } from './components/tree/TreeStateProvider'
import { useTreeState } from './components/tree/TreeStateContext'
import { PropertiesPanel } from './components/properties/PropertiesPanel'
import { DesignSystem } from './pages/DesignSystem'
import vaultData from './data/vault-data.json'
import type { VaultNode } from './types/vault'
import { findNode } from './lib/tree'
import { computeStats } from './lib/stats'
import { formatKB } from './lib/size'

const forest = vaultData as VaultNode[]

function MainContent() {
  const { selectedId } = useTreeState()
  const node = selectedId ? findNode(forest, selectedId) : null

  if (!node) {
    return <PropertiesPanel node={null} />
  }

  const stats = computeStats(node)
  const subtitle =
    node.type === 'folder' ? `${stats.fileCount} files · ${formatKB(stats.totalKB)}` : node.size

  return (
    <div>
      <h1 className="text-4xl font-semibold text-foreground">{node.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6 max-w-md">
        <PropertiesPanel node={node} />
      </div>
    </div>
  )
}

function App() {
  if (window.location.pathname === '/design-system') {
    return <DesignSystem />
  }

  return (
    <TreeStateProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <MainContent />
        </main>
      </div>
    </TreeStateProvider>
  )
}

export default App
