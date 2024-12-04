import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'

export function MarkdownPage({ payload }) {

  return (
    <div className="bg-center text-sm markdown">
        <h1 className="!pb-8">Kurzbaubeschrieb</h1>
        <div className="columns-2 w-full gap-8" style={{ columnFill : "auto" }} data-uhuu={ JSON.stringify({path: 'body', type: 'markdown'})}>            
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            children={payload.body}
          />
        </div>
    </div>
  );
}