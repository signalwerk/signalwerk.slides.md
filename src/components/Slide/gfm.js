import {
  gfmAutolinkLiteralFromMarkdown,
  gfmAutolinkLiteralToMarkdown
} from "mdast-util-gfm-autolink-literal";
import {
  gfmStrikethroughFromMarkdown,
  gfmStrikethroughToMarkdown
} from "mdast-util-gfm-strikethrough";
import { gfmTableFromMarkdown, gfmTableToMarkdown } from "mdast-util-gfm-table";
import {
  gfmTaskListItemFromMarkdown,
  gfmTaskListItemToMarkdown
} from "mdast-util-gfm-task-list-item";
import { gfmAutolinkLiteral } from "micromark-extension-gfm-autolink-literal";
import { gfmStrikethrough } from "micromark-extension-gfm-strikethrough";
import { gfmTable } from "micromark-extension-gfm-table";
import { gfmTaskListItem } from "micromark-extension-gfm-task-list-item";
import { combineExtensions } from "micromark-util-combine-extensions";

// based on
// https://github.com/micromark/micromark-extension-gfm/blob/main/index.js
function gfm(options) {
  return combineExtensions([
      gfmAutolinkLiteral,
      //   gfmFootnote(),
      gfmStrikethrough(options),
      gfmTable,
      gfmTaskListItem,
  ]);
}
// based on
// https://github.com/syntax-tree/mdast-util-gfm/blob/main/index.js
function gfmFromMarkdown() {
  return [
      gfmAutolinkLiteralFromMarkdown,
      //   gfmFootnoteFromMarkdown(),
      gfmStrikethroughFromMarkdown,
      gfmTableFromMarkdown,
      gfmTaskListItemFromMarkdown,
  ];
}
function gfmToMarkdown(options) {
  return {
      extensions: [
          gfmAutolinkLiteralToMarkdown,
          // gfmFootnoteToMarkdown(),
          gfmStrikethroughToMarkdown,
          gfmTableToMarkdown(options),
          gfmTaskListItemToMarkdown,
      ],
  };
}
// based on
// https://github.com/remarkjs/remark-gfm/blob/main/index.js
export function remarkGfm(options = {}) {
  const data = this.data();

  add("micromarkExtensions", gfm(options));
  add("fromMarkdownExtensions", gfmFromMarkdown());
  add("toMarkdownExtensions", gfmToMarkdown(options));

  /**
   * @param {string} field
   * @param {unknown} value
   */
  function add(field, value) {
      const list = /** @type {unknown[]} */ (
          // Other extensions
          /* c8 ignore next 2 */
          data[field] ? data[field] : (data[field] = [])
      );

      list.push(value);
  }
}
