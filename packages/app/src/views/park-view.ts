import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

interface Park {
    id: string;
    name: string;
    trails: string[];
    description: string;
}

export class ParkViewElement extends LitElement {
    @property({ attribute: "park-id" }) parkId = "";
    @state() park?: Park;

    static styles = css`
    section {
      padding: 1rem;
    }
    h2 {
      font-size: 1.8rem;
    }
  `;

    async connectedCallback() {
        super.connectedCallback();
        if (this.parkId) {
            const res = await fetch(`/api/parks/${this.parkId}`);
            this.park = await res.json();
        }
    }

    render() {
        if (!this.park) return html`<p>Loading park...</p>`;
        return html`
      <section>
        <h2>${this.park.name}</h2>
        <p>${this.park.description}</p>
        <h3>Trails:</h3>
        <ul>
          ${this.park.trails.map((trail) => html`
            <li><a href="/app/trails/${trail}">${trail}</a></li>
          `)}
        </ul>
      </section>
    `;
    }
}

customElements.define("park-view", ParkViewElement);
