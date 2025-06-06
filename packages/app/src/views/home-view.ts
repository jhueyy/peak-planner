// packages/app/src/views/home-view.ts

import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { define, View } from "@calpoly/mustang";

import { Model } from "../model";
import { Msg } from "../message";

// We will wrap each “featured” section in a <peak-wrapper> component,
// so make sure that component file has already been defined/registered.
import "../components/peak-wrapper";

// Import any CSS modules you need (these paths assume you have 
// reset.css.ts and page.css.ts under src/styles)
import reset from "../styles/reset.css.ts";
import page from "../styles/page.css.ts";

export class HomeViewElement extends View<Model, Msg> {
  static styles = [
    reset.styles,
    page,
    css`
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 100%;
        font-family: var(--font-body);
        background-color: var(--color-background);
      }

      p {
        text-align: center;
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }

      :host-context(.dark-mode) {
        background-color: var(--color-background-dark, #1e1e1e);
        color: var(--color-text-dark, #f0f0f0);
      }

      /* You can add any other local styles here */
    `
  ];

  constructor() {
    // This “app:model” string must exactly match provides="app:model" in index.html
    super("app:model");
  }

  override connectedCallback() {
    // Always call super.connectedCallback() first
    super.connectedCallback();

    // Dispatch the “home/load” message so update.ts can fetch /data/featured.json
    this.dispatchMessage(["home/load", {}]);
  }

  // Expose `featured` from the Model as a reactive @state property.
  @state()
  get featured() {
    // If the model has no `featured` yet, default to an empty array
    return this.model.featured ?? [];
  }

  override render() {
    return html`
      <main class="page-grid">
        <p>Explore hiking trails, parks, viewpoints, and more!</p>

        ${this.featured.map(
      (section) => html`
            <peak-wrapper
              .icon=${section.icon}
              .heading=${section.heading}
              .items=${section.items}
            ></peak-wrapper>
          `
    )}

        <!--
          If you want static links to other “features” (e.g. Parks / Difficulty / Reviews),
          you can include them here. Example:
        -->
        <section class="feature">
          <h2>
            <svg class="icon"><use href="/icons/hiking.svg#icon-trail"></use></svg>
            Parks
          </h2>
          <ul>
            <li>
              <a href="/app/parks/slo-open-space">SLO Open Space</a>
            </li>
          </ul>
        </section>

        <section class="feature">
          <h2>
            <svg class="icon"><use href="/icons/hiking.svg#icon-pickaxe"></use></svg>
            Difficulty Levels
          </h2>
          <ul>
            <li><a href="/app/difficulty/moderate">Moderate</a></li>
            <li><a href="/app/difficulty/hard">Hard</a></li>
          </ul>
        </section>

        <section class="feature">
          <h2>
            <svg class="icon"><use href="/icons/hiking.svg#icon-bonfire"></use></svg>
            Tags
          </h2>
          <ul>
            <li><a href="/app/tags/view">Great Views</a></li>
            <li><a href="/app/tags/sunset">Sunset Spot</a></li>
          </ul>
        </section>

        <section class="feature">
          <h2>
            <svg class="icon"><use href="/icons/hiking.svg#icon-mountain"></use></svg>
            Reviews
          </h2>
          <ul>
            <li>
              <a href="/app/reviews/madonna-review">
                "Great city views from Madonna!"
              </a>
            </li>
            <li>
              <a href="/app/reviews/bishop-review">
                "Challenging hike with a rewarding summit."
              </a>
            </li>
          </ul>
        </section>
      </main>
    `;
  }
}

// This registers the tag <home-view> so that <mu-switch> can use it.
define({ "home-view": HomeViewElement });
