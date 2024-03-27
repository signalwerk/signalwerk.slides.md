import { useState, useEffect, useCallback, useMemo } from "react";
import fm from "front-matter";
import Slide from "../Slide/index.js";
import { replaceVars } from "./replaceVars.js";
import { get } from "lodash";
import useHash from "../../hooks/useHash.js";
import useKeypress from "../../hooks/useKeyPress.js";

function extractFrontMatter(str) {
  let attributes = {};
  let body = str;

  try {
    const md = str.replace(/```fm([^`]*)```/g, "---$1---");
    // console.log({ md });
    const frontmatter = fm(md);

    attributes = get(frontmatter, "attributes");
    body = get(frontmatter, "body");
  } catch (e) {
    console.log(e);
  }

  return { attributes, body };
}

function slide2html(str) {
  const { attributes, body } = extractFrontMatter(str);
  return { attributes, body };
}

function md2slides(str) {
  const content = replaceVars((str || "").trim());

  const globalSlides = extractFrontMatter(content);

  const slides = globalSlides.body
    .trim()
    .split("--s--")
    .map((slide) => slide.trim())
    // .filter((slide) => slide)
    .map((slide, index) => {
      const finalSlide = slide2html(slide);

      return {
        id: `slide${index}`,
        index,
        // raw: slide,
        slide: {
          ...(globalSlides.attributes.slide || {}),
          ...finalSlide.attributes,
          // body: finalSlide.body,
          raw: finalSlide.body,
        },
        // global: { attributes },
      };
    });

  return slides;
}

function getIndexFromHash(hash) {
  return (
    parseInt(hash?.substring(1)?.match(/\/([^\/]+)\/?$/)?.[1] || 0, 10) || 0
  );
}
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function Component({ md }) {
  const [hash, setHash] = useHash();
  const [select, setSelect] = useState(getIndexFromHash(hash));
  const [isPresenterWindow, setIsPresenterWindow] = useState(false);

  const channel = useMemo(() => new BroadcastChannel("signalwerk·slides"), []);

  useEffect(() => {
    channel.addEventListener("message", (event) => {
      console.log("got message", event.data);
    });
  }, []);

  const slides = md2slides(md);
  const count = Math.max(0, slides.length - 1);

  useEffect(() => {
    const parsed = getIndexFromHash(hash);

    if (parsed !== select) {
      setHash(`#/${select}`);
    }
  }, [hash, select]);

  // post message when select changes
  useEffect(() => {
    channel.postMessage({
      type: "navigation",
      direction: "select",
      select,
    });
  }, [select]);

  useKeypress(["p"], () => {
    setIsPresenterWindow((val) => !val);
  });

  useKeypress(["ArrowRight", "PageDown"], () => {
    channel.postMessage({
      type: "navigation",
      direction: "next",
    });
    setSelect((parsed) => clamp(parsed + 1, 0, count));
  });

  useKeypress(["ArrowLeft", "PageUp"], () => {
    channel.postMessage({
      type: "navigation",
      direction: "previous",
    });
    setSelect((parsed) => clamp(parsed - 1, 0, count));
  });

  const current = clamp(select, 0, count);

  // have to do this because archive.org should have a different handling
  const isArchiveOrg = navigator.userAgent.includes("archive.org_bot");

  return (
    <div
      className={`Slides ${
        isPresenterWindow ? "Slides--isPresenterWindow" : ""
      }`}
    >
      {isArchiveOrg ? (
        slides.map((slide, index) => (
          <Slide key={slide.id} data={slide} hidden={index !== current} />
        ))
      ) : (
        <Slide data={slides[current]} />
      )}
    </div>
  );
}

export default Component;
