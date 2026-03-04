class VideoButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = /* HTML */ `
      <style>
        :host {
          display: none;
          position: fixed;
          bottom: 5vh;
          right: 5vh;
          width: 25vh;
          height: 25vh;
          font-size: 1vh;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #ccc;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          background-color: #fff;
        }
        :host(.show) {
          display: flex;
        }
        :host(.big) {
          width: 100%;
          height: 100%;
          bottom: 0;
          right: 0;
          border-radius: 0;
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      </style>
      <video autoplay></video>
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
