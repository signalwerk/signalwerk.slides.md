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
        H: Toggle video stream<br />
        F: Fullscreen video
      </div>
    `;
    this.stream = null;
  }

  connectedCallback() {
    if (this.classList.contains("show")) {
      this.startVideoStream();
    }

    if (window.__commandPalette) {
      this._unregisterToggle = window.__commandPalette.registerCommand({
        label: "Toggle video stream",
        shortcut: "h",
        action: () => {
          this.startVideoStream();
          this.classList.toggle("show");
        },
      });
      this._unregisterFullscreen = window.__commandPalette.registerCommand({
        label: "Fullscreen video",
        shortcut: "f",
        action: () => {
          this.startVideoStream();
          this.classList.toggle("big");
          this.classList.add("show");
        },
      });
    }
  }

  disconnectedCallback() {
    if (this._unregisterToggle) this._unregisterToggle();
    if (this._unregisterFullscreen) this._unregisterFullscreen();
    this.stopVideoStream();
  }

  toggleVideoStream() {
    if (this.classList.contains("show")) {
      this.startVideoStream();
    } else {
      this.stopVideoStream();
    }
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
