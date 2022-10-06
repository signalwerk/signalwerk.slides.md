import { visit } from "unist-util-visit";

function transformer(ast) {
  visit(ast, "image", visitor);

  function visitor(node, index, parent) {
    let hasCaption = false;

    const data = node.data || (node.data = {});
    const props = data.hProperties || (data.hProperties = {});
    let src = node.url;
    const alt = node.alt;
    let caption;

    if (parent.children.length >= index + 2) {
      const nextNode = parent.children[index + 1];
      const captionNode = parent.children[index + 2];

      if (
        nextNode.type === "text" &&
        nextNode.value === "\n" &&
        captionNode.type === "textDirective" &&
        captionNode.name === "caption"
      ) {
        hasCaption = true;
        // console.log({ nextNode, captionNode });

        // thats not good...
        caption = captionNode.children[0]?.value;

        captionNode.type = "noop";
        captionNode.children = [];
        // console.log({ captionNode });
        // Object.assign(captionNode, null);
      }
    }

    // const skipSrcSet = [".gif", ".svg"].some((ext) => src.includes(ext));

    // if (!skipSrcSet) {
    //   src = `srcset="${src}?nf_resize=fit&w=500 500w, ${src}?nf_resize=fit&w=800 800w"
    //       sizes="100vw"
    //       src="${src}?nf_resize=fit&w=1000"
    //     `;
    // }

    let newNode = null;
    if (hasCaption) {
      newNode = {
        type: "html",
        value: `<figure>
            <img src=${src} alt="${alt}" />
            <figcaption>${caption}</figcaption>
          </figure>`,
      };
      Object.assign(node, newNode);

      // } else {
      //   newNode = {
      //     type: "html",
      //     value: `<img src=${src} alt="${alt}" />`,
      //   };
    }
  }
}

function images() {
  return transformer;
}

export default images;
