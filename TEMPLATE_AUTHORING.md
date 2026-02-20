# Template Authoring Guide

Complete guide for creating and deploying Uhuu document templates.

## Quick Start

```bash
# Create new template from example
npm create uhuu-starter@latest -- --example dialog-markdown
cd my-template

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in Uhuu integration mode
npm run uhuu
```

## Required Files

Every Uhuu template must include:

```
my-template/
├── package.json          # Dependencies and scripts
├── vite.config.mjs       # Vite + uhuu plugin config
├── src/
│   ├── App.tsx          # Main entry point
│   └── template/        # Your template components
├── styles/
│   ├── index.css        # Base styles
│   └── print.css        # Print CSS (for Dynamic pagination only)
└── test/
    └── sample_data.json # Sample payload for dev
```

**Note**: `print.css` is only required if using `Dynamic.Pagination` (Paged.js). Not needed for `Static.Pagination`.

## Setup Object Contract

The `setup` object passed to `Pagination` defines page configuration:

```typescript
interface PaginationSetup {
  format: string;           // REQUIRED: 'A4', 'LETTER', 'LEGAL', etc.
  bleed?: number;           // OPTIONAL: bleed in mm (default: 0)
  printCssRaw?: string;     // OPTIONAL: print CSS as string
  printCssUrl?: string;     // OPTIONAL: external CSS URL
  orientation?: string;     // OPTIONAL: 'portrait' | 'landscape'
  showBleed?: boolean;      // OPTIONAL: show bleed guides
}
```

### Example

```tsx
import { Dynamic } from 'uhuu-components';
import printCssRaw from './styles/print.css?raw';

function App() {
  const payload = $uhuu.payload() || sampleData;

  return (
    <Dynamic.Pagination setup={{
      format: "A4",
      bleed: 3,
      printCssRaw
    }}>
      <MyTemplate data={payload} />
    </Dynamic.Pagination>
  );
}
```

## Print CSS Requirements

> **Note**: Print CSS (`printCssRaw`) is **only required for Dynamic pagination** (using Paged.js).
> Static pagination uses CSS page breaks and doesn't need printCssRaw.

### Minimum Required CSS (Dynamic Pagination Only)

Templates using `Dynamic.Pagination` should provide `print.css` with these essentials:

```css
@page {
  size: A4;           /* Match your format */
  margin: 12mm;       /* REQUIRED: page margins */
  bleed: 3mm;         /* If using bleed */
}

/* Page numbers in footer */
@page {
  @bottom-right {
    content: counter(page);
    font-size: 7pt;
    right: 12mm;
    position: absolute;
    bottom: 6mm;
  }
}

/* Page break utilities */
.page-break-inside-avoid {
  page-break-inside: avoid;
  break-inside: avoid-page;
}

.page-break-after {
  page-break-after: always;
  break-after: page;
}

.page-break-before {
  page-break-before: always;
  break-before: page;
}
```

### Why Print CSS Matters (Dynamic Pagination)

**For `Dynamic.Pagination`** (Paged.js-based):

Without `printCssRaw`, uhuu-components will auto-generate **basic CSS** with only:
- Page size (from format)
- Bleed amount

You'll be **missing**:
- Page margins (content will touch edges)
- Headers/footers
- Page numbers
- Page break utilities
- Custom print styling

**Pro tip**: Always provide print.css for Dynamic pagination templates.

**For `Static.Pagination`**:

Static pagination uses CSS page breaks and doesn't require `printCssRaw`. Page styling is handled through regular CSS.

## Template Validation Checklist

Before deploying your template, verify:

### Build & Run
- [ ] `npm run build` completes without errors
- [ ] `npm run dev` works with sample data
- [ ] `npm run uhuu` runs without console errors
- [ ] Browser console shows no warnings

### Print Layout
- [ ] Pages have correct margins (not touching edges)
- [ ] Page numbers appear in footer
- [ ] Page breaks work as expected
- [ ] Content doesn't overflow page bounds

### Images
- [ ] Images handle bleed correctly
- [ ] Images don't cause layout shifts
- [ ] Image quality is acceptable

### Uhuu Integration
- [ ] Editable fields work in uhuu mode
- [ ] Payload updates reflect in preview
- [ ] No errors when toggling interactive mode

## Common Patterns

### Pattern 1a: Basic Document (Dynamic Pagination)

Using Paged.js for advanced pagination:

```tsx
import { Dynamic } from 'uhuu-components';
const { Pagination } = Dynamic;
import printCssRaw from './styles/print.css?raw';  // Required for Dynamic

function App() {
  const [payload, setPayload] = useState($uhuu.payload());
  $uhuu.listen('payload', setPayload);

  return (
    <Pagination setup={{ format: "A4", bleed: 3, printCssRaw }}>
      <MyPage data={payload} />
    </Pagination>
  );
}
```

### Pattern 1b: Basic Document (Static Pagination)

Using CSS-based pagination (simpler, no printCssRaw needed):

```tsx
import { Static } from 'uhuu-components';
const { Pagination } = Static;

function App() {
  const [payload, setPayload] = useState($uhuu.payload());
  $uhuu.listen('payload', setPayload);

  return (
    <Pagination setup={{ format: "A4", bleed: 3 }}>
      <MyPage data={payload} />
    </Pagination>
  );
}
```

