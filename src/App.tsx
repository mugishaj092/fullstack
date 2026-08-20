import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/layout/Dashboard'
import { FileDetail } from './components/layout/FileDetail'
import { TreeStateProvider } from './components/tree/TreeStateProvider'
import { useTreeState } from './components/tree/TreeStateContext'
import { DesignSystem } from './pages/DesignSystem'
import vaultData from './data/vault-data.json'
import type { VaultNode } from './types/vault'
import { findNode } from './lib/tree'

const forest = vaultData as VaultNode[]

function MainContent() {
  const { selectedId } = useTreeState()
  const node = selectedId ? findNode(forest, selectedId) : null

  if (node?.type === 'file') {
    return <FileDetail file={node} />
  }

  return <Dashboard node={node} />
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
