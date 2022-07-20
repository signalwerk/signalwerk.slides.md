// index.js

import React from "react";
import { createRoot } from "react-dom/client";
import useFetch from "./hooks/useFetch.js";
import Slides from "./components/Slides/index.js";



function App({ url }) {
  const { response, loading, error } = useFetch(url);
  if (error) return <p>There is an error.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="App">
      <Slides md={response}></Slides>
    </div>
  );
}

class StandaloneComponent extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("div");
    // this.attachShadow({ mode: "open" }).appendChild(mountPoint);
    this.append(mountPoint)

    const href = this.getAttribute("href");
    const root = createRoot(mountPoint);
    root.render(<App url={href} />);
  }
}

window.customElements.define("signalwerk-slides", StandaloneComponent);
