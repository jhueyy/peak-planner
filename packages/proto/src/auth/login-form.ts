// proto/src/auth/login-form.ts
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css.js";
import headings from "../styles/headings.css.js"

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  @state() formData: LoginFormData = {};
  @property() api?: string;
  @property() redirect: string = "/";
  @state() error?: string;

  get canSubmit(): boolean {
    return Boolean(this.api && this.formData.username && this.formData.password);
  }

  static styles = [
    reset.styles,
    headings.styles,
    css`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `
  ];

  render() {
    return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;
    this.formData = { ...this.formData, [name]: value };
  }

  handleSubmit(submitEvent: SubmitEvent) {
  submitEvent.preventDefault();

  console.log("🔁 SUBMIT triggered");
  console.log("🔒 Form data:", this.formData);

  if (this.canSubmit) {
    fetch(this.api!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.formData)
    })
      .then((res) => {
        console.log("📡 Got response:", res.status);
        if (res.status !== 200 && res.status !== 201)
          throw new Error("Register/Login failed");
        return res.json();
      })
      .then(({ token }) => {
        console.log("✅ Received token:", token);
        const customEvent = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: this.redirect }]
        });
        console.log("📢 Dispatching auth:message event", customEvent);
        this.dispatchEvent(customEvent);
      })
      .catch((err) => {
        console.error("❌ ERROR:", err);
        this.error = err.toString();
      });
  } else {
    console.warn("⚠️ Cannot submit — missing data");
  }
}

}

