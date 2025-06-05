import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { define } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../message";

export class ParkViewElement extends View<Model, Msg> {
    static styles = css`
    section {
      padding: 1rem;
    }

    h2 {
      font-size: 1.8rem;
    }
  `;

    constructor() {
        super("app:model");
    }

    @state()
    get park() {
        return this.model.park;
    }

    connectedCallback(): void {
        super.connectedCallback();

        const path = window.location.pathname;
        const match = path.match(/\/app\/parks\/([^/]+)/);
        if (match) {
            this.dispatchMessage(["park/select", { parkid: match[1] }]);
        }
    }

    render() {
        if (!this.park) {
            return html`<p>Loading park...</p>`;
        }

        return html`
      <section>
        <h2>${this.park.name}</h2>
        <p>${this.park.description}</p>
        <h3>Trails:</h3>
        <ul>
          ${this.park.trails.map(
            (trail) => html`<li><a href="/app/trails/${trail}">${trail}</a></li>`
        )}
        </ul>
      </section>
    `;
    }
}

define({ "park-view": ParkViewElement });
