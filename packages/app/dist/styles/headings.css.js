import { css } from "lit";

export default {
  styles: css`
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading, sans-serif);
      color: var(--color-heading, #222);
      margin-top: 0;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
  `
};
