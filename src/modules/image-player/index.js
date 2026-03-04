/**
 * ImagePlayerElement - A web component for cycling through child elements like an animation
 *
 * Attributes:
 * - controls: Show play/pause button in center when paused (default: false)
 * - autoplay: Auto-advance frames. Click anywhere to pause/play (default: false)
 * - duration: Time per frame in milliseconds (default: 1000)
 *
 * Child element attributes:
 * - duration: Override the global duration for that specific frame
 */
class ImagePlayerElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.autoplayTimeout = null;
    this.isPlaying = false;
    this.currentIndex = 0;

    this.shadowRoot.innerHTML = /* HTML */ `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
        }
        button {
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          padding: 10px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
        }
        #playPause {
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }
        /* Hide play/pause button when playing (only visible when paused) */
        #playPause.playing {
          display: none;
        }
        button:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        button:before {
          content: "";
          display: inline-block;
          width: 0;
          height: 0;
          border-style: solid;
        }
        /* Play button (triangle) shown when paused */
        #playPause.paused:before {
          border-width: 12px 0 12px 20px;
          border-color: transparent transparent transparent white;
          margin-left: 4px;
        }
        button.hidden {
          display: none;
        }
      </style>
      <slot></slot>
      <button id="playPause" class="hidden paused"></button>
    `;

    // Get DOM elements
    const playPause = this.shadowRoot.getElementById("playPause");
    const slot = this.shadowRoot.querySelector("slot");

    // Get attributes
    const hasControls = this.hasAttribute("controls");
    const hasAutoplay = this.hasAttribute("autoplay");
    const duration = parseInt(this.getAttribute("duration") || "1000", 10);

    /** Get all assigned frame elements */
    const getFrames = () => slot.assignedElements();

    /** Get the duration for a specific frame (per-child override supported) */
    const getFrameDuration = (frame) => {
      const frameDuration = frame && frame.getAttribute("duration");
      return frameDuration ? parseInt(frameDuration, 10) : duration;
    };

    /** Show only the frame at the given index, hide all others */
    const showFrame = (index) => {
      const frames = getFrames();
      frames.forEach((frame, i) => {
        frame.style.display = i === index ? "" : "none";
      });
      this.currentIndex = index;
    };

    /** Schedule the next frame advance using the current frame's duration */
    const scheduleNext = () => {
      const frames = getFrames();
      const currentFrame = frames[this.currentIndex];
      const frameDuration = getFrameDuration(currentFrame);

      this.autoplayTimeout = setTimeout(() => {
        if (!this.isPlaying) return;
        goToNext();
        scheduleNext();
      }, frameDuration);
    };

    /** Start autoplay */
    const startAutoplay = () => {
      if (this.isPlaying) return;

      this.isPlaying = true;
      playPause.classList.remove("paused");
      playPause.classList.add("playing");

      scheduleNext();
    };

    /** Stop autoplay and show play button */
    const stopAutoplay = () => {
      if (this.autoplayTimeout) {
        clearTimeout(this.autoplayTimeout);
        this.autoplayTimeout = null;
      }
      this.isPlaying = false;
      playPause.classList.remove("playing");
      playPause.classList.add("paused");
    };

    /** Toggle between play and pause states */
    const togglePlayPause = () => {
      if (this.isPlaying) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    };

    /** Navigate to the next frame */
    const goToNext = () => {
      const frames = getFrames();
      const nextIndex = (this.currentIndex + 1) % frames.length;
      showFrame(nextIndex);
    };

    // Initialize frames once slot content is available
    slot.addEventListener("slotchange", () => {
      const frames = getFrames();
      if (frames.length > 0) {
        showFrame(this.currentIndex < frames.length ? this.currentIndex : 0);
      }
    });

    // Play/pause button click
    playPause.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlayPause();
    });

    // Click anywhere on the component to pause/play when autoplay is enabled
    if (hasAutoplay) {
      this.addEventListener("click", () => {
        togglePlayPause();
      });
    }

    // Initialize: show play/pause button if controls are present
    if (hasControls) {
      playPause.classList.remove("hidden");
    }

    // Initialize: start autoplay if attribute is present
    if (hasAutoplay) {
      startAutoplay();
    }
  }

  disconnectedCallback() {
    // Clean up timeout when element is removed
    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
    }
  }
}

customElements.define("image-player", ImagePlayerElement);
