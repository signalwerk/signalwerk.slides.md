import html, { safe } from "escape-html-template-tag";
import { visit } from "unist-util-visit";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import figure from "./figure.js";
import { h } from "hastscript";

import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import rehypeExternalLinks from "rehype-external-links";
import { remarkGfm } from "./gfm.js";

// This plugin is an example to let users write HTML with directives.
// It’s informative but rather useless.
// See below for others examples.
/** @type {import('unified').Plugin<[], import('mdast').Root>} */
function myRemarkPlugin() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes);

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(myRemarkPlugin)
  .use(figure)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeHighlight, { subset: false })

  // .use(rehypeSanitize, {
  //   ...defaultSchema,

  //   // allow style tags for special tag handling
  //   tagNames: [...defaultSchema.tagNames, "audio", "footer", "style", "iframe"],

  //   // allow classNames on code, div and span
  //   attributes: {
  //     ...defaultSchema.attributes,
  //     code: [...(defaultSchema.attributes.code || []), "className"],
  //     div: [...(defaultSchema.attributes.div || []), "className"],
  //     span: [...(defaultSchema.attributes.span || []), "className"],
  //     footer: [...(defaultSchema.attributes.footer || []), "className"],
  //     iframe: [
  //       ...(defaultSchema.attributes.iframe || []),
  //       "className",
  //       "src",
  //       "width",
  //       "height",
  //     ],
  //     audio: [
  //       ...(defaultSchema.attributes.audio || []),
  //       "className",
  //       "controls",
  //       "src",
  //     ],
  //   },
  // })

  .use(rehypeExternalLinks, { target: "_blank", rel: ["nofollow"] })
  .use(remarkGfm)
  .use(rehypeStringify);

export function processMD(md) {
  console.log("processing", md);
  return processor.process(md);

  //   return { /* data: file.data.frontmatter, */ html: String(file) };
}
