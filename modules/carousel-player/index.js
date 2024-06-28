const template = /* HTML */ `
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
    button:hover {
      background: rgba(0, 0, 0, 0.7);
    }
    button:before {
      content: '';
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
    button.hidden {
      display: none;
    }
  </style>
  <button id="prev" class="hidden"></button>
  <div id="images">
    <slot></slot>
  </div>
  <button id="next"></button>
`;

class CarouselElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = template;

    const images = this.shadowRoot.getElementById("images");
    const prev = this.shadowRoot.getElementById("prev");
    const next = this.shadowRoot.getElementById("next");

    const updateButtons = () => {
      const maxScrollLeft = images.scrollWidth - images.clientWidth;
      prev.classList.toggle('hidden', images.scrollLeft === 0);
      next.classList.toggle('hidden', images.scrollLeft >= maxScrollLeft - 1);
    };

    const handleImageLoad = () => {
      updateButtons();
    };

    const slot = this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', () => {
      const slottedElements = slot.assignedElements();
      slottedElements.forEach(img => {
        if (img.tagName === 'IMG') {
          img.addEventListener('load', handleImageLoad);
        }
      });
      updateButtons();
    });

    prev.addEventListener("click", () => {
      images.scrollLeft -= images.clientWidth;
      updateButtons();
    });

    next.addEventListener("click", () => {
      images.scrollLeft += images.clientWidth;
      updateButtons();
    });

    images.addEventListener("scroll", updateButtons);
    updateButtons();
  }
}

customElements.define("carousel-component", CarouselElement);
