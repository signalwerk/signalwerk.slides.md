import { get } from "lodash";
import { printYYYYMMDD } from "./date.js";
import fm from "front-matter";

export function replaceVars(str) {
  let result = str;

  result = result
    .replace(/\{\{me\}\}/g, "Stefan Huber")
    .replace(/\{\{date process\.file\.mtime\}\}/g, () =>
      printYYYYMMDD(new Date())
    );

  try {
    const frontmatter = fm(result);
    const fmHeader = get(frontmatter, "attributes.title");

    if (fmHeader) {
      result = result.replace(
        /\{\{process\.content\.frontmatter\.title\}\}/g,
        fmHeader
      );
    }
  } catch (e) {
    console.log(e);
  }

  return result;
}
