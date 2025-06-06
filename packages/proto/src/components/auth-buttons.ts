// src/components/auth-buttons.ts
import { html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer, Events } from "@calpoly/mustang";

export class HeaderButtons extends LitElement {
  @state()
  loggedIn = false;

  @state()
  user?: string;

  private _auth = new Observer<Auth.Model>(this, "app:auth");

  connectedCallback() {
    super.connectedCallback();
    this._auth.observe((auth) => {
      const { user } = auth;
      this.loggedIn = !!(user && user.authenticated);
      this.user = user?.username;
    });
  }

  render() {
    return html`
      ${this.loggedIn ? this.renderSignOut() : this.renderSignIn()}
    `;
  }

  renderSignIn() {
    return html`<a href="/login.html">Sign In</a>`;
  }

  renderSignOut() {
    return html`
      <a href="#" @click=${this.signOut}>Sign Out (${this.user})</a>
    `;
  }

  signOut(event: Event) {
    event.preventDefault();
    Events.relay(event, "auth:message", ["auth/signout"]);
  }
}
