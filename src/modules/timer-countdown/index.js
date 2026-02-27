const LABELS = {
  start: "⏵",
  pause: "⏸",
  reset: "⏮",
};

const template = /* HTML */ `
  <style>
    :host {
      display: inline-block;
      line-height: 1;

      --work-sans-fea-tnum: "tnum" on;

      font-feature-settings:
        var(--work-sans-fea-aalt), var(--work-sans-fea-c2sc),
        var(--work-sans-fea-calt), var(--work-sans-fea-case),
        var(--work-sans-fea-dlig), var(--work-sans-fea-dnom),
        var(--work-sans-fea-frac), var(--work-sans-fea-hist),
        var(--work-sans-fea-liga), var(--work-sans-fea-lnum),
        var(--work-sans-fea-locl), var(--work-sans-fea-nalt),
        var(--work-sans-fea-numr), var(--work-sans-fea-onum),
        var(--work-sans-fea-ordn), var(--work-sans-fea-ornm),
        var(--work-sans-fea-pnum), var(--work-sans-fea-rvrn),
        var(--work-sans-fea-salt), var(--work-sans-fea-sinf),
        var(--work-sans-fea-smcp), var(--work-sans-fea-ss02),
        var(--work-sans-fea-ss03), var(--work-sans-fea-ss04),
        var(--work-sans-fea-ss05), var(--work-sans-fea-subs),
        var(--work-sans-fea-sups), var(--work-sans-fea-tnum),
        var(--work-sans-fea-zero), var(--work-sans-fea-cpsp),
        var(--work-sans-fea-kern);
    }

    #display {
      font-weight: bold;
      text-align: center;
      cursor: pointer;
    }

    #display.editable {
      cursor: text;
    }

    #time-input {
      display: none;
      font-weight: bold;
      text-align: center;
      border: 2px solid var(--blue-color);
      border-radius: 0;
      padding: 0.2em;
      font-family: inherit;
      font-size: inherit;
      background: white;
      box-sizing: border-box;
    }

    #controls {
      display: flex;
      gap: 0.1em;
      align-items: center;
      justify-content: center;
    }

    button {
      background: var(--blue-color);
      border: none;
      color: white;
      padding: 0.25em 0.5em;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.25em;
      font-weight: bold;
      line-height: 1;
      transition: background-color 0.2s;
    }

    button:hover {
      background: var(--blue-color--dark);
    }

    .finished {
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%,
      50% {
        color: var(--cyan-color);
      }
      51%,
      100% {
      }
    }
  </style>
  <div class="timer-countdown">
    <div id="display">00:00:00</div>
    <input id="time-input" type="text" />
    <div id="controls">
      <button id="reset">${LABELS.reset}</button>
      <button id="stop">${LABELS.pause}</button>
      <button id="start">${LABELS.start}</button>
    </div>
  </div>
`;

