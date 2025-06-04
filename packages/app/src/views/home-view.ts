import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import "../components/peak-wrapper";
import reset from "../styles/reset.css.ts";
import page from "../styles/page.css.ts";

@customElement("home-view")
export class HomeViewElement extends LitElement {
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

    render() {
        return html`
      <main class="page-grid">
        <p>Explore hiking trails, parks, viewpoints, and more!</p>

        <peak-wrapper src="/data/featured.json"></peak-wrapper>
        

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
            <li><a href="/app/reviews/madonna-review">"Great city views from Madonna!"</a></li>
            <li><a href="/app/reviews/bishop-review">"Challenging hike with a rewarding summit."</a></li>
          </ul>
        </section>
      </main>
    `;
    }
}
