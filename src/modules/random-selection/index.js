class RandomSelectionElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = /* HTML */ ` <style>
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

        .dataset-item {
          display: none;
          margin: 0;
          animation: fadeIn 0.5s ease-in-out;
        }

        .dataset-item.selected {
          display: block;
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
          <div id="dataset-container"></div>
        </div>
      </div>
      <button id="draw-button">Draw Random</button>`;

    this.selectionArea = this.shadowRoot.getElementById("selection-area");
    this.drawButton = this.shadowRoot.getElementById("draw-button");
    this.placeholder = this.shadowRoot.querySelector(".placeholder");
    this.datasetContainer = this.shadowRoot.getElementById("dataset-container");

    this.currentSelection = null;
    this.availableElements = [];
    this.isDatasetMode = false;

    // Predefined datasets
    this.datasets = {
      "oblique-strategies": {
        element: "div",
        className: "oblique-strategy",
        items: [
          "Abandon normal instruments",
          "Accept advice",
          "Accretion",
          "A line has two sides",
          "Allow an easement (an easement is the abandonment of a stricture)",
          "Are there sections? Consider transitions",
          "Ask people to work against their better judgement",
          "Ask your body",
          "Assemble some of the instruments in a group and treat the group",
          "Balance the consistency principle with the inconsistency principle",
          "Be dirty",
          "Breathe more deeply",
          "Bridges -build -burn",
          "Cascades",
          "Change instrument roles",
          "Change nothing and continue with immaculate consistency",
          "Children's voices -speaking -singing",
          "Cluster analysis",
          "Consider different fading systems",
          "Consult other sources -promising -unpromising",
          "Convert a melodic element into a rhythmic element",
          "Courage!",
          "Cut a vital connection",
          "Decorate, decorate",
          "Define an area as 'safe' and use it as an anchor",
          "Destroy -nothing -the most important thing",
          "Discard an axiom",
          "Disconnect from desire",
          "Discover the recipes you are using and abandon them",
          "Distorting time",
          "Do nothing for as long as possible",
          "Don't be afraid of things because they're easy to do",
          "Don't be frightened of cliches",
          "Don't be frightened to display your talents",
          "Don't break the silence",
          "Don't stress one thing more than another",
          "Do something boring",
          "Do the washing up",
          "Do the words need changing?",
          "Do we need holes?",
          "Emphasize differences",
          "Emphasize repetitions",
          "Emphasize the flaws",
          "Faced with a choice, do both (given by Dieter Roth)",
          "Feedback recordings into an acoustic situation",
          "Fill every beat with something",
          "Get your neck massaged",
          "Ghost echoes",
          "Give the game away",
          "Give way to your worst impulse",
          "Go slowly all the way round the outside",
          "Honor thy error as a hidden intention",
          "How would you have done it?",
          "Humanize something free of error",
          "Imagine the music as a moving chain or caterpillar",
          "Imagine the music as a set of disconnected events",
          "Infinitesimal gradations",
          "Intentions -credibility of -nobility of -humility of",
          "Into the impossible",
          "Is it finished?",
          "Is there something missing?",
          "Is the tuning appropriate?",
          "Just carry on",
          "Left channel, right channel, centre channel",
          "Listen in total darkness, or in a very large room, very quietly",
          "Listen to the quiet voice",
          "Look at a very small object, look at its centre",
          "Look at the order in which you do things",
          "Look closely at the most embarrassing details and amplify them",
          "Lowest common denominator check -single beat -single note -single",
          "riff",
          "Make a blank valuable by putting it in an exquisite frame",
          "Make an exhaustive list of everything you might do and do the last thing on the list",
          "Make a sudden, destructive unpredictable action; incorporate",
          "Mechanicalize something idiosyncratic",
          "Mute and continue",
          "Only one element of each kind",
          "(Organic) machinery",
          "Overtly resist change",
          "Put in earplugs",
          "Remember those quiet evenings",
          "Remove ambiguities and convert to specifics",
          "Remove specifics and convert to ambiguities",
          "Repetition is a form of change",
          "Reverse",
          "Short circuit (example: a man eating peas with the idea that they will improve his virility shovels them straight into his lap)",
          "Shut the door and listen from outside",
          "Simple subtraction",
          "Spectrum analysis",
          "Take a break",
          "Take away the elements in order of apparent non-importance",
          "Tape your mouth (given by Ritva Saarikko)",
          "The inconsistency principle",
          "The tape is now the music",
          "Think of the radio",
          "Tidy up",
          "Trust in the you of now",
          "Turn it upside down",
          "Twist the spine",
          "Use an old idea",
          "Use an unacceptable color",
          "Use fewer notes",
          "Use filters",
          'Use "unqualified" people',
          "Water",
          "What are you really thinking about just now? Incorporate",
          "What is the reality of the situation?",
          "What mistakes did you make last time?",
          "What would your closest friend do?",
          "What wouldn't you do?",
          "Work at a different speed",
          "You are an engineer",
          "You can only make one dot at a time",
          "You don't have to be ashamed of using your own ideas",
          "[blank white card]",
        ],
      },
    };

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
    this.initializeComponent();
  }

  initializeComponent() {
    const datasetName = this.getAttribute("data-set");
    if (datasetName && this.datasets[datasetName]) {
      this.setupDatasetMode(datasetName);
    } else {
      this.setupSlotMode();
    }
  }

  setupDatasetMode(datasetName) {
    this.isDatasetMode = true;
    const dataset = this.datasets[datasetName];

    // Clear any existing dataset items
    this.datasetContainer.innerHTML = "";

    // Create elements for each dataset item
    this.availableElements = dataset.items.map((item, index) => {
      const element = document.createElement(dataset.element || "div");
      element.className = `dataset-item ${dataset.className || ""}`;
      element.innerHTML = item;
      element.dataset.index = index;
      this.datasetContainer.appendChild(element);
      return element;
    });

    this.updateUI();
  }

  setupSlotMode() {
    this.isDatasetMode = false;
    this.updateAvailableElements();
  }

  updateAvailableElements() {
    if (this.isDatasetMode) return;

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