class TimerCountdown extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = template;

    // Timer state
    this.initialTime = 0; // in seconds
    this.remainingTime = 0; // in seconds
    this.startTimestamp = null;
    this.pausedRemainingTime = null; // Store remaining time when paused
    this.intervalId = null;
    this.isRunning = false;
    this.hasBeenStarted = false; // Track if timer has ever been started

    // Get DOM elements
    this.display = this.shadowRoot.getElementById("display");
    this.timeInput = this.shadowRoot.getElementById("time-input");
    this.startBtn = this.shadowRoot.getElementById("start");
    this.stopBtn = this.shadowRoot.getElementById("stop");
    this.resetBtn = this.shadowRoot.getElementById("reset");

    // Bind event listeners
    this.startBtn.addEventListener("click", () => this.start());
    this.stopBtn.addEventListener("click", () => this.pause());
    this.resetBtn.addEventListener("click", () => this.reset());
    this.display.addEventListener("dblclick", () => this.editTime());

    // Initialize
    this.init();
  }

  static get observedAttributes() {
    return ["time", "id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "time" && newValue !== oldValue) {
      this.parseTime(newValue);
      this.updateDisplay();
    }
  }

  connectedCallback() {
    // Check if there's a stored timer state for this timer ID
    this.restoreTimerState();
  }

  init() {
    const timeAttr = this.getAttribute("time");
    if (timeAttr) {
      this.parseTime(timeAttr);
    }
    this.updateDisplay();
    this.updateButtons();
  }

  parseTime(timeString) {
    // Parse time in format HH:MM:SS, MM:SS, or just seconds
    const parts = timeString.split(":").map((part) => parseInt(part, 10));

    if (parts.length === 3) {
      // HH:MM:SS
      this.initialTime = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // MM:SS
      this.initialTime = parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      // Just seconds
      this.initialTime = parts[0];
    } else {
      console.error("Invalid time format. Use HH:MM:SS, MM:SS, or seconds");
      this.initialTime = 0;
    }

    this.remainingTime = this.initialTime;
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  }

  updateDisplay() {
    this.display.textContent = this.formatTime(Math.max(0, this.remainingTime));

    // Update visual state
    this.display.classList.remove("running", "finished");
    if (this.remainingTime <= 0) {
      this.display.classList.add("finished");
    } else if (this.isRunning) {
      this.display.classList.add("running");
    }
  }

  updateButtons() {
    const canEdit = !this.hasBeenStarted && this.remainingTime > 0;

    if (this.remainingTime <= 0) {
      // Timer finished - only show reset
      this.startBtn.style.display = "none";
      this.stopBtn.style.display = "none";
      this.resetBtn.style.display = "block";
      this.display.classList.remove("editable");
    } else if (this.isRunning) {
      // Timer running - show stop button only
      this.startBtn.style.display = "none";
      this.stopBtn.style.display = "block";
      this.resetBtn.style.display = "none";
      this.display.classList.remove("editable");
    } else if (this.hasBeenStarted) {
      // Timer paused - show start and reset
      this.startBtn.style.display = "block";
      this.stopBtn.style.display = "none";
      this.resetBtn.style.display = "block";
      this.display.classList.remove("editable");
    } else {
      // Initial state - only show start, allow editing
      this.startBtn.style.display = "block";
      this.stopBtn.style.display = "none";
      this.resetBtn.style.display = "none";
      this.display.classList.add("editable");
    }
  }

  editTime() {
    // Only allow editing in initial state
    if (this.hasBeenStarted || this.isRunning || this.remainingTime <= 0) {
      return;
    }

    // Show input, hide display
    this.display.style.display = "none";
    this.timeInput.style.display = "block";
    this.timeInput.value = this.formatTime(this.remainingTime);
    this.timeInput.focus();
    this.timeInput.select();

    // Handle input events
    const finishEdit = () => {
      const newTime = this.timeInput.value.trim();
      if (newTime && this.isValidTimeFormat(newTime)) {
        this.parseTime(newTime);
        this.saveCustomTime();
      }

      // Hide input, show display
      this.timeInput.style.display = "none";
      this.display.style.display = "block";
      this.updateDisplay();
    };

    const cancelEdit = () => {
      // Hide input, show display without saving
      this.timeInput.style.display = "none";
      this.display.style.display = "block";
    };

    // Remove any existing listeners
    this.timeInput.onblur = null;
    this.timeInput.onkeydown = null;

    // Add event listeners
    this.timeInput.onblur = finishEdit;
    this.timeInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finishEdit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEdit();
      }
    };
  }

  isValidTimeFormat(timeString) {
    // Check if time format is valid (HH:MM:SS, MM:SS, or just seconds)
    const timeRegex = /^((\d{1,2}:)?\d{1,2}:\d{2}|\d+)$/;
    return timeRegex.test(timeString);
  }

  saveCustomTime() {
    // Save the custom time to localStorage
    const key = this.getStorageKey();
    if (!key) return;

    const state = {
      customTime: this.initialTime,
      state: "initial",
    };

    localStorage.setItem(key, JSON.stringify(state));
  }

  start() {
    if (this.remainingTime <= 0) return;

    this.isRunning = true;
    this.hasBeenStarted = true;

    // If resuming from pause, adjust start timestamp to account for remaining time
    if (this.pausedRemainingTime !== null) {
      // Calculate what the start timestamp should be to have the correct remaining time
      this.startTimestamp =
        Date.now() - (this.initialTime - this.pausedRemainingTime) * 1000;
      this.pausedRemainingTime = null;
    } else {
      // First time starting
      this.startTimestamp = Date.now();
    }

    // Store timer state in localStorage
    this.saveTimerState();

    this.intervalId = setInterval(() => {
      this.tick();
    }, 100); // Update every 100ms for smooth display

    this.updateButtons();
    this.updateDisplay();
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;

    // Store the remaining time when paused
    this.pausedRemainingTime = this.remainingTime;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Save the current state
    this.saveTimerState();

    this.updateButtons();
    this.updateDisplay();
  }

  reset() {
    this.isRunning = false;
    this.remainingTime = this.initialTime;
    this.startTimestamp = null;
    this.pausedRemainingTime = null;
    this.hasBeenStarted = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Clear stored timer state (back to initial)
    this.clearTimerState();

    this.updateButtons();
    this.updateDisplay();
  }

  tick() {
    if (!this.isRunning || !this.startTimestamp) return;

    const elapsed = Math.floor((Date.now() - this.startTimestamp) / 1000);
    this.remainingTime = Math.max(0, this.initialTime - elapsed);

    this.updateDisplay();

    if (this.remainingTime <= 0) {
      this.pause(); // This will stop the timer and save the stop state
      // Timer finished
      console.log(`Timer ${this.getAttribute("id")} finished!`);
    }
  }

  getStorageKey() {
    const id = this.getAttribute("id") || "default";
    return `timer_${id}`;
  }

  saveTimerState() {
    const key = this.getStorageKey();
    if (!key) return;

    const state = {
      state: this.isRunning
        ? "start"
        : this.remainingTime <= 0
          ? "stop"
          : "pause",
      start: this.startTimestamp,
      hasBeenStarted: this.hasBeenStarted,
      pausedRemainingTime: this.pausedRemainingTime,
      customTime: this.initialTime, // Always save the current initial time
    };

    localStorage.setItem(key, JSON.stringify(state));
  }

  restoreTimerState() {
    const key = this.getStorageKey();
    if (!key) return;

    const stored = localStorage.getItem(key);
    if (!stored) return;

    try {
      const state = JSON.parse(stored);

      // Restore custom time if it exists
      if (state.customTime && state.customTime !== this.initialTime) {
        this.initialTime = state.customTime;
        this.remainingTime = this.initialTime;
      }

      // Restore hasBeenStarted flag
      this.hasBeenStarted = state.hasBeenStarted || false;
      this.pausedRemainingTime = state.pausedRemainingTime || null;

      if (state.state === "start" && state.start) {
        // Timer was running - calculate current remaining time
        const elapsed = Math.floor((Date.now() - state.start) / 1000);
        this.remainingTime = Math.max(0, this.initialTime - elapsed);

        if (this.remainingTime > 0) {
          // Still time left - resume running
          this.isRunning = true;
          this.startTimestamp = state.start;

          this.intervalId = setInterval(() => {
            this.tick();
          }, 100);
        } else {
          // Timer finished while away - set to stop state
          this.remainingTime = 0;
          this.isRunning = false;
          this.startTimestamp = null;
          this.pausedRemainingTime = null;
          this.saveTimerState(); // Save the stop state
        }
      } else if (state.state === "stop") {
        // Timer was finished
        this.remainingTime = 0;
        this.isRunning = false;
        this.startTimestamp = null;
        this.pausedRemainingTime = null;
      } else if (state.state === "pause") {
        // Timer was paused - use the stored paused remaining time
        this.remainingTime = this.pausedRemainingTime || this.initialTime;
        this.isRunning = false;
        this.startTimestamp = state.start;
      }
      // If state is 'initial' or undefined, keep default values (including custom time)
    } catch (e) {
      console.error("Failed to restore timer state:", e);
      this.clearTimerState();
    }

    this.updateDisplay();
    this.updateButtons();
  }

  clearTimerState() {
    const key = this.getStorageKey();
    if (key) {
      localStorage.removeItem(key);
    }
  }
}

customElements.define("timer-countdown", TimerCountdown);
