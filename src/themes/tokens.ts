/**
 * Design tokens. Each one becomes a CSS variable on the table root:
 * `rowHoverBackground` → `--cdt-row-hover-background`.
 */
export interface ThemeTokens {
  /* Colors */
  background: string;
  headerBackground: string;
  rowHoverBackground: string;
  rowStripeBackground: string;
  rowSelectedBackground: string;
  expandedBackground: string;
  controlBackground: string;
  popoverBackground: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  headerText: string;
  accent: string;
  accentText: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  focusRing: string;
  skeleton: string;

  /* Shape & surface */
  radius: string;
  controlRadius: string;
  badgeRadius: string;
  borderWidth: string;
  rowBorderWidth: string;
  columnBorderWidth: string;
  shadow: string;
  popoverShadow: string;
  backdropFilter: string;

  /* Density */
  cellPaddingX: string;
  cellPaddingY: string;
  headerPaddingY: string;
  rowHeight: string;
  controlHeight: string;
  gap: string;

  /* Typography */
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  headerFontSize: string;
  headerFontWeight: string;
  headerTextTransform: string;
  headerLetterSpacing: string;
  titleFontSize: string;

  /* Motion */
  transition: string;
}

export type ThemeName = 'default' | 'minimal' | 'modern' | 'compact' | 'dark' | 'glass';
export type ColorMode = 'light' | 'dark' | 'system';

export interface Theme {
  name?: string;
  /** Overrides on top of the base light tokens. */
  tokens?: Partial<ThemeTokens>;
  /** Overrides applied in dark mode (on top of the base dark tokens). */
  darkTokens?: Partial<ThemeTokens>;
  /** Ignore `colorMode` and always render in this mode. */
  forcedMode?: 'light' | 'dark';
}

export type ThemeInput = ThemeName | Theme;

export const baseTokens: ThemeTokens = {
  background: '#ffffff',
  headerBackground: '#f8fafc',
  rowHoverBackground: '#f5f7fa',
  rowStripeBackground: 'transparent',
  rowSelectedBackground: 'color-mix(in srgb, var(--cdt-accent) 8%, var(--cdt-background))',
  expandedBackground: '#fafbfc',
  controlBackground: '#ffffff',
  popoverBackground: '#ffffff',
  border: '#e6e8ec',
  borderStrong: '#d0d5dd',
  text: '#101828',
  textMuted: '#667085',
  headerText: '#344054',
  accent: '#2563eb',
  accentText: '#ffffff',
  success: '#079455',
  warning: '#dc6803',
  danger: '#d92d20',
  info: '#0086c9',
  focusRing: 'color-mix(in srgb, var(--cdt-accent) 55%, transparent)',
  skeleton: '#eef0f3',

  radius: '12px',
  controlRadius: '8px',
  badgeRadius: '999px',
  borderWidth: '1px',
  rowBorderWidth: '1px',
  columnBorderWidth: '0px',
  shadow: '0 1px 2px rgba(16, 24, 40, 0.05)',
  popoverShadow: '0 12px 24px -6px rgba(16, 24, 40, 0.14), 0 4px 8px -2px rgba(16, 24, 40, 0.06)',
  backdropFilter: 'none',

  cellPaddingX: '16px',
  cellPaddingY: '12px',
  headerPaddingY: '11px',
  rowHeight: '48px',
  controlHeight: '36px',
  gap: '12px',

  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: '14px',
  lineHeight: '1.45',
  headerFontSize: '13px',
  headerFontWeight: '600',
  headerTextTransform: 'none',
  headerLetterSpacing: '0',
  titleFontSize: '16px',

  transition: '140ms ease',
};

export const baseDarkTokens: Partial<ThemeTokens> = {
  background: '#13161c',
  headerBackground: '#181c23',
  rowHoverBackground: '#1c212a',
  rowStripeBackground: 'transparent',
  rowSelectedBackground: 'color-mix(in srgb, var(--cdt-accent) 16%, var(--cdt-background))',
  expandedBackground: '#161a20',
  controlBackground: '#181c23',
  popoverBackground: '#1c2028',
  border: '#272c36',
  borderStrong: '#363c48',
  text: '#e8eaee',
  textMuted: '#98a0ad',
  headerText: '#c5cad3',
  accent: '#4b8bff',
  accentText: '#ffffff',
  success: '#3ccb7f',
  warning: '#f5a524',
  danger: '#f97066',
  info: '#36bffa',
  skeleton: '#232833',
  shadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
  popoverShadow: '0 16px 32px -8px rgba(0, 0, 0, 0.6)',
};
