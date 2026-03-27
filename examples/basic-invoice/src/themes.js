// Themes sourced from /uhuu-layoutkit/storage/themes/
// All colours are hex — oklch is not supported in PDF/print rendering engines.

export const THEMES = {
  'modern-minimal': {
    label: 'Modern Minimal',
    fontSans: 'Inter, sans-serif',
    fontMono: 'JetBrains Mono, monospace',
    background: '#ffffff',
    foreground: '#3f3f3f',
    primary: '#3b78f6',
    primaryForeground: '#ffffff',
    muted: '#f8f9fb',
    mutedForeground: '#6b7280',
    border: '#e5e7eb',
    radius: '0.375rem',
  },
  'mono': {
    label: 'Mono',
    fontSans: 'Geist Mono, monospace',
    fontMono: 'Geist Mono, monospace',
    background: '#ffffff',
    foreground: '#171717',
    primary: '#737373',
    primaryForeground: '#f5f5f5',
    muted: '#f5f5f5',
    mutedForeground: '#737373',
    border: '#e5e5e5',
    radius: '0rem',
  },
  'ocean-breeze': {
    label: 'Ocean Breeze',
    fontSans: 'DM Sans, sans-serif',
    fontMono: 'IBM Plex Mono, monospace',
    background: '#eef3fa',
    foreground: '#3d4f6a',
    primary: '#35a868',
    primaryForeground: '#ffffff',
    muted: '#f0f2f7',
    mutedForeground: '#6b7280',
    border: '#e5e7eb',
    radius: '0.5rem',
  },
  'amber-minimal': {
    label: 'Amber Minimal',
    fontSans: 'Inter, sans-serif',
    fontMono: 'JetBrains Mono, monospace',
    background: '#ffffff',
    foreground: '#303030',
    primary: '#d97706',
    primaryForeground: '#000000',
    muted: '#f8f9fb',
    mutedForeground: '#6b7280',
    border: '#e5e7eb',
    radius: '0.375rem',
  },
};

export const DEFAULT_THEME = 'modern-minimal';

export function getTheme(name) {
  return THEMES[name] || THEMES[DEFAULT_THEME];
}
