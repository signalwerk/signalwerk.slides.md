import { processMD } from "./processor.js";
import useAsync from "../../hooks/useAsync.js";

import "./styles.css";

function Component({ data, hidden }) {
  const { value, loading, error } = useAsync(async () => {
    const md = data.slide.raw;

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
      className={`slide slide--style-${data.slide.style || "default"} ${
        data.slide.class || ""
      } slide--${hidden ? "hidden" : "visible"}`}
    >
      {data.slide.background && (
        <div className="slides__background">
          <div
            className="slides__background-inner"
            style={{
              backgroundColor: data.slide.background.color,
              backgroundImage: `url(${data.slide.background.image})`,
              backgroundPosition: `${data.slide.background.position}`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
      )}
      <div className="slides__stage">
        <div className="slides__stage-inner">
          <div
            className="slides__content"
            dangerouslySetInnerHTML={{ __html: value }}
          />

          {/* <pre>{("obj", JSON.stringify(data, null, 2))}</pre> */}
        </div>
      </div>
    </div>
  );
}

export default Component;
