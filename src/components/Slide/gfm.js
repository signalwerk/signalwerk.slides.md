import { unified } from "unified";
import remarkParse from "remark-parse";
// import remarkFrontmatter from "remark-frontmatter";
// import remarkParseFrontmatter from "remark-parse-frontmatter";

// import footnote from "gatsby-remark-reference-footnotes";

// import { remarkGfm } from "./gfm";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const processor = unified()
  .use(remarkParse)
  //   .use(remarkFrontmatter)
  //   .use(remarkParseFrontmatter)
  .use(remarkGfm)
  //   .use(() => (tree) => {
  //     footnote({ markdownAST: tree });
  //     // console.dir(tree);
  //   })
//   .use(remarkRehype)
//   .use(rehypeStringify);


  .use(remarkRehype, {allowDangerousHtml: true}) // Pass raw HTML strings through.
  .use(rehypeStringify, {allowDangerousHtml: true}) // Serialize the raw HTML strings

export function processMD(md) {
  console.log("processing", md);
  return processor.process(md);

  //   return { /* data: file.data.frontmatter, */ html: String(file) };
}
