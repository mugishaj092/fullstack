export interface CssVariable {
  name: string;
  value: string;
}

/**
 * Discovers every custom property declared on `:root` by scanning loaded stylesheets (no
 * hardcoded token list), then reads each one's live value via getComputedStyle. This is how
 * the design-system page stays in sync with globals.css without duplicating its values.
 */
function discoverRootVariableNames(): string[] {
  const names = new Set<string>();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin stylesheet; nothing we can read
    }

    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
        for (let i = 0; i < rule.style.length; i++) {
          const prop = rule.style[i];
          if (prop.startsWith('--')) names.add(prop);
        }
      }
    }
  }

  return Array.from(names).sort();
}

const COLOR_VALUE_PATTERN = /^(oklch|oklab|rgb|rgba|hsl|hsla|#)/i;

/**
 * Every `:root` custom property that resolves to a color, excluding the `--color-*`/`--radius-*`/
 * `--font-*` names Tailwind's `@theme inline` block generates as plumbing for utility classes —
 * those just re-point at the real tokens below and would otherwise show up as literal duplicates.
 */
export function getColorTokens(): CssVariable[] {
  const computed = getComputedStyle(document.documentElement);
  return discoverRootVariableNames()
    .filter((name) => !name.startsWith('--color-') && !name.startsWith('--radius') && !name.startsWith('--font-'))
    .map((name) => ({ name, value: computed.getPropertyValue(name).trim() }))
    .filter((variable) => COLOR_VALUE_PATTERN.test(variable.value));
}
