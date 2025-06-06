// packages/app/src/views/trail-view.ts

import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { define, View } from "@calpoly/mustang";

import { Model } from "../model";
import { Msg } from "../message";
import { Trail } from "server/models";

export class TrailViewElement extends View<Model, Msg> {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      font-family: var(--font-body);
      background-color: var(--color-background);
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

    :host-context(.dark-mode) {
      background-color: var(--color-background-dark, #1e1e1e);
      color: var(--color-text-dark, #f0f0f0);
    }
  `;

  // Bind the `trail-id` attribute to this property.
  @property({ attribute: "trail-id" })
  trailId?: string;

  // Make a reactive getter for `model.trail`
  @state()
  get trail(): Trail | undefined {
    return this.model.trail;
  }

  constructor() {
    // Must match <mu-store provides="app:model"> in index.html
    super("app:model");
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);

    // Whenever the URL param (trail-id) changes, dispatch "trail/select"
    if (name === "trail-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["trail/select", { trailid: newValue }]);
    }
  }

  override render() {
    // If the store hasn’t loaded a Trail yet, show a loading message
    if (!this.trail) {
      return html`<p>Loading trail data…</p>`;
    }

    // Once model.trail is populated, display fields exactly as defined in server/models
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
        ? html`
                <ul>
                  ${tags.map((tag) => html`<li>${tag}</li>`)}
                </ul>
              `
        : html`<span>None</span>`}
        </div>

        <div class="field">
          <strong>Reviews:</strong>
          ${reviews && reviews.length > 0
        ? html`
                <ul>
                  ${reviews.map((r) => html`<li>${r}</li>`)}
                </ul>
              `
        : html`<span>No reviews yet.</span>`}
        </div>
      </article>
    `;
  }
}

define({ "trail-view": TrailViewElement });
