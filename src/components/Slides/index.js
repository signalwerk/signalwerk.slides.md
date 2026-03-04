import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import fm from "front-matter";
import Slide from "../Slide/index.js";
import { replaceVars } from "./replaceVars.js";
import { get } from "lodash";
import useHash from "../../hooks/useHash.js";
import { useCommandPalette } from "../CommandPalette/index.js";

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
  const total = slides.length;

  // Keep a ref to count so registered commands always use the latest value
  const countRef = useRef(count);
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  // Keep totalRef in sync so global APIs always return the current total
  const totalRef = useRef(total);
  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  // Keep a ref to select for synchronous reads in slidesApp.getState()
  const selectRef = useRef(select);
  useEffect(() => {
    selectRef.current = select;
  }, [select]);

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

  const { registerCommand } = useCommandPalette();

  // Expose a global API so vanilla modules can read state and send navigation
  useEffect(() => {
    window.slidesApp = {
      getState: () => ({
        current: selectRef.current,
        total: totalRef.current,
      }),
    };
    return () => {
      window.slidesApp = null;
    };
  }, []);

  // Dispatch 'slides:change' CustomEvent so modules can track slide changes
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("slides:change", {
        detail: { current: select, total: totalRef.current },
      }),
    );
  }, [select]);

  // Listen to 'slides:navigate' CustomEvent dispatched by modules
  useEffect(() => {
    function onNavigate(e) {
      const { direction, index } = e.detail;
      if (direction === "next") {
        channel.postMessage({ type: "navigation", direction: "next" });
        setSelect((s) => clamp(s + 1, 0, countRef.current));
      } else if (direction === "prev") {
        channel.postMessage({ type: "navigation", direction: "previous" });
        setSelect((s) => clamp(s - 1, 0, countRef.current));
      } else if (direction === "to" && typeof index === "number") {
        setSelect(clamp(index, 0, countRef.current));
      }
    }
    window.addEventListener("slides:navigate", onNavigate);
    return () => window.removeEventListener("slides:navigate", onNavigate);
  }, [channel]);

  useEffect(() => {
    return registerCommand({
      label: "Toggle Presenter View",
      shortcut: "p",
      action: () => setIsPresenterWindow((val) => !val),
    });
  }, [registerCommand]);

  useEffect(() => {
    return registerCommand({
      label: "Next Slide",
      shortcut: ["ArrowRight", "PageDown"],
      action: () => {
        channel.postMessage({ type: "navigation", direction: "next" });
        setSelect((parsed) => clamp(parsed + 1, 0, countRef.current));
      },
    });
  }, [registerCommand]);

  useEffect(() => {
    return registerCommand({
      label: "Previous Slide",
      shortcut: ["ArrowLeft", "PageUp"],
      action: () => {
        channel.postMessage({ type: "navigation", direction: "previous" });
        setSelect((parsed) => clamp(parsed - 1, 0, countRef.current));
      },
    });
  }, [registerCommand]);

  const current = clamp(select, 0, count);

  // have to do this because archive.org should have a different handling
  const isArchiveOrg = navigator.userAgent.includes("archive.org_bot");

  // are we in print mode?
  const isPrint = new URLSearchParams(window.location.search).has("print");

  return (
    <div
      className={`Slides ${
        isPresenterWindow ? "Slides--isPresenterWindow" : ""
      }`}
    >
      {isArchiveOrg || isPrint ? (
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
