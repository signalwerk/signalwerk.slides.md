import { useState, useEffect, useCallback } from "react";
import fm from "front-matter";
import { processMD } from "./gfm.js";
import useAsync from "../../hooks/useAsync.js";


// import "./styles.css";

function attrAdder(html) {
  // https://stackoverflow.com/questions/1058933/can-i-define-a-class-name-on-paragraph-using-markdown
  return `${html}`.replace(
    /^(.+)(\{(?:([ ]?[#.][-_:a-zA-Z0-9 ]+)+)[ ]?\}[ ]*$)+/gm,
    (match, ...p) => {
      const className = p[2].replaceAll(".", "").trim();
      const newHTML = `<div class="${className}">\n\n${p[0]}\n\n</div>`;

      return newHTML;
    }
  );
}

function Component({ data }) {
  //   const { value, loading, error } = useAsync(processMD, [data.slide.raw]);
  //   const state = useAsync(() => fetch(url).text(), [url])

  const { value, loading, error } = useAsync(async () => {
    let md = attrAdder(data.slide.raw);
    // const md = data.slide.raw

    let result = await processMD(md);
    return result;
  }, [data?.slide?.raw]);

  if (loading) return null;
  if (error) {
    console.log(error);
    return (
      <div>
        <p>There is an error in slide ##.</p>{" "}
        <pre>{("obj", JSON.stringify(data, null, 2))}</pre>
      </div>
    );
  }

  return (
    <div
      className={`slide slide--style-${data.slide.style || "default"} slide--${
        data.slide.class || "default"
      }`}
    >
      {data.slide.background && (
        <div className="slide__background">
          <div
            className="slide__background-inner"
            style={{
              backgroundColor: data.slide.background.color,
              backgroundImage: `url(${data.slide.background.image})`,
              backgroundPosition: `${data.slide.background.position}`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
      )}
      <div className="slide__stage">
        <div className="slide__stage-inner">
          <div
            className="slide__content"
            dangerouslySetInnerHTML={{ __html: value }}
          />

          {/* <pre>{("obj", JSON.stringify(data, null, 2))}</pre> */}
        </div>
      </div>
    </div>
  );
}

export default Component;
