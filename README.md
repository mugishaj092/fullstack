# SecureVault File Explorer

A dark-mode, keyboard-accessible file explorer for SecureVault's document vault — built as a
frontend-only React app over a static `vault-data.json`, with no backend and no invented data.

**Live demo:** [fullstack-puce-ten-81.vercel.app](https://fullstack-puce-ten-81.vercel.app/)

## Setup

```bash
npm install
npm run dev
```

Run the test suite with `npm run test`. Visit `/design-system` in the running app for a live,
token-driven design system page (see "Design File" below).

## Design File

[SecureVault — Document Management System (Figma)](https://www.figma.com/design/9GII0CiRhkgFyRhuIAolpV/SecureVault-%E2%80%94-Document-Management-System?node-id=0-1&t=odmdnlz1AEMCFFP7-1)

The in-app `/design-system` route (`src/pages/DesignSystem.tsx`) doubles as a code-driven design
reference — it reads every color swatch directly from `globals.css` at runtime via
`getComputedStyle`, so it can't drift out of sync with what's actually shipped the way a static
Figma page can.

## Recursive Strategy

The tree is one component, `TreeNode`, that renders itself for its own children. A folder row maps
over `node.children` and renders a `<TreeNode>` for each one, one level deeper — that's the whole
trick, and it's what lets four levels of nesting (`01_Legal_Department → Active_Cases →
Doe_vs_MegaCorp_Inc → Discovery_Phase`) work without any special-casing for depth.

The state that decides *which* folders are open — `expanded`, a single `Set<string>` of folder
ids — lives once at the top of the tree (in `TreeStateProvider`), not inside each `TreeNode`. If
every folder tracked its own open/closed state, nothing outside that one component could ever read
or change it. Keyboard navigation needs to know what's currently visible on screen to move focus
up/down; search needs to force-expand a folder several levels away when one of its descendants
matches. Both of those only work because there's one shared source of truth to reach into, instead
of state scattered across however many folders happen to be rendered.

That single `Set` is also why keyboard navigation needed its own helper: `flattenVisible` walks
the tree once and produces a flat, top-to-bottom array of exactly the rows currently on screen —
skipping the children of any folder that isn't in `expanded`. Arrow-key navigation is then just
"move an index up or down that array," instead of re-deriving "what's the next visible row" from
the nested structure on every keypress.

## Wildcard Feature

`vault-data.json` only tells you a folder's *immediate* children — to know how many files live
inside `Doe_vs_MegaCorp_Inc` in total, or how much space it takes up, you'd otherwise have to open
every nested folder by hand and add it up yourself. `computeStats` (`src/lib/stats.ts`) closes that
gap: it's a post-order recursion — resolve every child's stats first, then sum them into the
parent's — so a folder's fileCount/totalKB is always the true total of everything nested beneath
it, not just what's one level down. It's memoized per node (`WeakMap`) since the data is static for
the app's lifetime, so a deeply-shared folder is never recomputed twice.

This is the number shown in the pill next to every folder row, in the Properties panel's
"Contains"/"Total size", and in the dashboard's stat cards and per-department storage bars.
SecureVault's actual users — legal, finance, and IT teams doing audits — need to judge a folder's
footprint *before* deciding whether to open it. Post-order recursion is what makes that number
trustworthy without forcing anyone to manually expand a whole subtree first.

## Accessibility

The tree implements the full keyboard tree pattern — `role="tree"` on the container,
`role="treeitem"` on every row, `aria-expanded` on folders, `aria-selected` on the focused/selected
row, and a roving `tabIndex` so Tab only ever lands on one row at a time.

| Key | Action |
|---|---|
| `↑` / `↓` | Move focus to the previous/next visible row |
| `→` | Expand a focused folder, or step into its first child if already open |
| `←` | Collapse a focused open folder, or jump up to its parent |
| `Enter` | Select the focused row; toggles a folder open/closed |

## Bonus: Search

The search box filters the tree by name as you type, and force-expands every ancestor of a match
so a result is never hidden behind a collapsed folder — typing "pdf" expands three separate
branches at once to surface every matching file. Clearing the box doesn't just re-collapse
everything: it restores whatever the user had manually expanded *before* they searched, because the
search-driven expansion is a derived value layered on top of the real `expanded` state, never
written back into it.
