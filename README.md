# SecureVault File Explorer

A dark-mode file explorer for SecureVault's document vault. Frontend-only React app over a static
`vault-data.json` — no backend, no fake data.

**Live demo:** https://fullstack-puce-ten-81.vercel.app/

## Run the Project

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`), then visit `/design-system` for
a live design-system reference.

Run the tests with:

```bash
npm run test
```

## Design File

**Figma:** [SecureVault — Document Management System](https://www.figma.com/design/9GII0CiRhkgFyRhuIAolpV/SecureVault-%E2%80%94-Document-Management-System?node-id=0-1&t=odmdnlz1AEMCFFP7-1)

The in-app `/design-system` page also works as a live reference — it reads colors directly from
`globals.css` at runtime, so it can't drift out of sync with the shipped app the way a static Figma
page can.

## Recursive Tree Structure

One component, `TreeNode`, renders itself for its own children — a folder maps over
`node.children` and renders a `<TreeNode>` per child, one level deeper. That's what lets nesting
like `01_Legal_Department → Active_Cases → Doe_vs_MegaCorp_Inc → Discovery_Phase` work without
special-casing depth.

Which folders are open lives in one shared `Set<string>` (`expanded`, owned by
`TreeStateProvider`) instead of state inside each `TreeNode`. That's what lets keyboard navigation
and search reach in and read/change it from outside the tree.

`flattenVisible` turns the currently-expanded tree into a flat, top-to-bottom list of exactly
what's on screen, so arrow-key navigation is just moving an index up or down that list.

## Folder Statistics

`vault-data.json` only lists a folder's direct children — not its total nested file count or size.
`computeStats` fills that gap with a post-order recursion: resolve every child first, then sum
into the parent, so a folder's totals always include everything nested beneath it. Results are
cached per node (`WeakMap`) so nothing is recomputed twice.

Used in: the pill next to every folder row, the Properties panel, dashboard stat cards, and
per-department storage bars — so legal/finance/IT teams doing audits can judge a folder's
footprint before opening it.

## Accessibility

Full keyboard tree pattern: `role="tree"` on the container, `role="treeitem"` on every row,
`aria-expanded` on folders, `aria-selected` on the focused row, and a roving `tabIndex` so only one
row is ever tabbable.

| Key | Action |
|---|---|
| `↑` / `↓` | Move to the previous/next visible row |
| `→` | Expand a folder, or step into its first child if already open |
| `←` | Collapse an open folder, or jump to its parent |
| `Enter` | Select the row; toggles a folder open/closed |

## Search

Filters the tree by name and force-expands every ancestor of a match, so results are never hidden
behind a collapsed folder. Clearing the search restores whatever the user had manually expanded
before — the search expansion is layered on top of the real state, never written back into it.
