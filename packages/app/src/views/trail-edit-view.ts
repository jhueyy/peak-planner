// packages/app/src/views/trail-edit-view.ts
import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { define, Form, View, History } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../message";
import { Trail } from "server/models";

// 1) Ensure <mu-form> is defined:
define({ "mu-form": Form.Element });

export class TrailEditViewElement extends View<Model, Msg> {
  static styles = css`
    :host {
      display: block;
      height: 100%;             /* ← full height */
      padding: 1rem;
      font-family: var(--font-body);
      background-color: var(--color-background);
      box-sizing: border-box;
    }
    article {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    h2 {
      margin-bottom: 0.75rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      flex: 1 1 auto;           /* allow form to grow if needed */
    }
    label {
      display: flex;
      flex-direction: column;
      font-weight: bold;
    }
    input {
      padding: 0.5rem;
      font-size: 1rem;
      font-family: var(--font-body);
    }
    button {
      margin-top: auto;         /* pin “Save” to bottom of article */
      padding: 0.6rem 1rem;
      font-size: 1rem;
      background-color: var(--color-primary);
      color: black;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      opacity: 0.9;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error {
      color: var(--color-error);
    }
    :host-context(.dark-mode) {
      background-color: var(--color-background-dark, #1e1e1e);
      color: var(--color-text-dark, #f0f0f0);
    }
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

  handleSubmit(event: Form.SubmitEvent<Trail>) {
    event.preventDefault();
    const updatedData = event.detail as Partial<Trail>;
    this.dispatchMessage([
      "trail/save",
      {
        trailid: this.trailId as string,
        updated: updatedData,
        onSuccess: () => {
          History.dispatch(this, "history/navigate", {
            href: `/app/trails/${this.trailId}`,
          });
        },
        onFailure: (err: Error) => console.error("Failed to save trail:", err),
      },
    ]);
  }

  override render() {
    if (!this.trail) {
      return html`<p>Loading trail for editing…</p>`;
    }
    return html`
      <article>
        <h2>Edit Trail: ${this.trail.name}</h2>
        <mu-form .init=${this.trail} @mu-form:submit=${this.handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" required />
          </label>
          <label>
            Difficulty:
            <input type="text" name="difficulty" required />
          </label>
          <label>
            Tags (comma-separated):
            <input type="text" name="tags" .value=${this.trail.tags.join(",")} />
          </label>
          <label>
            Reviews (comma-separated):
            <input type="text" name="reviews" .value=${this.trail.reviews.join(",")} />
          </label>
          <label>
            Park ID:
            <input type="text" name="park" .value=${this.trail.park} />
          </label>
          <slot name="button">
            <button type="submit">Save Changes</button>
          </slot>
        </mu-form>
      </article>
    `;
  }
}

define({ "trail-edit-view": TrailEditViewElement });
