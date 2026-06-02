# Template Authoring Guide

Current Uhuu templates use `uhuu-components` static rendering. Use fixed static pages for authored one-page layouts, and use flow pagination when a designed page contains variable-length rows or blocks.

## Quick Start

```bash
# Create a new template from an example
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

Every Uhuu template should include:

```text
my-template/
├── package.json
├── vite.config.mjs
├── src/
│   ├── App.tsx
│   └── template/
├── styles/
│   └── index.css
└── test/
    └── sample_data.json
```

`print.css` is not required for current static or flow templates. Page sizing, bleed, and preview mode are passed through `Pagination` or `EditorShell.PageEditor`.

## Page Setup

The page setup object accepts page size and preview options:

```ts
type PageSetup = {
  format?: string;        // A4, LETTER, LEGAL, etc.
  width?: number;         // explicit width in mm
  height?: number;        // explicit height in mm
  orientation?: string;   // portrait or landscape
  bleed?: number;         // bleed in mm
  showBleed?: boolean;
  preview?: string;
};
```

For a single fixed page, use `Static.Pagination` and `Static.Sheet`:

```tsx
import { Static } from 'uhuu-components';

const { Pagination, Sheet } = Static;

export function App() {
  const payload = $uhuu.payload() || sampleData;

  return (
    <Pagination setup={{ format: 'A4', bleed: 3 }}>
      <Sheet pageNo={1}>
        <MyPage payload={payload} />
      </Sheet>
    </Pagination>
  );
}
```

For editable multi-page documents or flow pagination, prefer `EditorShell.PageEditor`:

```tsx
import { EditorShell } from 'uhuu-components';

const { InteractiveModeProvider, TemplateDataProvider, PageEditor } = EditorShell;

const templateConfig = {
  pages: {
    cover: { label: 'Cover', component: CoverPage },
    content: { label: 'Content', component: ContentFlowPage, hasFlow: true },
  },
  initial: ['cover', 'content'],
};

export function Template({ payload, onPayloadChange }) {
  return (
    <InteractiveModeProvider defaultInteractive enableDevTools={import.meta.env.DEV}>
      <TemplateDataProvider payload={payload} onPayloadChange={onPayloadChange}>
        <PageEditor
          templateConfig={templateConfig}
          pageFormat={{ format: 'A4', bleed: 3 }}
          renderOverlay={() => null}
        />
      </TemplateDataProvider>
    </InteractiveModeProvider>
  );
}
```

## Flow Pagination

Flow pagination replaces the old Paged.js path for variable-length template content. It paginates explicit items inside a fixed page design and creates render-only continuation pages through `PageEditor`.

For document bodies such as markdown, Notion, and CMS rich text, prefer the HTML path: convert the body to an HTML string and render it with `Static.FlowDocument`. Use `Static.markdownToFlowItems` only when markdown blocks must stay as live React-rendered blocks with per-block handlers. Use low-level `Static.Flow` for structured rows, product cards, listings, and other item arrays.

Use `Static.FlowPage` for common header/body/footer pages:

```tsx
import { Static } from 'uhuu-components';

