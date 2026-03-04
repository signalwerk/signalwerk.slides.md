class VideoButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = /* HTML */ `
      <style>
        :host {
          display: none;
        }
        :host(.show) {
          display: flex;
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .tooltip {
          display: none;
        }
      </style>
      <video autoplay></video>
      <div part="tooltip" class="tooltip">
        Ctrl + H: Toggle video stream<br />
        Ctrl + F: Fullscreen video
      </div>
    `;
    this.stream = null;
    this._unregisterCommands = [];
  }

  connectedCallback() {
    if (this.classList.contains("show")) {
      this.startVideoStream();
    }

    if (window.commandPalette) {
      this._unregisterCommands = [
        window.commandPalette.registerCommand({
          label: "Toggle Speaker Video",
          shortcut: { key: "h", ctrl: true },
          action: () => {
            this.startVideoStream();
            this.classList.toggle("show");
          },
        }),
        window.commandPalette.registerCommand({
          label: "Fullscreen Speaker Video",
          shortcut: { key: "f", ctrl: true },
          action: () => {
            this.startVideoStream();
            this.classList.toggle("big");
            this.classList.add("show");
          },
        }),
      ];
    }
  }

  disconnectedCallback() {
    this._unregisterCommands.forEach((unregister) => unregister?.());
    this._unregisterCommands = [];
    this.stopVideoStream();
  }

  startVideoStream() {
    if (!this.stream) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.stream = stream;
          this.shadowRoot.querySelector("video").srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing the camera", error);
        });
    }
  }

  stopVideoStream() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => track.stop());
      this.shadowRoot.querySelector("video").srcObject = null;
      this.stream = null;
    }
  }
}

customElements.define("speaker-video", VideoButton);
