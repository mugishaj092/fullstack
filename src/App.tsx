import { Sidebar } from './components/layout/Sidebar'
import { TreeStateProvider } from './components/tree/TreeStateProvider'
import { useTreeState } from './components/tree/TreeStateContext'
import { PropertiesPanel } from './components/properties/PropertiesPanel'
import vaultData from './data/vault-data.json'
import type { VaultNode } from './types/vault'
import { findNode } from './lib/tree'

const forest = vaultData as VaultNode[]

function MainContent() {
  const { selectedId } = useTreeState()
  const node = selectedId ? findNode(forest, selectedId) : null
  return <PropertiesPanel node={node} />
}

function App() {
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
