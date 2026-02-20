# Notion Beta

Renders a document from a Notion integration payload. Uses [@9gustin/react-notion-render](https://github.com/9gustin/react-notion-render) to parse and render Notion blocks.

## Payload shape

The payload is expected to have a `notion` attribute with the response from the Notion API:

- **`notion.page`** – Page metadata; `properties.title.title` is used as the document title.
- **`notion.blocks`** – Array of block objects. Blocks may have nested `children`; they are flattened in document order for the renderer.

See `test/sample_data.json` for an example (Notion page + blocks with callouts, paragraphs, lists, toggles, etc.).

## Run locally

```bash
# From repo root or examples/uhuu-notion
npm install
npm run dev
```

*Run with SSL:* `npm run dev:secure`  
*Build:* `npm run build`

## Reference

- [react-notion-render](https://github.com/9gustin/react-notion-render) – library used to render Notion blocks.
- Local copy: `ref/react-notion-render-main/` (for API and block format reference).


## Try direct-mail example from uhuu.io

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/github/uhuuio/uhuu-starter/tree/main/examples/uhuu-notion?view=preview&theme=dark&codemirror=1)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/uhuuio/uhuu-starter/tree/main/examples/uhuu-notion)