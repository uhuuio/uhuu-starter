/**
 * Utilities to normalize Notion API payload for @9gustin/react-notion-render.
 * Notion returns blocks with nested `children`; the library expects a flat list.
 * See ref: https://github.com/9gustin/react-notion-render
 */

export type NotionBlock = {
  object?: string;
  id: string;
  type: string;
  has_children?: boolean;
  children?: NotionBlock[];
  [key: string]: unknown;
};

export type NotionPage = {
  object?: string;
  id?: string;
  properties?: {
    title?: {
      id?: string;
      type?: string;
      title?: Array<{ plain_text?: string; type?: string; text?: { content?: string }; [key: string]: unknown }>;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type NotionPayload = {
  page?: NotionPage;
  blocks?: NotionBlock[];
};

/**
 * Flatten blocks in document order (DFS). Each block is returned without
 * top-level `children` so the list is flat for react-notion-render.
 */
export function flattenNotionBlocks(blocks: NotionBlock[]): NotionBlock[] {
  if (!blocks?.length) return [];

  return blocks.flatMap((block) => {
    const { children, ...rest } = block;
    const typeContent = block[block.type];
    const typeObj =
      typeContent && typeof typeContent === "object"
        ? (() => {
            const { children: _c, ...typeRest } = typeContent as Record<string, unknown>;
            return typeRest;
          })()
        : typeContent;
    const flatBlock: NotionBlock = {
      ...rest,
      [block.type]: typeObj,
    };
    const childBlocks = children?.length ? flattenNotionBlocks(children) : [];
    return [flatBlock, ...childBlocks];
  });
}

/**
 * Build a synthetic "title" block from the Notion page properties
 * so the page title is rendered as the first block.
 */
export function pageTitleToBlock(page: NotionPage): NotionBlock | null {
  const titleProp = page?.properties?.title;
  const titleArray = titleProp?.title;
  if (!titleArray?.length) return null;

  const textItems = titleArray.map((t) => ({
    type: "text",
    text: { content: t.plain_text ?? t.text?.content ?? "", link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
    plain_text: t.plain_text ?? t.text?.content ?? "",
    href: null,
  }));

  return {
    id: "page-title",
    type: "title",
    object: "block",
    has_children: false,
    title: textItems,
  } as NotionBlock;
}

/**
 * Extract page title text from payload.notion.page (for rendering as a proper h1).
 */
export function getNotionPageTitle(payload: { notion?: NotionPayload } | null): string | null {
  const titleArray = payload?.notion?.page?.properties?.title?.title;
  if (!titleArray?.length) return null;
  return titleArray
    .map((t) => (t.plain_text ?? (t as { text?: { content?: string } }).text?.content ?? ""))
    .join("")
    .trim() || null;
}

/**
 * Normalize payload.notion into a flat block list for Render (content blocks only; no synthetic title).
 */
export function getNotionBlocksForRender(payload: { notion?: NotionPayload } | null): NotionBlock[] {
  const notion = payload?.notion;
  if (!notion) return [];
  return flattenNotionBlocks(notion.blocks ?? []);
}
