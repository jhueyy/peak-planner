import{i as h,x as s,r as $,a as g,n as p,O as w,e as _,b as u,d as v,c as O}from"./reset.css-BFLXKToI.js";var C=Object.defineProperty,k=(n,r,e,c)=>{for(var a=void 0,t=n.length-1,o;t>=0;t--)(o=n[t])&&(a=o(r,e,a)||a);return a&&C(r,e,a),a};const f=class f extends h{constructor(){super(...arguments),this.icon="",this.heading=""}render(){return s`
      <section class="feature">
        <h2>
          <svg class="icon">
            <use href="/icons/hiking.svg#icon-${this.icon}" />
          </svg>
          ${this.heading}
        </h2>
        <ul>
          <slot></slot>
        </ul>
      </section>
    `}};f.styles=[$.styles,g`
      :host {
        display: block;
        grid-column: span 6;
      }

      .feature {
        
        background-color: var(--color-box-background);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      @media (max-width: 799px) {
        .feature {
          grid-column: span 12;
        }
      }

      h2 {
        color: var(--color-accent);
        font-family: var(--font-display);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      ul {
        background-color: var(--color-box-background);
        padding: 1rem;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        list-style: disc;
        padding-left: 1.25rem;
      }

      .icon {
        display: inline;
        height: 2em;
        width: 2em;
        vertical-align: top;
        fill: currentColor;
      }
    `];let i=f;k([p()],i.prototype,"icon");k([p()],i.prototype,"heading");var I=Object.defineProperty,x=(n,r,e,c)=>{for(var a=void 0,t=n.length-1,o;t>=0;t--)(o=n[t])&&(a=o(r,e,a)||a);return a&&I(r,e,a),a};const b=class b extends h{constructor(){super(...arguments),this._authObserver=new w(this,"blazing:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(r=>{const{user:e}=r;this.loggedIn=!!(e&&e.authenticated),this.userid=e==null?void 0:e.username})}render(){return s`
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
          ${this.loggedIn?s`
                <span>Hello, ${this.userid}</span>
                <button @click=${this.handleSignOut}>Sign Out</button>
              `:s`<a href="/login.html">Sign In…</a>`}
        </nav>
      </header>
    `}toggleDarkMode(r){const c=r.target.checked;document.body.classList.toggle("dark-mode",c)}handleSignOut(r){_.relay(r,"auth:message",["auth/signout"])}};b.styles=g`
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
`;let d=b;x([u()],d.prototype,"loggedIn");x([u()],d.prototype,"userid");v({"peak-header":d,"peak-feature":i,"mu-auth":O.Provider});var j=Object.defineProperty,y=(n,r,e,c)=>{for(var a=void 0,t=n.length-1,o;t>=0;t--)(o=n[t])&&(a=o(r,e,a)||a);return a&&j(r,e,a),a};const m=class m extends h{constructor(){super(...arguments),this.data=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}hydrate(r){fetch(r).then(e=>e.json()).then(e=>{this.data=e})}render(){return s`
      ${this.data.map(r=>s`
          <peak-feature icon="${r.icon}" heading="${r.heading}">
            ${r.items.map(e=>s`<li><a href="${e.href}">${e.label}</a></li>`)}
          </peak-feature>
        `)}
    `}};m.styles=g`
    :host {
      display: block;
      grid-column: span 6;
    }

    @media (max-width: 799px) {
      :host {
        grid-column: span 12;
      }
    }
  `;let l=m;y([p()],l.prototype,"src");y([u()],l.prototype,"data");v({"peak-wrapper":l});
