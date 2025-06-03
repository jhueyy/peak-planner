import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

export class PeakFeatureElement extends LitElement {
    @property() icon = "";
    @property() heading = "";

    override render() {
        return html`
      <section class="feature">
        <h2>
          <svg class="icon">
            <use href="/icons/hiking.svg#icon-${this.icon}" />
          </svg>
          ${this.heading}
        </h2>
        <ul>
          <slot></slot>
        </ul>
      </section>
    `;
    }

    static styles = [
        reset.styles,
        css`
      :host {
        display: block;
        grid-column: span 6;
      }

      .feature {
        background-color: var(--color-box-background);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      @media (max-width: 799px) {
        .feature {
          grid-column: span 12;
        }
      }

      h2 {
        color: var(--color-accent);
        font-family: var(--font-display);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      ul {
        background-color: var(--color-box-background);
        padding: 1rem;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        list-style: disc;
        padding-left: 1.25rem;
      }

      .icon {
        display: inline;
        height: 2em;
        width: 2em;
        vertical-align: top;
        fill: currentColor;
      }
    `
    ];
} 