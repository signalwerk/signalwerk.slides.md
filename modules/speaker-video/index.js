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
  }

  connectedCallback() {
    if (this.classList.contains("show")) {
      this.startVideoStream();
    }

    document.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.handleKeydown.bind(this));
    this.stopVideoStream();
  }

  handleKeydown(event) {
    if (event.ctrlKey && event.key === "h") {
      this.startVideoStream(); // Start the video stream but never stop it (fast access to the camera)
      this.classList.toggle("show");
    } else if (event.ctrlKey && event.key === "f") {
      this.startVideoStream();
      this.classList.toggle("big");
      this.classList.add("show");
    }
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
