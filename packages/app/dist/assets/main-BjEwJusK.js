import{a as k,i as w,O as A,b as l,x as s,e as B,r as h,n as u,d as c,V as y,h as $,f as Y,s as q,_ as G}from"./state-DeUn7hQt.js";const H={featured:[]};function J(o,r,e){switch(o[0]){case"profile/select":{const{userid:a}=o[1];K({userid:a},e).then(t=>{t&&r(i=>({...i,profile:t}))});break}case"trail/select":{const{trailid:a}=o[1];Q({trailid:a},e).then(t=>{t&&r(i=>({...i,trail:t}))});break}case"trail/save":{const{trailid:a,updated:t,onSuccess:i,onFailure:n}=o[1];fetch(`/api/trails/${a}`,{method:"PUT",headers:{"Content-Type":"application/json",...k.headers(e)},body:JSON.stringify(t)}).then(d=>{if(!d.ok)throw new Error(`Failed to save trail ${a}`);return d.json()}).then(d=>{if(d){const U=d;r(F=>({...F,trail:U}))}}).then(()=>{i&&i()}).catch(d=>{n&&n(d)});break}case"park/select":{const{parkid:a}=o[1];X({parkid:a},e).then(t=>{t&&r(i=>({...i,park:t}))});break}case"home/load":{fetch("/data/featured.json").then(a=>a.json()).then(a=>r(t=>({...t,featured:a})));break}default:{const a=o[0];throw new Error(`Unhandled message: ${a}`)}}}function K({userid:o},r){return fetch(`/api/travelers/${o}`,{headers:k.headers(r)}).then(e=>e.ok?e.json():void 0)}function Q({trailid:o},r){return fetch(`/api/trails/${o}`,{headers:k.headers(r)}).then(e=>e.ok?e.json():void 0)}function X({parkid:o},r){return fetch(`/api/parks/${o}`,{headers:k.headers(r)}).then(e=>e.ok?e.json():void 0)}var Z=Object.defineProperty,D=(o,r,e,a)=>{for(var t=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(t=n(r,e,t)||t);return t&&Z(r,e,t),t};const O=class O extends w{constructor(){super(...arguments),this._authObserver=new A(this,"app:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(r=>{const{user:e}=r;this.loggedIn=!!(e&&e.authenticated),this.userid=e==null?void 0:e.username})}render(){return s`
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
              `:s`<a href="/login.html" @click=${this.navigateToLogin}>Sign In…</a>`}
        </nav>
      </header>
    `}toggleDarkMode(r){const a=r.target.checked;document.body.classList.toggle("dark-mode",a)}handleSignOut(r){B.relay(r,"auth:message",["auth/signout"])}navigateToLogin(r){r.preventDefault(),window.location.href="/login.html"}};O.styles=l`
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
`;let g=O;D([h()],g.prototype,"loggedIn");D([h()],g.prototype,"userid");const I={styles:l`
    /* Reset CSS */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      display: block;
    }

    body {
      margin: 0;
      font-family: var(--font-body, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif);
      line-height: 1.5;
      color: var(--color-text, #333);
      background-color: var(--color-background, #fff);
    }

    a {
      color: var(--color-link, #0066cc);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    button {
      cursor: pointer;
    }
  `};var W=Object.defineProperty,L=(o,r,e,a)=>{for(var t=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(t=n(r,e,t)||t);return t&&W(r,e,t),t};const C=class C extends w{constructor(){super(...arguments),this.icon="",this.heading=""}render(){return s`
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
    `}};C.styles=[I.styles,l`
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
    `];let f=C;L([u()],f.prototype,"icon");L([u()],f.prototype,"heading");var E=Object.defineProperty,M=(o,r,e,a)=>{for(var t=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(t=n(r,e,t)||t);return t&&E(r,e,t),t};const S=class S extends w{constructor(){super(...arguments),this.data=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}hydrate(r){fetch(r).then(e=>e.json()).then(e=>{this.data=e})}render(){return s`
      ${this.data.map(r=>s`
          <peak-feature icon="${r.icon}" heading="${r.heading}">
            ${r.items.map(e=>s`<li><a href="${e.href}">${e.label}</a></li>`)}
          </peak-feature>
        `)}
    `}};S.styles=l`
    :host {
      display: block;
      grid-column: span 6;
    }

    @media (max-width: 799px) {
      :host {
        grid-column: span 12;
      }
    }
  `;let p=S;M([u()],p.prototype,"src");M([h()],p.prototype,"data");c({"peak-wrapper":p});const V=l`
@import url('./tokens.css');

body {
  background-color: var(--color-background-page);
  color: var(--color-text-default);
  font-family: var(--font-body);
}

header {
  background-color: var(--color-background-header);
  color: var(--color-text-header);
  font-family: var(--font-display);
  padding: 1rem;
}

a {
  color: var(--color-accent);
}

h1, h2 {
  color: var(--color-accent);
  font-family: var(--font-display);
}

ul {
  background-color: var(--color-box-background);
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

svg.icon {
  display: inline;
  height: 2em;
  width: 2em;
  vertical-align: top;
  fill: currentColor;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-background-header);
  color: var(--color-text-header);
}

.branding h1 {
  font-size: 1.5rem;
  font-family: var(--font-display);
}

.main-nav a {
  margin-left: 1rem;
  color: var(--color-text-header);
  text-decoration: none;
  font-family: var(--font-body);
  font-weight: bold;
}


.page-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
  padding: 1rem 2rem;
  min-height: 100%;
  
}


.page-grid > p {
  grid-column: 2 / span 10;
}

.feature {
  grid-column: span 6;
  background-color: var(--color-box-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}


@media (min-width: 800px) {
  .feature {
    grid-column: span 6;
  }
}


@media (max-width: 799px) {
  .feature {
    grid-column: span 12;
  }
}
`,_=class _ extends y{constructor(){super("app:model")}render(){return s`
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
        <h2>Difficulty Levels</h2>
        <ul>
          <li>Moderate</li>
          <li>Hard</li>
        </ul>
      </section>


        <!-- ================================
             Static “Tags” section
        ================================= -->
        <section class="feature">
        <h2>Tags</h2>
        <ul>
          <li>Great Views</li>
          <li>Sunset Spot</li>
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
    `}};_.styles=[I.styles,V,l`
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
    `];let x=_;c({"home-view":x});var rr=Object.defineProperty,er=Object.getOwnPropertyDescriptor,N=(o,r,e,a)=>{for(var t=a>1?void 0:a?er(r,e):r,i=o.length-1,n;i>=0;i--)(n=o[i])&&(t=(a?n(r,e,t):n(t))||t);return a&&t&&rr(r,e,t),t};const P=class P extends y{get trail(){return this.model.trail}constructor(){super("app:model")}attributeChangedCallback(r,e,a){super.attributeChangedCallback(r,e,a),r==="trail-id"&&e!==a&&a&&this.dispatchMessage(["trail/select",{trailid:a}])}render(){if(!this.trail)return s`<p>Loading trail data…</p>`;const{name:r,difficulty:e,tags:a,reviews:t,park:i}=this.trail;return s`
      <article>
        <h2>${r}</h2>

        <div class="field">
          <strong>Park:</strong>
          <a href="/app/parks/${i}">${i}</a>
        </div>

        <div class="field">
          <strong>Difficulty:</strong> ${e}
        </div>

        <div class="field">
          <strong>Tags:</strong>
          ${a&&a.length>0?s`
                <ul>
                  ${a.map(n=>s`<li>${n}</li>`)}
                </ul>
              `:s`<span>None</span>`}
        </div>

        <div class="field">
          <strong>Reviews:</strong>
          ${t&&t.length>0?s`
                <ul>
                  ${t.map(n=>s`<li>${n}</li>`)}
                </ul>
              `:s`<span>No reviews yet.</span>`}
        </div>

        <!-- “Edit this Trail” button (now visible) -->
        <button
          @click=${()=>$.dispatch(this,"history/navigate",{href:`/app/trails/${this.trailId}/edit`})}
        >
          Edit this Trail
        </button>
      </article>
    `}};P.styles=l`
    :host {
      display: block;
      padding: 1rem;
      font-family: var(--font-body);
      background-color: var(--color-background);
    }

    h2 {
      margin-bottom: 0.5rem;
    }

    .field {
      margin: 0.5rem 0;
    }

    ul {
      margin: 0.5rem 0 0 1.25rem;
    }

    li {
      margin-bottom: 0.25rem;
    }

    a {
      color: var(--color-primary);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    /***** BUTTON STYLES *****/
    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: var(--color-primary);
      /* In light‐mode, we use black text for contrast */
      color: black;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    button:hover {
      opacity: 0.9;
    }

    /* In dark‐mode, override so the button text becomes white */
    :host-context(.dark-mode) button {
      /* If your primary color is still fine in dark mode, keep it.
         Otherwise you could use a slightly lighter/darker variant. */
      background-color: var(--color-primary);
      color: white;
    }

    :host-context(.dark-mode) {
      background-color: var(--color-background-dark, #1e1e1e);
      color: var(--color-text-dark, #f0f0f0);
    }
  `;let m=P;N([u({attribute:"trail-id"})],m.prototype,"trailId",2);N([h()],m.prototype,"trail",1);c({"trail-view":m});var tr=Object.defineProperty,ar=Object.getOwnPropertyDescriptor,z=(o,r,e,a)=>{for(var t=a>1?void 0:a?ar(r,e):r,i=o.length-1,n;i>=0;i--)(n=o[i])&&(t=(a?n(r,e,t):n(t))||t);return a&&t&&tr(r,e,t),t};const j=class j extends y{get park(){return this.model.park}constructor(){super("app:model")}attributeChangedCallback(r,e,a){super.attributeChangedCallback(r,e,a),r==="park-id"&&e!==a&&a&&this.dispatchMessage(["park/select",{parkid:a}])}render(){if(!this.park)return s`<p>Loading park data…</p>`;const{name:r,description:e,trails:a,id:t}=this.park;return s`
      <article>
        <h2>${r}</h2>

        <div class="field">
          <strong>Description:</strong>
          <p>${e}</p>
        </div>

        <div class="field">
          <strong>Trails in this Park:</strong>
          ${a&&a.length>0?s`
                <ul>
                  ${a.map(i=>s`
                      <li>
                        <a href="/app/trails/${i}">
                          ${i}
                        </a>
                      </li>
                    `)}
                </ul>
              `:s`<p>No trails listed.</p>`}
        </div>
      </article>
    `}};j.styles=l`
    :host {
      display: block;
      padding: 1rem;
      font-family: var(--font-body);
      background-color: var(--color-background);
    }

    h2 {
      margin-bottom: 0.5rem;
    }

    .field {
      margin: 0.5rem 0;
    }

    ul {
      margin: 0.5rem 0 0 1.25rem;
    }

    li {
      margin-bottom: 0.25rem;
    }

    a {
      color: var(--color-primary);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    :host-context(.dark-mode) {
      background-color: var(--color-background-dark, #1e1e1e);
      color: var(--color-text-dark, #f0f0f0);
    }
  `;let b=j;z([u({attribute:"park-id"})],b.prototype,"parkId",2);z([h()],b.prototype,"park",1);c({"park-view":b});var or=Object.defineProperty,ir=Object.getOwnPropertyDescriptor,R=(o,r,e,a)=>{for(var t=a>1?void 0:a?ir(r,e):r,i=o.length-1,n;i>=0;i--)(n=o[i])&&(t=(a?n(r,e,t):n(t))||t);return a&&t&&or(r,e,t),t};c({"mu-form":Y.Element});const T=class T extends y{get trail(){return this.model.trail}constructor(){super("app:model")}attributeChangedCallback(r,e,a){super.attributeChangedCallback(r,e,a),r==="trail-id"&&e!==a&&a&&this.dispatchMessage(["trail/select",{trailid:a}])}handleSubmit(r){r.preventDefault();const e=r.detail;this.dispatchMessage(["trail/save",{trailid:this.trailId,updated:e,onSuccess:()=>{$.dispatch(this,"history/navigate",{href:`/app/trails/${this.trailId}`})},onFailure:a=>{console.error("Failed to save trail:",a)}}])}render(){return this.trail?s`
      <article>
        <h2>Edit Trail: ${this.trail.name}</h2>
        <mu-form .init=${this.trail} @mu-form:submit=${this.handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" required />
          </label>

          <label>
            Difficulty:
            <input type="text" name="difficulty" required />
          </label>

          <label>
            Tags (comma‐separated):
            <input
              type="text"
              name="tags"
              .value=${this.trail.tags.join(",")}
            />
          </label>

          <label>
            Reviews (comma‐separated):
            <input
              type="text"
              name="reviews"
              .value=${this.trail.reviews.join(",")}
            />
          </label>

          <label>
            Park ID:
            <input type="text" name="park" .value=${this.trail.park} />
          </label>

          <slot name="button">
            <button type="submit">Save Changes</button>
          </slot>
        </mu-form>
      </article>
    `:s`<p>Loading trail for editing…</p>`}};T.styles=l`
    :host {
      display: block;
      padding: 1rem;
      font-family: var(--font-body);
      background-color: var(--color-background);
    }

    h2 {
      margin-bottom: 0.75rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }

    label {
      display: flex;
      flex-direction: column;
      font-weight: bold;
    }

    input {
      padding: 0.5rem;
      font-size: 1rem;
      font-family: var(--font-body);
    }

    /***** BUTTON STYLES *****/
    button {
      padding: 0.6rem 1rem;
      font-size: 1rem;
      background-color: var(--color-primary);
      /* In light‐mode, use black text for contrast */
      color: black;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    button:hover {
      opacity: 0.9;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error {
      color: var(--color-error);
    }

    /* In dark‐mode, override so the button text becomes white */
    :host-context(.dark-mode) button {
      /* keep the same background, but switch text to white */
      background-color: var(--color-primary);
      color: white;
    }

    :host-context(.dark-mode) {
      background-color: var(--color-background-dark, #1e1e1e);
      color: var(--color-text-dark, #f0f0f0);
    }
  `;let v=T;R([u({attribute:"trail-id"})],v.prototype,"trailId",2);R([h()],v.prototype,"trail",1);c({"trail-edit-view":v});const nr=[{path:"/app/trails/:id/edit",view:o=>s`
          <trail-edit-view trail-id=${o.id}></trail-edit-view>
        `},{path:"/app/trails/:id",view:o=>s`
        <trail-view trail-id=${o.id}></trail-view>
      `},{path:"/app/parks/:id",view:o=>s`
        <park-view park-id=${o.id}></park-view>
      `},{path:"/app",view:()=>s`<home-view></home-view>`},{path:"/",redirect:"/app"}];c({"mu-history":$.Provider,"mu-auth":k.Provider,"mu-switch":class extends G.Element{constructor(){super(nr,"app:history","app:auth")}},"mu-store":class extends q.Provider{constructor(){super(J,H,"app:auth")}},"peak-header":g,"peak-wrapper":p,"peak-feature":f});
