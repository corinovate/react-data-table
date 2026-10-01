import type { Theme, ThemeName } from './tokens';

/** Clean, neutral business look. Works anywhere. */
const defaultTheme: Theme = { name: 'default' };

/** No outer card, airy rows, small uppercase headers, monochrome accent. */
const minimal: Theme = {
  name: 'minimal',
  tokens: {
    background: 'transparent',
    headerBackground: 'transparent',
    rowHoverBackground: '#f9fafb',
    expandedBackground: '#f9fafb',
    border: '#eef0f3',
    borderStrong: '#d6d9de',
    accent: '#111827',
    radius: '0px',
    controlRadius: '6px',
    badgeRadius: '4px',
    borderWidth: '0px',
    shadow: 'none',
    cellPaddingX: '12px',
    cellPaddingY: '14px',
    headerFontSize: '11px',
    headerFontWeight: '600',
    headerTextTransform: 'uppercase',
    headerLetterSpacing: '0.06em',
    headerText: '#6b7280',
  },
  darkTokens: {
    background: 'transparent',
    headerBackground: 'transparent',
    rowHoverBackground: 'rgba(255, 255, 255, 0.03)',
    accent: '#f3f4f6',
    accentText: '#111827',
    headerText: '#9ca3af',
    border: '#23272f',
  },
};

/** Soft shadows, rounded corners, generous spacing, indigo accent. */
const modern: Theme = {
  name: 'modern',
  tokens: {
    accent: '#5b5bd6',
    background: '#ffffff',
    headerBackground: '#ffffff',
    rowHoverBackground: '#f7f7fd',
    expandedBackground: '#fafaff',
    border: '#eceef3',
    radius: '18px',
    controlRadius: '10px',
    borderWidth: '1px',
    shadow: '0 1px 3px rgba(16, 24, 40, 0.05), 0 12px 32px -12px rgba(16, 24, 40, 0.12)',
    cellPaddingX: '20px',
    cellPaddingY: '15px',
    headerPaddingY: '13px',
    rowHeight: '56px',
    controlHeight: '38px',
    gap: '14px',
    headerFontSize: '12px',
    headerFontWeight: '600',
    headerTextTransform: 'uppercase',
    headerLetterSpacing: '0.05em',
    headerText: '#7a8194',
    titleFontSize: '18px',
  },
  darkTokens: {
    accent: '#8b8bff',
    accentText: '#14142b',
    background: '#15161f',
    headerBackground: '#15161f',
    rowHoverBackground: '#1c1d29',
    expandedBackground: '#181924',
    controlBackground: '#1a1b26',
    popoverBackground: '#1d1e2a',
    border: '#262838',
    headerText: '#8d93a8',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.4), 0 12px 32px -12px rgba(0, 0, 0, 0.7)',
  },
};

/** Dense, spreadsheet-like rows with grid lines. Great for reports. */
const compact: Theme = {
  name: 'compact',
  tokens: {
    headerBackground: '#f3f4f6',
    rowStripeBackground: '#fafbfc',
    radius: '6px',
    controlRadius: '5px',
    badgeRadius: '4px',
    columnBorderWidth: '1px',
    cellPaddingX: '10px',
    cellPaddingY: '6px',
    headerPaddingY: '7px',
    rowHeight: '34px',
    controlHeight: '30px',
    gap: '8px',
    fontSize: '13px',
    headerFontSize: '12px',
    titleFontSize: '15px',
  },
  darkTokens: {
    headerBackground: '#1a1e25',
    rowStripeBackground: 'rgba(255, 255, 255, 0.02)',
  },
};

/** A dedicated dark theme with a deep navy palette. Always renders dark. */
const dark: Theme = {
  name: 'dark',
  forcedMode: 'dark',
  darkTokens: {
    background: '#0d1117',
    headerBackground: '#121821',
    rowHoverBackground: '#161d28',
    expandedBackground: '#10161e',
    controlBackground: '#121821',
    popoverBackground: '#161d28',
    border: '#1f2733',
    borderStrong: '#2d3746',
    text: '#e6edf3',
    textMuted: '#8b97a7',
    headerText: '#b6c2d1',
    accent: '#3d8bfd',
    skeleton: '#1c2430',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.5), 0 10px 30px -12px rgba(0, 0, 0, 0.7)',
  },
};

/** Frosted, translucent surfaces. Looks best on a colorful or image background. */
const glass: Theme = {
  name: 'glass',
  tokens: {
    background: 'rgba(255, 255, 255, 0.55)',
    headerBackground: 'rgba(255, 255, 255, 0.45)',
    rowHoverBackground: 'rgba(255, 255, 255, 0.55)',
    expandedBackground: 'rgba(255, 255, 255, 0.35)',
    controlBackground: 'rgba(255, 255, 255, 0.6)',
    popoverBackground: 'rgba(255, 255, 255, 0.92)',
    rowSelectedBackground: 'color-mix(in srgb, var(--cdt-accent) 12%, transparent)',
    border: 'rgba(255, 255, 255, 0.65)',
    borderStrong: 'rgba(15, 23, 42, 0.14)',
    accent: '#7c3aed',
    skeleton: 'rgba(15, 23, 42, 0.08)',
    radius: '20px',
    controlRadius: '12px',
    shadow: '0 8px 32px rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(18px) saturate(160%)',
    cellPaddingX: '18px',
    cellPaddingY: '13px',
  },
  darkTokens: {
    background: 'rgba(17, 24, 39, 0.5)',
    headerBackground: 'rgba(17, 24, 39, 0.35)',
    rowHoverBackground: 'rgba(255, 255, 255, 0.05)',
    expandedBackground: 'rgba(0, 0, 0, 0.15)',
    controlBackground: 'rgba(255, 255, 255, 0.06)',
    popoverBackground: 'rgba(23, 28, 40, 0.94)',
    rowSelectedBackground: 'color-mix(in srgb, var(--cdt-accent) 20%, transparent)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderStrong: 'rgba(255, 255, 255, 0.18)',
    accent: '#a78bfa',
    accentText: '#1e1033',
    skeleton: 'rgba(255, 255, 255, 0.08)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  },
};

export const themes: Record<ThemeName, Theme> = {
  default: defaultTheme,
  minimal,
  modern,
  compact,
  dark,
  glass,
};
