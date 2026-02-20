import React from "react";
import { Render } from "@9gustin/react-notion-render";
import { Editable } from "uhuu-components";
import { HeaderSchema } from "../../test/header_schema";
import { getNotionPageTitle, getNotionBlocksForRender } from "../utility/notionBlocks";

import "@9gustin/react-notion-render/dist/index.css";

/**
 * NotionPage Template
 *
 * Payload structure (from Notion integration):
 * {
 *   "notion": {
 *     "page": { "object": "page", "id", "properties": { "title": { "title": [...] } }, ... },
 *     "blocks": [ { "object": "block", "id", "type", [type]: { "rich_text"|"text", ... }, "children"?: [...] }, ... ]
 *   },
 *   "header"?: string[]   // optional header lines (same as dialog-markdown)
 * }
 */
export function NotionPage({ payload }: { payload: Record<string, unknown> }) {
  const pageTitle = getNotionPageTitle(payload as { notion?: unknown });
  const blocks = getNotionBlocksForRender(payload as { notion?: unknown });
  const header = (payload.header as string[]) || [];

  return (
    <div className="min-h-screen bg-white bg-center text-sm markdown-body">
    
      <div className="flex items-center justify-between mb-4">
        <div className="flex">    
          <img src="https://platform.uhuu.io/common/brand/logos/uhuu_logo.svg" className="h-6" />  
        </div>
      </div>


      <div className="rnr-notion-content markdown-body  max-w-3xl mx-auto">
        {pageTitle && (
          <h1 className="notion-page-title">{pageTitle}</h1>
        )}
        <Render blocks={blocks} useStyles classNames />
      </div>
    </div>
  );
}
