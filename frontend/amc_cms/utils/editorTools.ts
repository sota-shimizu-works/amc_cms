"use client";

import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import type { ToolConstructable, ToolSettings } from "@editorjs/editorjs";

export const EDITOR_JS_TOOLS: {
  [toolName: string]: ToolConstructable | ToolSettings;
} = {
  header: Header,
  list: List,
  paragraph: Paragraph,
  quote: Quote,
  embed: {
    class: Embed as ToolConstructable,
    config: {
      services: {
        youtube: true,
        vimeo: true,
      },
    },
  },
};
