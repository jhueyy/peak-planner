import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { define, View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../message";

import "../components/peak-wrapper";
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
    `
    ];

    constructor() {
        super("app:model"); // Must match <mu-store provides="app:model">
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage(["home/load", {}]); // Triggers data fetch
    }

    @state()
    get featured() {
        return this.model.featured ?? [];
    }

    render() {
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

        <section class="feature">
          <h2>
            <svg class="icon">
              <use href="/icons/hiking.svg#icon-trail"></use>
            </svg>
            Parks
          </h2>
          <ul>
            <li><a href="/app/parks/slo-open-space">SLO Open Space</a></li>
          </ul>
        </section>

        <section class="feature">
          <h2>
            <svg class="icon">
              <use href="/icons/hiking.svg#icon-pickaxe"></use>
            </svg>
            Difficulty Levels
          </h2>
          <ul>
            <li><a href="/app/difficulty/moderate">Moderate</a></li>
            <li><a href="/app/difficulty/hard">Hard</a></li>
          </ul>
        </section>

        <section class="feature">
          <h2>
            <svg class="icon">
              <use href="/icons/hiking.svg#icon-bonfire"></use>
            </svg>
            Tags
          </h2>
          <ul>
            <li><a href="/app/tags/view">Great Views</a></li>
            <li><a href="/app/tags/sunset">Sunset Spot</a></li>
          </ul>
        </section>

        <section class="feature">
          <h2>
            <svg class="icon">
              <use href="/icons/hiking.svg#icon-mountain"></use>
            </svg>
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

define({ "home-view": HomeViewElement });
