/**
 * CarouselElement - A web component for image carousels with autoplay, controls, and loop support
 *
 * Attributes:
 * - controls: Show prev/next navigation buttons (hidden when autoplay is active) (default: false)
 * - autoplay: Auto-advance slides. Click anywhere on carousel to pause/play. Shows play button in center when paused (if controls is also present) (default: false)
 * - loop: Loop back to the beginning after the last slide (default: false)
 * - duration: Control autoplay speed in milliseconds (default: 3000)
 * - transition: Control scroll behavior - "auto" (instant) or "smooth" (smooth scrolling) (default: "auto")
 */
class CarouselElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.autoplayInterval = null;
    this.isPlaying = false;

    this.shadowRoot.innerHTML = /* HTML */ `
      <style>
        :host {
          display: flex;
          align-items: center;
          position: relative;
          width: 100%;
        }
        #images {
          display: flex;
          overflow-x: scroll;
          width: 100%;
          scroll-snap-type: x mandatory;
        }
        #images.smooth {
          scroll-behavior: smooth;
        }
        #images.auto {
          scroll-behavior: auto;
        }
        ::slotted(img) {
          all: unset;
          width: 100% !important;
          height: auto !important;
          scroll-snap-align: start;
          flex-shrink: 0;
          object-fit: cover; /* Ensure images cover the container properly */
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
          width: 40px;
          height: 40px;
        }
        #prev {
          left: 0;
        }
        #next {
          right: 0;
        }
        #playPause {
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
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
        /* Left arrow for prev button */
        #prev:before {
          border-width: 10px 10px 10px 0;
          border-color: transparent white transparent transparent;
        }
        /* Right arrow for next button */
        #next:before {
          border-width: 10px 0 10px 10px;
          border-color: transparent transparent transparent white;
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
      <button id="prev" class="hidden"></button>
      <div id="images">
        <slot></slot>
      </div>
      <button id="next" class="hidden"></button>
      <button id="playPause" class="hidden paused"></button>
    `;

    // Get DOM elements
    const images = this.shadowRoot.getElementById("images");
    const prev = this.shadowRoot.getElementById("prev");
    const next = this.shadowRoot.getElementById("next");
    const playPause = this.shadowRoot.getElementById("playPause");

    // Get attributes
    const transition = this.getAttribute("transition") || "auto";
    const hasControls = this.hasAttribute("controls");
    const hasAutoplay = this.hasAttribute("autoplay");
    const hasLoop = this.hasAttribute("loop");
    const duration = parseInt(this.getAttribute("duration") || "3000", 10);

    // Apply transition behavior
    images.classList.add(transition);

    /**
     * Update visibility of prev/next buttons based on scroll position
     * Buttons are hidden if controls are disabled or autoplay is active
     */
    const updateButtons = () => {
      if (!hasControls || hasAutoplay) {
        prev.classList.add("hidden");
        next.classList.add("hidden");
        return;
      }

      const maxScrollLeft = images.scrollWidth - images.clientWidth;
      const isAtStart = images.scrollLeft === 0;
      const isAtEnd = images.scrollLeft >= maxScrollLeft - 1;

      // Hide prev at start and next at end, unless loop is enabled
      prev.classList.toggle("hidden", isAtStart && !hasLoop);
      next.classList.toggle("hidden", isAtEnd && !hasLoop);
    };

    /** Get current slide index based on scroll position */
    const getCurrentIndex = () => {
      const scrollPos = images.scrollLeft;
      const imageWidth = images.clientWidth;
      return Math.round(scrollPos / imageWidth);
    };

    /** Get total number of images in the carousel */
    const getImageCount = () => {
      return this.shadowRoot.querySelector("slot").assignedElements().length;
    };

    /** Scroll to a specific slide index */
    const scrollToIndex = (index) => {
      images.scrollLeft = index * images.clientWidth;
      updateButtons();
    };

    /** Navigate to the next slide, loop to start if enabled, or stop autoplay at end */
    const goToNext = () => {
      const currentIndex = getCurrentIndex();
      const imageCount = getImageCount();

      if (currentIndex < imageCount - 1) {
        scrollToIndex(currentIndex + 1);
      } else if (hasLoop) {
        scrollToIndex(0);
      } else {
        stopAutoplay();
      }
    };

    /** Navigate to the previous slide, loop to end if enabled */
    const goToPrev = () => {
      const currentIndex = getCurrentIndex();
      const imageCount = getImageCount();

      if (currentIndex > 0) {
        scrollToIndex(currentIndex - 1);
      } else if (hasLoop) {
        scrollToIndex(imageCount - 1);
      }
    };

    /** Start autoplay interval */
    const startAutoplay = () => {
      if (this.autoplayInterval) return;

      this.isPlaying = true;
      playPause.classList.remove("paused");
      playPause.classList.add("playing");

      this.autoplayInterval = setInterval(() => {
        goToNext();
      }, duration);
    };

    /** Stop autoplay interval and show play button */
    const stopAutoplay = () => {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
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

    /** Update button visibility when images load */
    const handleImageLoad = () => {
      updateButtons();
    };

    // Listen for slotted content changes and image loads
    const slot = this.shadowRoot.querySelector("slot");
    slot.addEventListener("slotchange", () => {
      const slottedElements = slot.assignedElements();
      slottedElements.forEach((img) => {
        if (img.tagName === "IMG") {
          img.addEventListener("load", handleImageLoad);
        }
      });
      updateButtons();
    });

    // Button event listeners
    prev.addEventListener("click", () => {
      goToPrev();
    });

    next.addEventListener("click", () => {
      goToNext();
    });

    playPause.addEventListener("click", () => {
      togglePlayPause();
    });

    // Click anywhere on carousel to pause/play when autoplay is enabled
    if (hasAutoplay) {
      images.addEventListener("click", (e) => {
        if (e.target !== prev && e.target !== next) {
          togglePlayPause();
        }
      });
    }

    // Update button visibility on scroll
    images.addEventListener("scroll", updateButtons);

    // Initialize: show play/pause button if both autoplay and controls are present
    if (hasAutoplay && hasControls) {
      playPause.classList.remove("hidden");
    }

    // Initialize: start autoplay if attribute is present
    if (hasAutoplay) {
      startAutoplay();
    }

    // Initialize: set initial button states
    updateButtons();
  }

  disconnectedCallback() {
    // Clean up interval when element is removed
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }
}

customElements.define("carousel-player", CarouselElement);
