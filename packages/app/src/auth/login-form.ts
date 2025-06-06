// packages/app/src/auth/login-form.ts
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

export class LoginFormElement extends LitElement {
    @state()
    formData: { username?: string; password?: string } = {};

    @property()
    api?: string;

    @property()
    redirect: string = "/";

    @state()
    error?: string;

    get canSubmit(): boolean {
        return Boolean(this.api && this.formData.username && this.formData.password);
    }

    static styles = css`
    /* (any styling you want for the form) */
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    label {
      display: flex;
      flex-direction: column;
    }
    .error {
      color: var(--color-error);
    }
  `;

    override render() {
        return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Submit</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
    }

    handleChange(event: InputEvent) {
        const target = event.target as HTMLInputElement;
        const { name, value } = target;
        this.formData = { ...this.formData, [name]: value };
    }

    handleSubmit(submitEvent: SubmitEvent) {
        submitEvent.preventDefault();
        if (!this.canSubmit) return;

        fetch(this.api || "", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.formData)
        })
            .then((res) => {
                if (res.status !== 200) throw new Error("Authentication failed");
                return res.json();
            })
            .then((json: any) => {
                const { token } = json as { token: string };
                // Dispatch a message so <mu-auth> can handle it
                const authEvent = new CustomEvent("auth:message", {
                    bubbles: true,
                    composed: true,
                    detail: ["auth/signin", { token, redirect: this.redirect }]
                });
                this.dispatchEvent(authEvent);
            })
            .catch((err: Error) => {
                this.error = err.message;
            });
    }
}

customElements.define("login-form", LoginFormElement);
