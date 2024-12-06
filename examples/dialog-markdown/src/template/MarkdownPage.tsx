import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Editable } from 'uhuu-components'; 

export function MarkdownPage({ payload }) {

  return (
    <div className="bg-center text-sm markdown">
        <h1 className="!pb-8">Kurzbaubeschrieb</h1>
        <Editable dialog={{ path: 'body', type: 'markdown' }}>            
          <div className="columns-2 w-full gap-8" style={{ columnFill : "auto" }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              children={payload.body}
            />
          </div>
        </Editable>
    </div>
  );
}