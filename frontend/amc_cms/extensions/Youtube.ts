import { Node, mergeAttributes } from "@tiptap/core";

export const Youtube = Node.create({
  name: "youtube",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: 560 },
      height: { default: 315 },
    };
  },

  parseHTML() {
    return [{ tag: "iframe[src*='youtube.com']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(HTMLAttributes, {
        allowfullscreen: "true",
        frameborder: "0",
        class: "my-4 w-full aspect-video rounded",
      }),
    ];
  },

  addNodeView() {
    return ({ HTMLAttributes }) => {
      const iframe = document.createElement("iframe");
      Object.entries(HTMLAttributes).forEach(([key, val]) => {
        iframe.setAttribute(key, String(val));
      });
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("frameborder", "0");
      iframe.className = "my-4 w-full aspect-video rounded";

      return {
        dom: iframe,
      };
    };
  },
});
