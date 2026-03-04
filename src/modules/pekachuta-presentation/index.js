/**
 * pekachuta-presentation — a Pecha Kucha–style presentation overlay.
 *
 * Pecha Kucha: each slide shown for exactly DURATION seconds, then auto-advances.
 *
 * Plugin architecture integration points:
 *   • window.commandPalette.registerCommand(…)  — registers commands in the palette
 *   • window.slidesApp.getState()               — reads current/total slides
 *   • CustomEvent 'slides:change'  (on window)  — fired by Slides when slide changes
 *   • CustomEvent 'slides:navigate' (on window) — dispatched here to advance slides
 *   • CustomEvent 'commandPalette:ready'         — fired when palette API becomes available
 *
 * Usage: just load this script; it self-injects <pekachuta-presentation> into <body>.
 */

const DURATION = 20; // seconds per slide (standard Pecha Kucha)
const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 238.76

const template = /* HTML */ `
  <style>
    :host {
      --pekachuta-size--local: var(--pekachuta-size, 1);
      display: none;
      position: fixed;
      top: calc(0.4rem * var(--pekachuta-size--local));
      right: calc(0.4rem * var(--pekachuta-size--local));
      z-index: 500;
      font-family: var(
        --root--font-family,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif
      );
      font-size: var(--font-size, 1rem);
      user-select: none;
    }

    :host(.active) {
      display: block;
    }

    .widget {
      background: color-mix(var(--blue-color--dark, #002f5b), transparent 0%);
      border-radius: calc(0.2rem * var(--pekachuta-size--local));
      padding: calc(0.2rem * var(--pekachuta-size--local));
      width: calc(1.2rem * var(--pekachuta-size--local));
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: calc(0.1rem * var(--pekachuta-size--local));
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 0;
      right: 0;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.1);
      cursor: pointer;
      font-size: calc(0.3rem * var(--pekachuta-size--local));
      line-height: 1;
      padding: 0 calc(0.1rem * var(--pekachuta-size--local));
      border-radius: calc(0.1rem * var(--pekachuta-size--local));
      width: calc(0.5rem * var(--pekachuta-size--local));
      height: calc(0.5rem * var(--pekachuta-size--local));
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .close-btn:hover {
      color: rgba(255, 255, 255, 0.8);
    }

    /* ── Circle timer ────────────────────────────────── */

    .timer-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      cursor: pointer;
      overflow: hidden;
    }

    .timer-wrap:hover .pause-hint {
      opacity: 1;
    }

    .timer-svg {
      width: 100%;
      aspect-ratio: 1 / 1;
      transform: rotate(-90deg);
    }

    .track {
      fill: none;
      stroke: rgba(255, 255, 255, 0.1);
      stroke-width: 7;
    }

    .ring {
      fill: none;
      stroke: #4a9eff;
      stroke-width: 7;
      stroke-linecap: round;
      stroke-dasharray: var(--circumference);
      stroke-dashoffset: 0;
      transition: stroke-dashoffset 0.9s linear, stroke 0.4s;
    }

    .ring.warning {
      stroke: #ff9f0a;
    }

    .ring.danger {
      stroke: #ff453a;
    }

    .time-label {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: calc(0.4rem * var(--pekachuta-size--local));
      font-weight: 700;
      color: rgba(255, 255, 255, 0.6);
    }

    :host(.paused) .time-label {
      opacity: 0;
    }

    .timer-wrap:hover .time-label {
      opacity: 0;
    }

    .pause-hint {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: calc(0.3rem * var(--pekachuta-size--local));
      opacity: 0;
      transition: opacity 0.2s;
      color: rgba(255, 255, 255, 0.6);
    }

    :host(.paused) .pause-hint {
      opacity: 1;
    }

    /* ── Slide counter ───────────────────────────────── */

    .slide-counter {
      font-size: calc(0.3rem * var(--pekachuta-size--local));
      font-weight: 400;
      color: rgba(255, 255, 255, 0.6);
    }

    .slide-counter .current {
      color: #fff;
      font-size: calc(0.3rem * var(--pekachuta-size--local));
    }
  </style>

  <div class="widget">
    <button class="close-btn" id="close" title="Stop Pekachuta">✕</button>

    <div class="timer-wrap" id="timer-wrap" title="Click to pause / resume">
      <svg class="timer-svg" viewBox="0 0 100 100">
        <circle class="track" cx="50" cy="50" r="${RADIUS}" />
        <circle
          class="ring"
          id="ring"
          cx="50"
          cy="50"
          r="${RADIUS}"
          style="--circumference: ${CIRCUMFERENCE.toFixed(2)}"
        />
      </svg>
      <div class="time-label" id="time">${DURATION}</div>
      <div class="pause-hint">⏸</div>
    </div>

    <div class="slide-counter" id="slide-counter">
      <span class="current">—</span>&thinsp;/&thinsp;—
    </div>
  </div>
`;

