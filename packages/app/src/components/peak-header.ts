import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer, Events } from "@calpoly/mustang";

export class PeakHeader extends LitElement {
 static styles = css`
  header {
    display: flex;
    align-items: center;
    background: #3c1961; /* default light background */
    color: white;
    padding: 0.75rem 1rem;
  }

  :host-context(.dark-mode) header {
    background: #1f1f1f; /* darker header in dark mode */
  }

  .branding h1 {
    font-family: "Merriweather", serif;
    color: #40c057;
    margin: 0;
    font-size: 1.5rem;
  }

  :host-context(.dark-mode) .branding h1 {
    color: #80d980;
  }

  .spacer {
    flex-grow: 1;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: bold;
  }

  nav a {
    margin-left: 1.2rem;
    text-decoration: none;
    font-weight: bold;
    color: white;
  }

  nav span {
    margin-left: 1rem;
    font-style: italic;
  }

  button {
    background: transparent;
    border: none;
    color: white;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 1rem;
  }
`;


  private _authObserver = new Observer<Auth.Model>(this, "blazing:auth");

  @state() loggedIn = false;
  @state() userid?: string;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      const { user } = auth;
      this.loggedIn = !!(user && user.authenticated);
      this.userid = user?.username;
    });
  }

  render() {
    return html`
      <header class="site-header">
        <div class="branding">
          <h1>Peak Planner</h1>
        </div>

        <span class="spacer"></span>

        <label>
          <input
            type="checkbox"
            @change=${this.toggleDarkMode}
            .checked=${document.body.classList.contains("dark-mode")}
          />
          Dark mode
        </label>

        <nav class="main-nav">
          <a href="/">Home</a>
          <a href="#">Explore</a>
          <a href="#">About</a>
          ${this.loggedIn
            ? html`
                <span>Hello, ${this.userid}</span>
                <button @click=${this.handleSignOut}>Sign Out</button>
              `
            : html`<a href="/login.html">Sign In…</a>`}
        </nav>
      </header>
    `;
  }

  toggleDarkMode(e: Event) {
    const input = e.target as HTMLInputElement;
    const isDark = input.checked;
    document.body.classList.toggle("dark-mode", isDark);
  }

  handleSignOut(e: Event) {
    Events.relay(e, "auth:message", ["auth/signout"]);
  }
}
