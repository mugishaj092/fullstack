import { FileTree } from './components/tree/FileTree'

function App() {
  return (
    <div className="min-h-svh bg-background p-6 text-foreground">
      <div className="mx-auto max-w-xs rounded-lg border border-border bg-card p-3">
        <FileTree />
      </div>
    </div>
  )
}

export default App