function ContentFlowPage({ payload, pageNum, totalPages }) {
  const rows = payload.rows ?? [];

  return (
    <Static.FlowPage
      className="bg-white p-[16mm] text-[11px]"
      flowAreaClassName="mt-[6mm]"
      header={<Header />}
      footer={<Footer pageNum={pageNum} totalPages={totalPages} />}
    >
      <Static.Flow
        id="content-rows"
        items={rows}
        getKey={(row) => row.id}
        metaDefaults={{
          heading: { keepWithNext: 1 },
          row: { avoidBreakInside: true },
        }}
        getItemMeta={(row) => ({
          breakBefore: row.breakBefore,
        })}
        renderItem={(row) => <Row row={row} />}
      />
    </Static.FlowPage>
  );
}
```

Rules for reliable flow templates:

- Add `hasFlow: true` to every `templateConfig.pages` entry that contains `Static.Flow`.
- Give every flow item a stable key from payload data, not a random value.
- Split markdown, Notion, tables, and long sections into block or row items before rendering.
- Use `keepWithNext` for headings and `avoidBreakInside` for rows/cards that should move as a unit.
- Keep the flow area measurable. `Static.FlowPage` already provides the required constrained layout.

CSS multi-column markdown is not supported by the v1 flow algorithm. Flow splits one explicit item stream into pages; it does not fragment a paragraph, table, or column layout line by line.

## Template Validation Checklist

Before deploying a template, verify:

- `npm run build` completes without errors.
- `npm run dev` works with sample data.
- `npm run uhuu` runs without console errors.
- Pages have correct margins and bleed.
- Flow pages create continuation pages when sample content is long.
- Page numbers and totals are correct after flow expansion.
- Editable fields work in Uhuu mode.
- Payload updates are reflected in preview.

## Common Patterns

### Fixed Multi-Page Document

Use `Static.Pagination` and one `Static.Sheet` per authored page:

```tsx
<Pagination setup={{ format: 'A4' }}>
  <Sheet pageNo={1}><CoverPage payload={payload} /></Sheet>
  <Sheet pageNo={2}><DetailsPage payload={payload} /></Sheet>
</Pagination>
```

### Hybrid PageEditor Document

Mix authored pages and flow pages in one editor-controlled document:

```tsx
const templateConfig = {
  pages: {
    cover: { label: 'Cover', component: CoverPage },
    features: { label: 'Features', component: FeaturesFlowPage, hasFlow: true },
    contact: { label: 'Contact', component: ContactPage },
  },
  initial: ['cover', 'features', 'contact'],
};
```

The `features` page can expand into several render pages, while `cover` and `contact` remain one authored page each.

### Conditional Page Lists

Use a `pageComponentKeys` function when page order depends on payload:

```tsx
const templateConfig = {
  pages: {
    cover: { label: 'Cover', component: CoverPage },
    appendix: { label: 'Appendix', component: AppendixPage },
  },
  groups: {
    document: {
      label: 'Document',
      pageComponentKeys: ({ payload }) => (
        payload.showAppendix ? ['cover', 'appendix'] : ['cover']
      ),
    },
  },
};
```

## Common Gotchas

### Flow Content Does Not Split

Flow moves whole items. If a markdown paragraph, table, image, or Notion block is taller than the available page area, split it into smaller flow items.

### Flow Page Does Not Expand

Make sure the page config has `hasFlow: true` and the page is rendered through `EditorShell.PageEditor`. A `Static.Flow` rendered outside PageEditor will render its first item set but cannot create measured continuation pages.

### No Page Margins

Static templates do not use `@page` margin boxes. Put margins and headers/footers in React layout with padding, `Static.FlowPage`, or page components.

### Images Overflow

Give images stable dimensions before measurement. For bleed images, use `ImageBlock` and configure the bleed/crop behavior explicitly.

### Components Do Not Resolve

Do not exclude `uhuu-components` from Vite dependency optimization:

```js
// vite.config.mjs - do not add this
optimizeDeps: {
  exclude: ['uhuu-components']
}
```

## Legacy Note

The old `Dynamic` / Paged.js API was removed from current `uhuu-components`. Older projects can be referenced in `/Users/guvenergokce/gdev/uhuu/uhuu-templates/uhuu-storybook-pagedjs`, but new and migrated templates should use `Static`, `Static.Flow`, and `EditorShell.PageEditor`.

## Page Size Reference

| Format | Width x Height (mm) | Common Use |
|--------|---------------------|------------|
| A4 | 210 x 297 | Standard documents |
| A3 | 297 x 420 | Posters, large docs |
| A5 | 148 x 210 | Booklets, flyers |
| LETTER | 216 x 279 | US standard |
| LEGAL | 216 x 356 | US legal docs |
| TABLOID | 279 x 432 | Newsletters |

Bleed guidelines:

- `0mm`: digital-only documents.
- `3mm`: standard print bleed.
- `5mm`: large-format print bleed.
