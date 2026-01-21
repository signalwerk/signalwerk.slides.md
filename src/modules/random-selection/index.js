const templateRandomSelectionElement = /* HTML */ `
  <style>
    :host {
      display: block;
      position: relative;
      width: 100%;
      text-align: center;
    }

    #container {
      position: relative;
      min-height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    ::slotted(*) {
      display: none !important;
    }

    ::slotted(.selected) {
      display: block !important;
      margin: 0;
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    button {
      background: var(--blue-color--dark, #002f5b);
      border: none;
      color: white;
      padding: 0.5em 1em;
      margin-top: 0.5em;
      border-radius: 0.2em;
      cursor: pointer;
      transition: background-color 0.3s ease;
      font: inherit;
      font-size: 0.5em;
    }

    button:hover {
      background: var(--blue-color, #0054a2);
    }

    button:active {
      transform: translateY(1px);
    }

    .selection-area {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .selection-area.has-selection {
    }

    .placeholder {
      color: #666;
    }
  </style>

  <div id="container">
    <div id="selection-area" class="selection-area">
      <div class="placeholder">–</div>
      <slot></slot>
    </div>
  </div>
  <button id="draw-button">Draw Random</button>
`;

class RandomSelectionElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = templateRandomSelectionElement;

    this.selectionArea = this.shadowRoot.getElementById("selection-area");
    this.drawButton = this.shadowRoot.getElementById("draw-button");
    this.placeholder = this.shadowRoot.querySelector(".placeholder");

    this.currentSelection = null;
    this.availableElements = [];

    const slot = this.shadowRoot.querySelector("slot");

    // Initialize when slot content changes
    slot.addEventListener("slotchange", () => {
      this.updateAvailableElements();
    });

    // Draw random selection on button click
    this.drawButton.addEventListener("click", () => {
      this.drawRandom();
    });

    // Initialize
    this.updateAvailableElements();
  }

  updateAvailableElements() {
    const slot = this.shadowRoot.querySelector("slot");
    this.availableElements = slot.assignedElements();

    // Reset all elements to hidden
    this.availableElements.forEach((element) => {
      element.classList.remove("selected");
    });

    this.currentSelection = null;
    this.updateUI();
  }

  drawRandom() {
    if (this.availableElements.length === 0) {
      return;
    }

    // Remove previous selection
    if (this.currentSelection) {
      this.currentSelection.classList.remove("selected");
    }

    // Get random element
    const randomIndex = Math.floor(
      Math.random() * this.availableElements.length,
    );
    this.currentSelection = this.availableElements[randomIndex];

    // Show selected element
    this.currentSelection.classList.add("selected");

    this.updateUI();
  }

  updateUI() {
    const hasSelection = this.currentSelection !== null;

    this.selectionArea.classList.toggle("has-selection", hasSelection);
    this.placeholder.style.display = hasSelection ? "none" : "block";

    if (hasSelection) {
      this.drawButton.textContent = "Draw Again";
    } else {
      this.drawButton.textContent = "Draw Random";
    }
  }

  // Public method to programmatically draw
  draw() {
    this.drawRandom();
  }

  // Public method to get current selection
  getCurrentSelection() {
    return this.currentSelection;
  }

  // Public method to reset
  reset() {
    if (this.currentSelection) {
      this.currentSelection.classList.remove("selected");
    }
    this.currentSelection = null;
    this.updateUI();
  }
}

customElements.define("random-selection", RandomSelectionElement);
