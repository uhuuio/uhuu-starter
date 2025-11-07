import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Editable } from 'uhuu-components'; 

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
        {header.length > 0 && (
          <div className="block text-right text-xs leading-5">
            {header.map((line, index) => (
              <span key={index}>
                {line}
                {index < header.length - 1 && <br/>}
              </span>
            ))}
          </div>
        )}
      </div>

        <Editable dialog={{ path: 'body', type: 'markdown' }}>            
          <WrapInColumns>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              children={payload.body}
            />
          </WrapInColumns>
        </Editable>
    </div>
  );
}