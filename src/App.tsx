import { FileTree } from './components/tree/FileTree'
import { TreeStateProvider, useTreeState } from './components/tree/TreeStateContext'
import { PropertiesPanel } from './components/properties/PropertiesPanel'
import vaultData from './data/vault-data.json'
import type { VaultNode } from './types/vault'
import { findNode } from './lib/tree'

const forest = vaultData as VaultNode[]

function ConnectedPropertiesPanel() {
  const { selectedId } = useTreeState()
  const node = selectedId ? findNode(forest, selectedId) : null
  return <PropertiesPanel node={node} />
}

function App() {
  return (
    <div className="min-h-svh bg-background p-6 text-foreground">
      <TreeStateProvider>
        <div className="mx-auto flex max-w-2xl gap-4">
          <div className="w-72 shrink-0 rounded-lg border border-border bg-card p-3">
            <FileTree />
          </div>
          <div className="flex-1">
            <ConnectedPropertiesPanel />
          </div>
        </div>
      </TreeStateProvider>
    </div>
  )
}

export default App
