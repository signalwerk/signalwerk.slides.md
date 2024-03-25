// index.js

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./image-player.css";

function ImagePlayer({
  children,
  fps,
  className,
  autoplay,
  addPlayPauseButton,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % React.Children.count(children)
        );
      }, 1000 / fps);
    }
    return () => clearInterval(interval);
  }, [isPlaying, fps, children]);

  return (
    <div className={`image-player ${className}`}>
      {React.Children.map(children, (child, index) => {
        const displayStyle = index === currentIndex ? "block" : "none";
        const newStyle = child.props.style
          ? { ...child.props.style, display: displayStyle }
          : { display: displayStyle };
        return React.cloneElement(child, { style: newStyle });
      })}
      {addPlayPauseButton && (
        <button
          className="image-player__play-pause"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
}

class ImagePlayerComponent extends HTMLElement {
  connectedCallback() {
    // Step 1: Clone the original children before modifying their display property.
    const children = Array.from(this.children).map((child) => {
      const container = document.createElement("div");
      container.appendChild(child.cloneNode(true));
      return container.innerHTML;
    });

    // Step 2: Append the mount point for the React component.
    const mountPoint = document.createElement("div");
    this.appendChild(mountPoint);

    const fps = parseInt(this.getAttribute("fps") || "1", 10);
    const autoplay = this.hasAttribute("autoplay");
    const className = this.getAttribute("class");
    const addPlayPauseButton = this.hasAttribute("addPlayPauseButton");

    // Render the React component with the cloned children.
    const root = createRoot(mountPoint);
    root.render(
      <ImagePlayer
        fps={fps}
        autoplay={autoplay}
        className={className}
        addPlayPauseButton={addPlayPauseButton}
      >
        {children.map((html) =>
          React.createElement("div", {
            dangerouslySetInnerHTML: { __html: html },
          })
        )}
      </ImagePlayer>
    );

    // Step 3: Now hide the original children, excluding the React mount point.
    Array.from(this.children).forEach((child) => {
      if (child !== mountPoint) {
        child.style.display = "none";
      }
    });
  }
}

window.customElements.define("image-player", ImagePlayerComponent);