class PekachutaPresentation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = template;

    this._isActive = false;
    this._isPaused = false;
    this._timeLeft = DURATION;
    this._intervalId = null;
    this._unregisterCommand = null;
    this._current = 0; // 0-indexed
    this._total = 0;

    // Stable bound handlers
    this._onSlideChange = this._handleSlideChange.bind(this);
    this._onPaletteReady = this._tryRegisterCommand.bind(this);
    this._onKeyDown = this._handleKeyDown.bind(this);

    // Wire up widget controls
    this.shadowRoot
      .getElementById("close")
      .addEventListener("click", () => this.deactivate());
    this.shadowRoot
      .getElementById("timer-wrap")
      .addEventListener("click", () => this._togglePause());
  }

  connectedCallback() {
    this._tryRegisterCommand();
    window.addEventListener("commandPalette:ready", this._onPaletteReady);
    window.addEventListener("slides:change", this._onSlideChange);
    window.addEventListener("keydown", this._onKeyDown);
  }

  disconnectedCallback() {
    this._unregisterCommand?.();
    this._unregisterCommand = null;
    window.removeEventListener("commandPalette:ready", this._onPaletteReady);
    window.removeEventListener("slides:change", this._onSlideChange);
    window.removeEventListener("keydown", this._onKeyDown);
    this._stopInterval();
  }

  // ── Public API ──────────────────────────────────────

  /** Activate or deactivate the overlay. */
  toggle() {
    this._isActive ? this.deactivate() : this.activate();
  }

  /** Start the Pekachuta overlay and timer (initially paused). */
  activate() {
    this._isActive = true;
    this._isPaused = true;
    this.classList.add("active", "paused");

    const state = window.slidesApp?.getState() ?? { current: 0, total: 0 };
    this._current = state.current;
    this._total = state.total;
    this._renderSlideCounter();
    this._resetTimer();
  }

  /** Stop and hide the overlay. */
  deactivate() {
    this._isActive = false;
    this._isPaused = false;
    this._stopInterval();
    this.classList.remove("active", "paused");
  }

  // ── Internal ────────────────────────────────────────

  _tryRegisterCommand() {
    if (this._unregisterCommand || !window.commandPalette) return;
    this._unregisterCommand = window.commandPalette.registerCommand({
      label: "Toggle Pekachuta Presentation",
      shortcut: { key: "t", ctrl: true },
      action: () => this.toggle(),
    });
  }

  _resetTimer() {
    this._stopInterval();
    this._timeLeft = DURATION;
    this._renderTimer();
    if (!this._isPaused) {
      this._startInterval();
    }
  }

  _startInterval() {
    this._intervalId = setInterval(() => {
      this._timeLeft = Math.max(0, this._timeLeft - 1);
      this._renderTimer();

      if (this._timeLeft <= 0) {
        this._stopInterval();
        if (this._current < this._total - 1) {
          // Advance to next slide via the global event bus
          window.dispatchEvent(
            new CustomEvent("slides:navigate", {
              detail: { direction: "next" },
            }),
          );
        } else {
          // Last slide — presentation complete
          this.deactivate();
        }
      }
    }, 1000);
  }

  _stopInterval() {
    if (this._intervalId != null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  _handleKeyDown(e) {
    if (!this._isActive) return;
    if (e.code === "Space" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      this._togglePause();
    }
  }

  _togglePause() {
    if (!this._isActive) return;
    this._isPaused = !this._isPaused;
    this.classList.toggle("paused", this._isPaused);
    if (this._isPaused) {
      this._stopInterval();
    } else {
      this._startInterval();
    }
  }

  _handleSlideChange(e) {
    if (!this._isActive) return;
    const { current, total } = e.detail;
    this._current = current;
    this._total = total;
    this._renderSlideCounter();
    // Each new slide always gets a fresh DURATION — resume if paused
    this._isPaused = false;
    this.classList.remove("paused");
    this._resetTimer();
  }

  _renderTimer() {
    const ring = this.shadowRoot.getElementById("ring");
    const timeDisplay = this.shadowRoot.getElementById("time");
    if (!ring || !timeDisplay) return;

    const progress = this._timeLeft / DURATION;
    ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
    timeDisplay.textContent = this._timeLeft;

    // Colour feedback: normal → warning → danger
    ring.classList.toggle("danger", this._timeLeft <= 5);
    ring.classList.toggle(
      "warning",
      this._timeLeft > 5 && this._timeLeft <= 10,
    );
  }

  _renderSlideCounter() {
    const el = this.shadowRoot.getElementById("slide-counter");
    if (!el) return;
    if (this._total > 0) {
      el.innerHTML = `<span class="current">${
        this._current + 1
      }</span>&thinsp;|&thinsp;${this._total}`;
    } else {
      el.innerHTML = `<span class="current">—</span>&thinsp;|&thinsp;—`;
    }
  }
}

customElements.define("pekachuta-presentation", PekachutaPresentation);

// Auto-inject a single overlay instance into the page body.
// This runs when the module script is loaded — no manual HTML needed.
if (!document.querySelector("pekachuta-presentation")) {
  document.body.appendChild(document.createElement("pekachuta-presentation"));
}
