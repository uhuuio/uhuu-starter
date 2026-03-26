// Themes sourced from /uhuu-layoutkit/storage/themes/
// Each theme uses the light mode cssVars from the registry

export const THEMES = {
  'modern-minimal': {
    label: 'Modern Minimal',
    fontSans: 'Inter, sans-serif',
    fontMono: 'JetBrains Mono, monospace',
    background: 'oklch(1.0000 0 0)',
    foreground: 'oklch(0.3211 0 0)',
    primary: 'oklch(0.6231 0.1880 259.8145)',
    primaryForeground: 'oklch(1.0000 0 0)',
    muted: 'oklch(0.9846 0.0017 247.8389)',
    mutedForeground: 'oklch(0.5510 0.0234 264.3637)',
    border: 'oklch(0.9276 0.0058 264.5313)',
    card: 'oklch(1.0000 0 0)',
    radius: '0.375rem',
  },
  'mono': {
    label: 'Mono',
    fontSans: 'Geist Mono, monospace',
    fontMono: 'Geist Mono, monospace',
    background: 'oklch(1.0000 0 0)',
    foreground: 'oklch(0.1448 0 0)',
    primary: 'oklch(0.5555 0 0)',
    primaryForeground: 'oklch(0.9851 0 0)',
    muted: 'oklch(0.9702 0 0)',
    mutedForeground: 'oklch(0.5486 0 0)',
    border: 'oklch(0.9219 0 0)',
    card: 'oklch(1.0000 0 0)',
    radius: '0rem',
  },
  'ocean-breeze': {
    label: 'Ocean Breeze',
    fontSans: 'DM Sans, sans-serif',
    fontMono: 'IBM Plex Mono, monospace',
    background: 'oklch(0.9751 0.0127 244.2507)',
    foreground: 'oklch(0.3729 0.0306 259.7328)',
    primary: 'oklch(0.7227 0.1920 149.5793)',
    primaryForeground: 'oklch(1.0000 0 0)',
    muted: 'oklch(0.9670 0.0029 264.5419)',
    mutedForeground: 'oklch(0.5510 0.0234 264.3637)',
    border: 'oklch(0.9276 0.0058 264.5313)',
    card: 'oklch(1.0000 0 0)',
    radius: '0.5rem',
  },
  'amber-minimal': {
    label: 'Amber Minimal',
    fontSans: 'Inter, sans-serif',
    fontMono: 'JetBrains Mono, monospace',
    background: 'oklch(1.0000 0 0)',
    foreground: 'oklch(0.2686 0 0)',
    primary: 'oklch(0.7686 0.1647 70.0804)',
    primaryForeground: 'oklch(0 0 0)',
    muted: 'oklch(0.9846 0.0017 247.8389)',
    mutedForeground: 'oklch(0.5510 0.0234 264.3637)',
    border: 'oklch(0.9276 0.0058 264.5313)',
    card: 'oklch(1.0000 0 0)',
    radius: '0.375rem',
  },
};

export const DEFAULT_THEME = 'modern-minimal';

export function getTheme(name) {
  return THEMES[name] || THEMES[DEFAULT_THEME];
}
