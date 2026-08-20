export interface CssVariable {
  name: string;
  value: string;
}

function discoverRootVariableNames(): string[] {
  const names = new Set<string>();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
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

export function getColorTokens(): CssVariable[] {
  const computed = getComputedStyle(document.documentElement);
  return discoverRootVariableNames()
    .filter((name) => !name.startsWith('--color-') && !name.startsWith('--radius') && !name.startsWith('--font-'))
    .map((name) => ({ name, value: computed.getPropertyValue(name).trim() }))
    .filter((variable) => COLOR_VALUE_PATTERN.test(variable.value));
}
