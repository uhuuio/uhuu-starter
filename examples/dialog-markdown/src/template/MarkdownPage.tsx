import { useMemo } from "react";
import { marked } from "marked";
import { Editable, Static } from 'uhuu-components';
import { HeaderSchema } from './../../test/header_schema';

/**
 * MarkdownPage Template
 *
 * Payload Structure:
 * {
 *   "body": string,            // REQUIRED: Markdown content. Converted to HTML and paginated by Static.FlowDocument.
 *   "header": string[]         // OPTIONAL: header lines shown top-right. Hidden when empty.
 * }
 *
 * Flow pipeline: Markdown -> HTML (marked) -> Static.FlowDocument. FlowDocument
 * splits the HTML into block items, applies break metadata, and creates
 * render-only continuation pages. A `<!-- page-break-before -->` comment in the
 * Markdown survives the HTML conversion and forces a page break.
 */
export function MarkdownPage({ payload, pageNum, totalPages }) {
  const header = payload.header || [];
  const html = useMemo(
    () => marked.parse(payload.body || '', { async: false }) as string,
    [payload.body]
  );

  return (
    <Static.FlowDocument
      html={html}
      className="bg-white bg-center px-[10mm] py-[10mm] text-sm markdown-body"
      flowAreaClassName="mt-[5mm]"
      editable={{ path: 'body', type: 'markdown' }}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="https://platform.uhuu.io/common/brand/logos/uhuu_logo.svg" className="h-14" />
          </div>
          <Editable dialog={{ path: 'header', type: 'schemaform', schema: HeaderSchema }}>
            {header.length > 0 ? (
              <div className="block text-right text-xs leading-5">
                {header.map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < header.length - 1 && <br/>}
                  </span>
                ))}
              </div>
            ) : (
              <div className="block text-right text-xs leading-5 text-gray-400 italic">
                Click to add header
              </div>
            )}
          </Editable>
        </div>
      }
      footer={
        <footer className="mt-5 flex justify-between border-t border-gray-200 pt-3 text-[10px] text-gray-500">
          <span>Uhuu.io</span>
          <span>{pageNum} / {totalPages}</span>
        </footer>
      }
    />
  );
}
