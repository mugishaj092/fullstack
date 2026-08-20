import { getColorTokens } from '../lib/css-tokens';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SPACING_STEPS = [4, 8, 12, 16, 24, 32, 48, 64];

const TYPE_SAMPLES = [
  { label: 'Display', className: 'text-4xl font-semibold', usage: 'Dashboard.tsx — dashboard page title' },
  { label: 'H1', className: 'text-2xl font-semibold', usage: 'FileDetail.tsx — file name heading' },
  { label: 'Body', className: 'text-sm', usage: 'PropertiesPanel.tsx — row labels/values' },
  { label: 'Small', className: 'text-xs', usage: 'Sidebar.tsx / TreeNode.tsx — captions, pills, hints' },
  { label: 'Caption', className: 'text-[10px] font-semibold', usage: 'TreeNode.tsx / FileTree.tsx — file badges, ⌘K hint' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function ColorPalette() {
  const tokens = getColorTokens();

  return (
    <Section title="Color Palette">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tokens.map((token) => (
          <div key={token.name} className="glass overflow-hidden rounded-lg">
            <div className="h-16 w-full" style={{ background: `var(${token.name})` }} />
            <div className="px-3 py-2">
              <p className="font-mono text-xs text-foreground">{token.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{token.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TypographyScale() {
  return (
    <Section title="Typography Scale">
      <div className="glass divide-y divide-border rounded-lg">
        {TYPE_SAMPLES.map((sample) => (
          <div key={sample.label} className="flex items-center gap-6 px-4 py-3">
            <div className="w-24 shrink-0">
              <p className="text-xs font-medium text-muted-foreground">{sample.label}</p>
              <p className="text-xs text-muted-foreground">{sample.usage}</p>
            </div>
            <p className={`${sample.className} text-foreground`}>SecureVault Vault Dashboard</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        H2 isn't shown: the app doesn't currently ship a third heading tier, and adding one here
        would mean inventing a size that isn't actually used in any component.
      </p>
    </Section>
  );
}

function SpacingGrid() {
  return (
    <Section title="Spacing Grid">
      <div className="glass flex flex-col gap-3 rounded-lg p-4">
        {SPACING_STEPS.map((px) => (
          <div key={px} className="flex items-center gap-4">
            <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">{px}px</span>
            <div className="h-3 rounded bg-primary" style={{ width: px }} />
          </div>
        ))}
      </div>
    </Section>
  );
}

function ComponentStates() {
  return (
    <Section title="Component States">
      <div className="glass rounded-lg p-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Button</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col items-start gap-2">
            <Button>Save Changes</Button>
            <span className="text-xs text-muted-foreground">Default (hover it to preview :hover)</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Button className="outline outline-2 outline-ring outline-offset-2">Save Changes</Button>
            <span className="text-xs text-muted-foreground">Focus</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Button disabled>Save Changes</Button>
            <span className="text-xs text-muted-foreground">Disabled</span>
          </div>
        </div>
      </div>

      <div className="glass mt-4 rounded-lg p-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Input</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Input placeholder="Search vault..." />
            <span className="text-xs text-muted-foreground">Default</span>
          </div>
          <div className="flex flex-col gap-2">
            <Input placeholder="Search vault..." className="ring-2 ring-ring" />
            <span className="text-xs text-muted-foreground">Focus</span>
          </div>
          <div className="flex flex-col gap-2">
            <Input placeholder="Search vault..." disabled />
            <span className="text-xs text-muted-foreground">Disabled</span>
          </div>
          <div className="flex flex-col gap-2">
            <Input placeholder="Required field" error />
            <span className="text-xs text-muted-foreground">Error</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function DesignSystem() {
  return (
    <div className="min-h-svh bg-background p-8 text-foreground">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-4xl font-semibold text-foreground">SecureVault Design System</h1>
        <p className="mb-10 text-sm text-muted-foreground">
          Generated live from globals.css and the app's real, shipped components — nothing on this
          page is a hardcoded value or a static mockup.
        </p>
        <ColorPalette />
        <TypographyScale />
        <SpacingGrid />
        <ComponentStates />
      </div>
    </div>
  );
}
