import { html, css, LitElement } from "lit"; 
import { property, state } from "lit/decorators.js";
import { define } from "@calpoly/mustang";
import "./peak-feature";

interface Item {
  label: string;
  href: string;
}

interface Feature {
  icon: string;
  heading: string;
  items: Array<Item>;
}

export class PeakWrapperElement extends LitElement {
  @property() src?: string;

  @state() data: Feature[] = [];

  static styles = css`
    :host {
      display: block;
      grid-column: span 6;
    }

    @media (max-width: 799px) {
      :host {
        grid-column: span 12;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  hydrate(src: string) {
    fetch(src)
      .then((res) => res.json())
      .then((json) => {
        this.data = json;
      });
  }

  render() {
    return html`
      ${this.data.map(
        (feature) => html`
          <peak-feature icon="${feature.icon}" heading="${feature.heading}">
            ${feature.items.map(
              (item) =>
                html`<li><a href="${item.href}">${item.label}</a></li>`
            )}
          </peak-feature>
        `
      )}
    `;
  }
}

define({ "peak-wrapper": PeakWrapperElement });
