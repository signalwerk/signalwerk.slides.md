import QRCode from "qrcode";

class QrCodeElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = /* HTML */ `
      <style>
        :host {
          display: inline-flex;
          line-height: 0;
        }

        #qr {
          display: inline-block;
        }

        #qr svg {
          display: block;
          width: 100%;
          height: auto;
        }
      </style>
      <div id="qr" aria-live="polite"></div>
    `;

    this.container = this.shadowRoot.getElementById("qr");
  }

  static get observedAttributes() {
    return ["data", "size", "margin", "ec-level"];
  }

  connectedCallback() {
    this.renderQrCode();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (["data", "size", "margin", "ec-level"].includes(name)) {
      this.renderQrCode();
    }
  }

  async renderQrCode() {
    const content = this.getAttribute("data") || "";

    if (!content.trim()) {
      this.container.innerHTML = "";
      return;
    }

    const defaultSize = 500;
    const defaultMargin = 0;

    const sizeAttr = Number.parseInt(
      this.getAttribute("size") || `${defaultSize}`,
      10,
    );
    const marginAttr = Number.parseInt(
      this.getAttribute("margin") || `${defaultMargin}`,
      10,
    );
    const errorCorrectionLevel = this.getAttribute("ec-level") || "M";

    const width = Number.isNaN(sizeAttr) ? defaultSize : sizeAttr;
    const margin = Number.isNaN(marginAttr) ? defaultMargin : marginAttr;

    try {
      const svg = await QRCode.toString(content, {
        type: "svg",
        width,
        margin,
        errorCorrectionLevel,
      });

      this.container.innerHTML = svg;
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      this.container.innerHTML = "";
    }
  }
}

customElements.define("qr-code", QrCodeElement);
