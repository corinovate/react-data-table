import { themes } from './presets';
import { baseDarkTokens, baseTokens } from './tokens';
import type { Theme, ThemeInput, ThemeName, ThemeTokens } from './tokens';

export interface CreateThemeOptions extends Theme {
  /** Preset (or theme) to start from. Default `"default"`. */
  extends?: ThemeInput;
}

function toTheme(input: ThemeInput | undefined): Theme {
  if (!input) return themes.default;
  if (typeof input === 'string') return themes[input as ThemeName] ?? themes.default;
  return input;
}

/**
 * Build a custom theme on top of a preset.
 *
 * ```ts
 * const brand = createTheme({ extends: 'modern', tokens: { accent: '#e11d48' } });
 * ```
 */
export function createTheme(options: CreateThemeOptions = {}): Theme {
  const { extends: base, ...overrides } = options;
  const parent = toTheme(base);
  return {
    name: overrides.name ?? parent.name ?? 'custom',
    forcedMode: overrides.forcedMode ?? parent.forcedMode,
    tokens: { ...parent.tokens, ...overrides.tokens },
    darkTokens: { ...parent.darkTokens, ...overrides.darkTokens },
  };
}

function toVarName(token: string): string {
  return `--cdt-${token.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

export interface ResolvedTheme {
  name: string;
  mode: 'light' | 'dark';
  tokens: ThemeTokens;
  /** CSS custom properties to put on the root element. */
  style: Record<string, string>;
}

/** Merge a theme into a complete token set for one color mode. */
export function resolveTheme(input: ThemeInput | undefined, mode: 'light' | 'dark'): ResolvedTheme {
  const theme = toTheme(input);
  const effectiveMode = theme.forcedMode ?? mode;
  const tokens: ThemeTokens =
    effectiveMode === 'dark'
      ? { ...baseTokens, ...theme.tokens, ...baseDarkTokens, ...theme.darkTokens }
      : { ...baseTokens, ...theme.tokens };

  const style: Record<string, string> = {};
  for (const key of Object.keys(tokens) as (keyof ThemeTokens)[]) {
    style[toVarName(key)] = tokens[key];
  }
  return { name: theme.name ?? 'custom', mode: effectiveMode, tokens, style };
}
