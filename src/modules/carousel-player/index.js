class CarouselElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.autoplayInterval = null;
    this.isPlaying = false;
    this.isScrolling = false;

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
          scroll-behavior: smooth;
          width: 100%;
          scroll-snap-type: x mandatory;
        }
        ::slotted(img) {
          all: unset;
          width: 100% !important;
          height: auto !important;
          scroll-snap-align: start;
          flex-shrink: 0;
          object-fit: cover; /* Ensure images cover the container properly */
        }
        .button {
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
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        .button:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        .button:before {
          content: "";
          display: inline-block;
          width: 0;
          height: 0;
          border-style: solid;
        }
        #prev:before {
          border-width: 10px 10px 10px 0;
          border-color: transparent white transparent transparent;
        }
        #next:before {
          border-width: 10px 0 10px 10px;
          border-color: transparent transparent transparent white;
        }
        #playPause:before {
          border-width: 12px 0 12px 18px;
          border-color: transparent transparent transparent white;
        }
        #playPause.playing:before {
          border-style: double;
          border-width: 0px 0 0px 18px;
          border-color: transparent transparent transparent white;
        }
        .button.hidden {
          display: none;
        }
      </style>
      <button class="button" id="prev" class="hidden"></button>
      <div id="images">
        <slot></slot>
      </div>
      <button class="button" id="next"></button>
      <button id="playPause" class="hidden"></button>
    `;

    const images = this.shadowRoot.getElementById("images");
    const prev = this.shadowRoot.getElementById("prev");
    const next = this.shadowRoot.getElementById("next");
    const playPause = this.shadowRoot.getElementById("playPause");

    const hasControls = () => this.hasAttribute("controls");
    const hasAutoplay = () => this.hasAttribute("autoplay");
    const hasLoop = () => this.hasAttribute("loop");
    const getDuration = () =>
      parseInt(this.getAttribute("duration") || "3000", 10);

    const updateButtons = () => {
      const maxScrollLeft = images.scrollWidth - images.clientWidth;
      const isAtStart = images.scrollLeft === 0;
      const isAtEnd = images.scrollLeft >= maxScrollLeft - 1;

      if (hasControls()) {
        prev.classList.toggle("hidden", isAtStart && !hasLoop());
        next.classList.toggle("hidden", isAtEnd && !hasLoop());
      } else {
        prev.classList.add("hidden");
        next.classList.add("hidden");
      }

      // Show play/pause button only if both autoplay and controls are present
      if (hasAutoplay() && hasControls()) {
        playPause.classList.remove("hidden");
      } else {
        playPause.classList.add("hidden");
      }
    };

    const goToNext = () => {
      if (this.isScrolling) return;

      const maxScrollLeft = images.scrollWidth - images.clientWidth;
      const isAtEnd = images.scrollLeft >= maxScrollLeft - 1;

      if (!isAtEnd) {
        this.isScrolling = true;
        images.scrollLeft += images.clientWidth;
      } else if (hasLoop()) {
        // Only set scrolling flag if we're actually changing position
        if (images.scrollLeft !== 0) {
          this.isScrolling = true;
          images.scrollLeft = 0;
        }
      } else {
        // At end without loop - stop autoplay
        stopAutoplay();
      }
      updateButtons();
    };

    const goToPrev = () => {
      if (this.isScrolling) return;

      const maxScrollLeft = images.scrollWidth - images.clientWidth;
      const isAtStart = images.scrollLeft === 0;

      if (isAtStart && hasLoop()) {
        if (images.scrollLeft !== maxScrollLeft) {
          this.isScrolling = true;
          images.scrollLeft = maxScrollLeft;
        }
      } else if (!isAtStart) {
        this.isScrolling = true;
        images.scrollLeft -= images.clientWidth;
      }
      updateButtons();
    };

    const startAutoplay = () => {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
      this.isPlaying = true;
      playPause.classList.add("playing");
      this.autoplayInterval = setInterval(() => {
        goToNext();
      }, getDuration());
    };

    const stopAutoplay = () => {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
      this.isPlaying = false;
      playPause.classList.remove("playing");
    };

    const togglePlayPause = () => {
      if (this.isPlaying) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    };

    const slot = this.shadowRoot.querySelector("slot");
    slot.addEventListener("slotchange", () => {
      const slottedElements = slot.assignedElements();
      let imagesToLoad = 0;
      let imagesLoaded = 0;

      slottedElements.forEach((img) => {
        if (img.tagName === "IMG") {
          imagesToLoad++;

          if (img.complete) {
            imagesLoaded++;
          } else {
            img.addEventListener("load", () => {
              imagesLoaded++;
              updateButtons();

              // Start autoplay once all images are loaded
              if (
                imagesLoaded === imagesToLoad &&
                hasAutoplay() &&
                !this.isPlaying
              ) {
                startAutoplay();
              }
            });
          }
        }
      });

      updateButtons();

      // If all images are already loaded (cached), start autoplay now
      if (
        imagesToLoad > 0 &&
        imagesLoaded === imagesToLoad &&
        hasAutoplay() &&
        !this.isPlaying
      ) {
        startAutoplay();
      }
    });

    prev.addEventListener("click", () => {
      stopAutoplay();
      goToPrev();
    });

    next.addEventListener("click", () => {
      stopAutoplay();
      goToNext();
    });

    playPause.addEventListener("click", togglePlayPause);

    let scrollTimeout;
    images.addEventListener("scroll", () => {
      updateButtons();

      // Reset scrolling flag after scroll completes
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
      }, 100);
    });

    // Initialize buttons (autoplay will start after images load)
    updateButtons();
  }

  disconnectedCallback() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }
}

customElements.define("carousel-player", CarouselElement);
