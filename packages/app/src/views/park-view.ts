// packages/app/src/views/park-view.ts
import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { define, View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../message";
import { Park } from "server/models";

export class ParkViewElement extends View<Model, Msg> {
  static styles = css`
    :host {
      display: block;
      height: 100vh;              /* ← span full height */
      padding: 1rem;
      font-family: var(--font-body);
      background-color: var(--color-background);
      box-sizing: border-box;
    }
    article {
      display: flex;
      flex-direction: column;
      height: 100%;
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

  @property({ attribute: "park-id" }) parkId?: string;
  @state() get park(): Park | undefined {
    return this.model.park;
  }

  constructor() {
    super("app:model");
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "park-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["park/select", { parkid: newValue }]);
    }
  }

  override render() {
    if (!this.park) {
      return html`<p>Loading park data…</p>`;
    }
    const { name, description, trails } = this.park;
    return html`
      <article>
        <h2>${name}</h2>
        <div class="field">
          <strong>Description:</strong>
          <p>${description}</p>
        </div>
        <div class="field">
          <strong>Trails in this Park:</strong>
          ${trails && trails.length > 0
        ? html`<ul>
                ${trails.map(
          (trailID) => html`<li><a href="/app/trails/${trailID}">${trailID}</a></li>`
        )}
              </ul>`
        : html`<p>No trails listed.</p>`}
        </div>
      </article>
    `;
  }
}

define({ "park-view": ParkViewElement });