### Pattern 2: Multi-Page Document

Document with multiple page types:

```tsx
import { EditorShell } from 'uhuu-components';

const pageGroups = EditorShell.buildPageGroupsConfig([
  {
    id: 'cover',
    label: 'Cover',
    pages: [{ component: CoverPage, sheetType: 'cover' }]
  },
  {
    id: 'content',
    label: 'Content',
    pages: [
      { component: Page1, sheetType: 'text' },
      { component: Page2, sheetType: 'text' }
    ]
  }
]);

<EditorShell.PageEditor
  pageGroups={pageGroups}
  pageFormat={{ width: 210, height: 297, bleed: 3 }}
/>
```

### Pattern 3: Conditional Pages

Show different pages based on payload:

```tsx
function App() {
  const payload = $uhuu.payload();

  return (
    <Pagination setup={{ format: "A4", bleed: 3, printCssRaw }}>
      <CoverPage data={payload} />
      {payload.showIntro && <IntroPage data={payload} />}
      <ContentPage data={payload} />
      {payload.showAppendix && <AppendixPage data={payload} />}
    </Pagination>
  );
}
```

## Common Gotchas

### 1. "does not provide an export named default"

**Symptom**: Build works but runtime error in browser
**Cause**: CJS/ESM mismatch in dependencies
**Solution**:
```js
// vite.config.mjs - DO NOT do this:
optimizeDeps: {
  exclude: ['uhuu-components'] // ❌ Don't exclude
}

// Instead, use default config (zero-config)
```

### 2. No Page Margins

**Symptom**: Content touches page edges
**Cause**: Missing margin in print.css
**Solution**: Add `margin: 12mm` to `@page` rule

### 3. Images Overflow

**Symptom**: Images extend beyond page bounds
**Cause**: Not accounting for bleed
**Solution**: Use `ImageBlock` component and set bleed

### 4. Changes Don't Show in Uhuu App

**Symptom**: Template changes not reflected
**Cause**: Cached build output
**Solution**:
```bash
cd uhuu-storybook
npm run build  # Rebuild components first
```

### 5. Dev Warning: "Auto-generating basic @page CSS"

**Symptom**: Console info message about printCssRaw
**Cause**: Not providing printCssRaw in setup
**Solution**:
```tsx
import printCssRaw from './styles/print.css?raw';
<Pagination setup={{ ..., printCssRaw }} />
```

## Page Size Reference

Common page formats and dimensions:

| Format | Width × Height (mm) | Common Use |
|--------|-------------------|------------|
| A4 | 210 × 297 | Standard documents |
| A3 | 297 × 420 | Posters, large docs |
| A5 | 148 × 210 | Booklets, flyers |
| LETTER | 216 × 279 | US standard |
| LEGAL | 216 × 356 | US legal docs |
| TABLOID | 279 × 432 | Newsletters |

### Bleed Guidelines

- **No bleed**: 0mm (digital-only)
- **Standard bleed**: 3mm (most print)
- **Large format**: 5mm (posters)

## Documentation Requirements

Each template should include:

### README.md
```markdown
# Template Name

## Purpose
Brief description of what this template generates

## Payload Schema
```json
{
  "field1": "string",
  "field2": 123
}
```

## Setup
- Format: A4
- Bleed: 3mm
- Features: page numbers, headers, etc.
```

### sample_data.json
Realistic example payload for development:
```json
{
  "title": "Example Document",
  "date": "2026-02-13",
  "items": [...]
}
```

## Deployment Checklist

Before submitting template:

- [ ] All files present (App.tsx, print.css, etc.)
- [ ] Dependencies listed in package.json
- [ ] README documents payload schema
- [ ] sample_data.json has realistic data
- [ ] Build completes successfully
- [ ] No console errors in uhuu mode
- [ ] Print preview looks correct
- [ ] Page margins are visible
- [ ] Images handle bleed correctly

## Getting Help

- Check examples in `uhuu-starter/examples/`
- Read component docs in `uhuu-storybook/AGENTS.md`
- Review existing templates for patterns

## Advanced Topics

### Custom Page Filtering

For separate cover/text PDFs:

```tsx
<EditorShell.PageEditor
  pageFilter={{ mode: 'cover', coverPageCount: 2 }}
  pageFormat={{ bleed: 3 }}
/>
```

Modes:
- `all`: All pages (default)
- `cover`: First N + last N pages
- `text`: Inner pages only
- `custom`: Specific ranges

### Template Data Provider

For complex data binding:

```tsx
<EditorShell.TemplateDataProvider
  data={payload}
  onUpdate={handleUpdate}
>
  <EditorShell.PageEditor ... />
</EditorShell.TemplateDataProvider>
```

### Development Print Controls

For testing print modes:

```tsx
const PRINT_CONFIGS = {
  preview: { label: 'Preview', filter: { mode: 'all' } },
  cover: { label: 'Cover', filter: { mode: 'cover' }, pageFormat: { bleed: 3 } },
  text: { label: 'Text', filter: { mode: 'text' }, pageFormat: { bleed: 3 } }
};

<EditorShell.PageEditor printConfigs={PRINT_CONFIGS} />
```

---

**Last Updated**: 2026-02-13
**Version**: 1.0
