export function convertHTMLToBlocks(htmlContent: string) {
  try {
    if (!htmlContent) return { blocks: [] };

    if (typeof window === "undefined") {
      console.warn("SSR 環境では HTML を変換できません");
      return { blocks: [] };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const blocks: any[] = [];

    doc.body.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        const text = node.textContent?.trim();
        if (text) {
          blocks.push({ type: "paragraph", data: { text } });
        }
      } else if (node.nodeType === 1) {
        const tagName = (node as HTMLElement).tagName.toLowerCase();
        const text = (node as HTMLElement).textContent?.trim() || "";

        if (tagName === "h1") {
          blocks.push({ type: "header", data: { text, level: 1 } });
        } else if (tagName === "h2") {
          blocks.push({ type: "header", data: { text, level: 2 } });
        } else if (tagName === "h3") {
          blocks.push({ type: "header", data: { text, level: 3 } });
        } else if (tagName === "p") {
          blocks.push({ type: "paragraph", data: { text } });
        } else if (tagName === "blockquote") {
          blocks.push({ type: "quote", data: { text } });
        } else if (tagName === "figure") {
          const img = (node as HTMLElement).querySelector("img");
          if (img) {
            const src = img.getAttribute("src");
            const alt = img.getAttribute("alt") || "";

            if (src) {
              blocks.push({
                type: "image",
                data: {
                  file: { url: src },
                  caption: alt,
                },
              });
            }
          }
        } else if (tagName === "img") {
          const src = (node as HTMLElement).getAttribute("src");
          const alt = (node as HTMLElement).getAttribute("alt") || "";

          if (src) {
            blocks.push({
              type: "image",
              data: {
                file: { url: src },
                caption: alt,
              },
            });
          }
        }
      }
    });

    // **空のブロックを除外**
    const filteredBlocks = blocks.filter((block) => {
      if (
        block.type === "paragraph" ||
        block.type === "header" ||
        block.type === "quote"
      ) {
        return block.data.text?.trim() !== "";
      }
      return true;
    });

    console.log("変換された Editor.js の blocks:", filteredBlocks);
    return { blocks: filteredBlocks };
  } catch (error) {
    console.error("HTML 変換エラー:", error);
    return { blocks: [] };
  }
}
