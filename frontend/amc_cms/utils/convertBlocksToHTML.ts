export function convertBlocksToHTML(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
        case "paragraph":
          return `<p>${block.data.text}</p>`;
        case "quote":
          return `<blockquote>${block.data.text}</blockquote>`;
        case "list":
          const tag = block.data.style === "ordered" ? "ol" : "ul";
          return `<${tag}>${block.data.items
            .map((item: string) => `<li>${item}</li>`)
            .join("")}</${tag}>`;
        case "image":
          return `<img src="${block.data.file.url}" alt="${block.data.caption || ""}" />`;
        default:
          return "";
      }
    })
    .join("\n");
}
