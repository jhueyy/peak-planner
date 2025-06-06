// packages/app/src/views/home-view.ts

import { html, css } from "lit";
import { define, View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../message.ts";

import "../components/peak-wrapper";        // Ensure <peak-wrapper> is registered
import reset from "../styles/reset.css.ts"; // Your existing CSS modules
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

      .page-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 1rem;
        padding: 1rem;
      }

      :host-context(.dark-mode) {
        background-color: var(--color-background-dark, #1e1e1e);
        color: var(--color-text-dark, #f0f0f0);
      }

      /* You can add any other local styles here */
    `
  ];

  constructor() {
    // Must match <mu-store provides="app:model"> in index.html
    super("app:model");
  }

  override render() {
    return html`
      <!-- Top‐level grid wrapper -->
      <main class="page-grid">
        <!-- Headline text -->
        <p>Explore hiking trails, parks, viewpoints, and more!</p>

        <!-- ================================
             Featured Trails
             Tell <peak-wrapper> to fetch exactly:
               /data/featured.json
             (Which you already have under public/data/featured.json).
        ================================= -->
        <peak-wrapper src="/data/featured.json"></peak-wrapper>

        <!-- ================================
             Static “Parks” section (example)
        ================================= -->
        <section class="feature">
          <h2>
            <svg class="icon">
              <use href="/icons/hiking.svg#icon-trail"></use>
            </svg>
            Parks
          </h2>
          <ul>
            <li>
              <a href="/app/parks/slo-open-space">SLO Open Space</a>
            </li>
          </ul>
        </section>

        <!-- ================================
             Static “Difficulty Levels” section
        ================================= -->
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

        <!-- ================================
             Static “Tags” section
        ================================= -->
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

        <!-- ================================
             Static “Reviews” section
        ================================= -->
        <section class="feature">
          <h2>
            <svg class="icon">
              <use href="/icons/hiking.svg#icon-mountain"></use>
            </svg>
            Reviews
          </h2>
          <ul>
            <li>"Great city views from Madonna!"</li>
            <li>"Challenging hike with a rewarding summit."</li>
          </ul>
        </section>
      </main>
    `;
  }
}

// Register <home-view> so <mu-switch> can use it
define({ "home-view": HomeViewElement });
