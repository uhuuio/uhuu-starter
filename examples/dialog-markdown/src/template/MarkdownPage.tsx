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
 * Markdown survives the HTML conversion and forces a page break. The logo and
 * header text are rendered as the first flow item so they only appear on page 1.
 */
function sanitizeHtml(html: string) {
  return String(html ?? "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<\/?(script|style)\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/\s(href|src|xlink:href)\s*=\s*"javascript:[^"]*"/gi, "")
    .replace(/\s(href|src|xlink:href)\s*=\s*'javascript:[^']*'/gi, "");
}

export function MarkdownPage({ payload, pageNum, totalPages }) {
  const header = payload.header || [];
  const html = useMemo(
    () => {
      const topbar = '<div data-dialog-markdown-topbar="true"></div>';
      const body = marked.parse(payload.body || '', { async: false }) as string;
      return `${topbar}${body}`;
    },
    [payload.body]
  );

  return (
    <Static.FlowDocument
      html={html}
      className="bg-white bg-center px-[10mm] py-[10mm] text-sm markdown-body"
      flowAreaClassName="mt-[5mm]"
      renderItem={(item) => {
        if (item.html?.includes('data-dialog-markdown-topbar')) {
          return (
            <div className="dialog-markdown-document-topbar">
              <div className="dialog-markdown-document-logo">
                <img src="https://platform.uhuu.io/common/brand/logos/uhuu_logo.svg" alt="Uhuu" />
              </div>
              <Editable dialog={{ path: 'header', type: 'schemaform', schema: HeaderSchema }}>
                {header.length > 0 ? (
                  <div className="dialog-markdown-document-header">
                    {header.map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < header.length - 1 && <br/>}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="dialog-markdown-document-header dialog-markdown-document-header--empty">
                    Click to add header
                  </div>
                )}
              </Editable>
            </div>
          );
        }

        return (
          <Editable dialog={{ path: 'body', type: 'markdown' }}>
            <div
              className="uhuu-flow-html-block"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.html) }}
            />
          </Editable>
        );
      }}
      footer={
        <footer className="mt-5 flex justify-between border-t border-gray-200 pt-3 text-[10px] text-gray-500">
          <span>Uhuu.io</span>
          <span>{pageNum} / {totalPages}</span>
        </footer>
      }
    />
  );
}
