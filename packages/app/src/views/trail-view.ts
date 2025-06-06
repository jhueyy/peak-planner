// packages/app/src/views/trail-view.ts
import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { View, define, History } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../message";
import { Trail } from "server/models";

export class TrailViewElement extends View<Model, Msg> {
  static styles = css`
    /* 1) Let the host fill its parent’s height: */
    :host {
      display: block;
      height: 100%;            /* ← make it stretch vertically */
      padding: 1rem;
      font-family: var(--font-body);
      background-color: var(--color-background);
      box-sizing: border-box;  /* ensure padding is included in height */
    }

    /* 2) If you want the <article> inside to also fill 100%: */
    article {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    h2 {
      margin-bottom: 0.5rem;
    }

    .field {
      margin: 0.5rem 0;
    }

    ul {
      margin: 0.5rem 0 0 1.25rem;
    }

    li {
      margin-bottom: 0.25rem;
    }

    a {
      color: var(--color-primary);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    /* BUTTON STYLES */
    button {
      margin-top: auto;       /* push the button to the bottom */
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: var(--color-primary);
      color: black;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:hover {
      opacity: 0.9;
    }
    :host-context(.dark-mode) {
      background-color: var(--color-background-dark, #1e1e1e);
      color: var(--color-text-dark, #f0f0f0);
    }
    /* In dark mode, make button text white: */
    :host-context(.dark-mode) button {
      color: white;
    }
  `;

  @property({ attribute: "trail-id" }) trailId?: string;
  @state() get trail(): Trail | undefined {
    return this.model.trail;
  }

  constructor() {
    super("app:model");
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "trail-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["trail/select", { trailid: newValue }]);
    }
  }

  override render() {
    if (!this.trail) {
      return html`<p>Loading trail data…</p>`;
    }
    const { name, difficulty, tags, reviews, park } = this.trail;

    return html`
      <article>
        <h2>${name}</h2>
        <div class="field">
          <strong>Park:</strong>
          <a href="/app/parks/${park}">${park}</a>
        </div>
        <div class="field">
          <strong>Difficulty:</strong> ${difficulty}
        </div>
        <div class="field">
          <strong>Tags:</strong>
          ${tags && tags.length > 0
        ? html`<ul>
                ${tags.map((t) => html`<li>${t}</li>`)}
              </ul>`
        : html`<span>None</span>`}
        </div>
        <div class="field">
          <strong>Reviews:</strong>
          ${reviews && reviews.length > 0
        ? html`<ul>
                ${reviews.map((r) => html`<li>${r}</li>`)}
              </ul>`
        : html`<span>No reviews yet.</span>`}
        </div>
        <!-- Push button to bottom by giving the parent flex-grow -->
        <button
          @click=${() =>
        History.dispatch(this, "history/navigate", {
          href: `/app/trails/${this.trailId}/edit`,
        })}
        >
          Edit this Trail
        </button>
      </article>
    `;
  }
}

define({ "trail-view": TrailViewElement });
