import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Editable } from 'uhuu-components';
import { HeaderSchema } from './../../test/header_schema';
import { Twemoji } from './twemoji'; 

/**
 * MarkdownPage Template
 * 
 * Payload Structure:
 * {
 *   "view": string,           // Layout option: "columns-2" for two-column layout, any other value (or omitted) for single column
 *   "body": string,           // REQUIRED: Markdown content to render. Supports full markdown syntax including headers, lists, tables, etc.
 *   "header": string[]         // OPTIONAL: Array of header lines displayed in the top-right corner. Each string is rendered as a separate line.
 *                              //           If omitted or empty array, the header section is hidden.
 *                              //           Example: ["Last Revised: Nov 4, 2025", "Version: 1.0"]
 * }
 */
export function MarkdownPage({ payload }) {

  const WrapInColumns = ({ children }) => {
    if (payload.view === "columns-2") {
      return (
        <div className="columns-2 w-full gap-8" style={{ columnFill: "auto" }}>
          {children}
        </div>
      );
    }
    return <div className="w-full">{children}</div>;
  };

  const header = payload.header || [];

  return (
    <div className="bg-center text-sm markdown-body">
      <div className="flex items-center justify-between">
        <div className="flex py-6 items-center ">    
          <img src="https://platform.uhuu.io/common/brand/logos/uhuu_logo.svg" className="h-14" />  
        </div>
        <Editable dialog={{ path: 'header', type: 'schemaform', schema: HeaderSchema }}>
          {header.length > 0 ? (
            <div className="block text-right text-xs leading-5">
              {header.map((line, index) => (
                <span key={index}>
                  <Twemoji>{line}</Twemoji>
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

        <Editable dialog={{ path: 'body', type: 'markdown' }}>            
          <WrapInColumns>
            <Twemoji>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                children={payload.body}
              />
            </Twemoji>
          </WrapInColumns>
        </Editable>
    </div>
  );
}