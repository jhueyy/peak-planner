import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

interface Trail {
    id: string;
    name: string;
    difficulty: string;
    tags: string[];
    reviews: string[];
    park: string;
}

export class TrailViewElement extends LitElement {
    @property({ attribute: "trail-id" }) trailId = "";
    @state() trail?: Trail;
    @state() error?: string;

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

    async connectedCallback() {
        super.connectedCallback();

        if (!this.trailId) return;

        try {
            const res = await fetch(`/api/trails/${this.trailId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Failed to load trail");
            }

            this.trail = await res.json();
        } catch (err) {
            console.error("Error loading trail:", err);
            this.error = "Unable to load trail. You may need to sign in.";
        }
    }

    render() {
        if (this.error) {
            return html`<p style="color: red;">${this.error}</p>`;
        }

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
          ${this.trail.reviews.map((r) => html`<li>${r}</li>`)}
        </ul>
      </section>
    `;
    }
}

customElements.define("trail-view", TrailViewElement);
