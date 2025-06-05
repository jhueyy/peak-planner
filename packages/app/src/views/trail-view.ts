import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { View, define } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../message";

export class TrailViewElement extends View<Model, Msg> {
    static styles = css`
    section {
      padding: 1rem;
    }

    h2 {
      font-size: 1.8rem;
    }

    ul {
      list-style: disc;
      padding-left: 1.5rem;
    }
  `;

    constructor() {
        super("app:model");
    }

    @state()
    get trail() {
        return this.model.trail;
    }

    connectedCallback(): void {
        super.connectedCallback();

        const path = window.location.pathname;
        const match = path.match(/\/app\/trails\/([^/]+)/);
        if (match) {
            this.dispatchMessage(["trail/select", { trailid: match[1] }]);
        }
    }

    render() {
        if (!this.trail) {
            return html`<p>Loading trail...</p>`;
        }

        return html`
      <section>
        <h2>${this.trail.name}</h2>
        <p><strong>Difficulty:</strong> ${this.trail.difficulty}</p>
        <p><strong>Park:</strong> ${this.trail.park}</p>
        <p><strong>Tags:</strong> ${this.trail.tags.join(", ")}</p>

        <h3>Reviews:</h3>
        <ul>
          ${this.trail.reviews.map((review) => html`<li>${review}</li>`)}
        </ul>
      </section>
    `;
    }
}

define({ "trail-view": TrailViewElement });
