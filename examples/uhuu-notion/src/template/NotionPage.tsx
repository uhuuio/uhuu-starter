import { useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Render } from "@9gustin/react-notion-render";
import { Static } from "uhuu-components";
import { getNotionPageTitle, getNotionBlocksForRender } from "../utility/notionBlocks";

import "@9gustin/react-notion-render/dist/index.css";

/**
 * NotionPage Template
 *
 * Payload structure (from Notion integration):
 * {
 *   "notion": { "page": {...}, "blocks": [...] }
 * }
 *
 * Flow pipeline: Notion blocks -> HTML (react-notion-render, serialized once
 * with renderToStaticMarkup) -> Static.FlowDocument. The custom HTML parser
 * keeps the old react-notion-render DOM/CSS shape while exposing child blocks
 * as flow tokens for pagination.
 */
function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hasRenderableContent(element: Element) {
  const text = (element.textContent ?? "").replace(/\u00a0/g, "").trim();
  return text.length > 0 || !!element.querySelector("hr,img,input,table,iframe,video");
}

function getFlowTokenType(element: Element) {
  const heading = element.matches("h1,h2,h3,h4,h5,h6")
    ? element
    : element.querySelector("h1,h2,h3,h4,h5,h6");
  return (heading ?? element).tagName.toLowerCase();
}

function toFlowToken(element: Element) {
  return {
    type: getFlowTokenType(element),
    html: element.outerHTML,
    text: element.textContent ?? "",
    breakBefore: element.hasAttribute("data-flow-break-before"),
    breakAfter: element.hasAttribute("data-flow-break-after"),
  };
}

function parseNotionHtmlToFlowTokens(html: string) {
  if (typeof document === "undefined") return [];

  const template = document.createElement("template");
  template.innerHTML = html;
  const tokens: ReturnType<typeof toFlowToken>[] = [];

  template.content.childNodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as Element;
    if (element.classList.contains("rnr-container")) {
      const children = Array.from(element.childNodes).filter(
        (childNode): childNode is Element =>
          childNode.nodeType === Node.ELEMENT_NODE &&
          hasRenderableContent(childNode as Element)
      );

      children.forEach((child, index) => {
        const container = element.cloneNode(false) as Element;
        container.classList.add("rnr-flow-fragment");
        if (index === 0) container.classList.add("rnr-flow-fragment-first");
        if (index === children.length - 1) container.classList.add("rnr-flow-fragment-last");
        container.appendChild(child.cloneNode(true));
        tokens.push({
          ...toFlowToken(child),
          html: container.outerHTML,
        });
      });
      return;
    }

    if (hasRenderableContent(element)) {
      tokens.push(toFlowToken(element));
    }
  });

  return tokens;
}

export function NotionPage({
  payload,
  pageNum,
}: {
  payload: Record<string, unknown>;
  pageNum?: number;
}) {
  const html = useMemo(() => {
    const pageTitle = getNotionPageTitle(payload as { notion?: unknown });
    const blocks = getNotionBlocksForRender(payload as { notion?: unknown });
    const logo =
      '<div class="notion-document-logo"><img src="https://platform.uhuu.io/common/brand/logos/uhuu_logo.svg" alt="Uhuu" /></div>';
    const title = pageTitle
      ? `<h1 class="notion-page-title">${escapeHtml(pageTitle)}</h1>`
      : "";
    const body = renderToStaticMarkup(<Render blocks={blocks} useStyles classNames />);
    return `${logo}${title}${body}`;
  }, [payload]);

  return (
    <Static.FlowDocument
      html={html}
      className="bg-white bg-center px-[12mm] pt-[12mm] pb-[5mm] text-sm markdown-body"
      flowAreaClassName="mt-[5mm]"
      flowClassName="rnr-notion-content markdown-body max-w-3xl mx-auto"
      parseHtml={parseNotionHtmlToFlowTokens}
      footer={
        <footer className="flex justify-between text-[10px] text-gray-500">
          <span>Uhuu.io</span>
          <span>{pageNum}</span>
        </footer>
      }
    />
  );
}
