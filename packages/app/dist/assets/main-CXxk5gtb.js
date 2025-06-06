import{a as k,i as w,O as A,b as s,x as l,e as q,r as h,n as u,d as c,V as y,h as $,f as B,s as G,_ as Y}from"./state-DeUn7hQt.js";const H={featured:[]};function J(o,e,t){switch(o[0]){case"profile/select":{const{userid:a}=o[1];K({userid:a},t).then(r=>{r&&e(i=>({...i,profile:r}))});break}case"trail/select":{const{trailid:a}=o[1];Q({trailid:a},t).then(r=>{r&&e(i=>({...i,trail:r}))});break}case"trail/save":{const{trailid:a,updated:r,onSuccess:i,onFailure:n}=o[1];fetch(`/api/trails/${a}`,{method:"PUT",headers:{"Content-Type":"application/json",...k.headers(t)},body:JSON.stringify(r)}).then(d=>{if(!d.ok)throw new Error(`Failed to save trail ${a}`);return d.json()}).then(d=>{if(d){const U=d;e(F=>({...F,trail:U}))}}).then(()=>{i&&i()}).catch(d=>{n&&n(d)});break}case"park/select":{const{parkid:a}=o[1];X({parkid:a},t).then(r=>{r&&e(i=>({...i,park:r}))});break}case"home/load":{fetch("/data/featured.json").then(a=>a.json()).then(a=>e(r=>({...r,featured:a})));break}default:{const a=o[0];throw new Error(`Unhandled message: ${a}`)}}}function K({userid:o},e){return fetch(`/api/travelers/${o}`,{headers:k.headers(e)}).then(t=>t.ok?t.json():void 0)}function Q({trailid:o},e){return fetch(`/api/trails/${o}`,{headers:k.headers(e)}).then(t=>t.ok?t.json():void 0)}function X({parkid:o},e){return fetch(`/api/parks/${o}`,{headers:k.headers(e)}).then(t=>t.ok?t.json():void 0)}var Z=Object.defineProperty,T=(o,e,t,a)=>{for(var r=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(e,t,r)||r);return r&&Z(e,t,r),r};const C=class C extends w{constructor(){super(...arguments),this._authObserver=new A(this,"app:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{const{user:t}=e;this.loggedIn=!!(t&&t.authenticated),this.userid=t==null?void 0:t.username})}render(){return l`
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
          ${this.loggedIn?l`
                <span>Hello, ${this.userid}</span>
                <button @click=${this.handleSignOut}>Sign Out</button>
              `:l`<a href="/login.html" @click=${this.navigateToLogin}>Sign In…</a>`}
        </nav>
      </header>
    `}toggleDarkMode(e){const a=e.target.checked;document.body.classList.toggle("dark-mode",a)}handleSignOut(e){q.relay(e,"auth:message",["auth/signout"])}navigateToLogin(e){e.preventDefault(),window.location.href="/login.html"}};C.styles=s`
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
`;let g=C;T([h()],g.prototype,"loggedIn");T([h()],g.prototype,"userid");const I={styles:s`
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
  `};var W=Object.defineProperty,L=(o,e,t,a)=>{for(var r=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(e,t,r)||r);return r&&W(e,t,r),r};const O=class O extends w{constructor(){super(...arguments),this.icon="",this.heading=""}render(){return l`
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
    `}};O.styles=[I.styles,s`
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
    `];let f=O;L([u()],f.prototype,"icon");L([u()],f.prototype,"heading");var E=Object.defineProperty,z=(o,e,t,a)=>{for(var r=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(e,t,r)||r);return r&&E(e,t,r),r};const S=class S extends w{constructor(){super(...arguments),this.data=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}hydrate(e){fetch(e).then(t=>t.json()).then(t=>{this.data=t})}render(){return l`
      ${this.data.map(e=>l`
          <peak-feature icon="${e.icon}" heading="${e.heading}">
            ${e.items.map(t=>l`<li><a href="${t.href}">${t.label}</a></li>`)}
          </peak-feature>
        `)}
    `}};S.styles=s`
    :host {
      display: block;
      grid-column: span 6;
    }

    @media (max-width: 799px) {
      :host {
        grid-column: span 12;
      }
    }
  `;let p=S;z([u()],p.prototype,"src");z([h()],p.prototype,"data");c({"peak-wrapper":p});const V=s`
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
`,_=class _ extends y{constructor(){super("app:model")}render(){return l`
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
    `}};_.styles=[I.styles,V,s`
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
    `];let x=_;c({"home-view":x});var ee=Object.defineProperty,re=Object.getOwnPropertyDescriptor,M=(o,e,t,a)=>{for(var r=a>1?void 0:a?re(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(a?n(e,t,r):n(r))||r);return a&&r&&ee(e,t,r),r};const P=class P extends y{get trail(){return this.model.trail}constructor(){super("app:model")}attributeChangedCallback(e,t,a){super.attributeChangedCallback(e,t,a),e==="trail-id"&&t!==a&&a&&this.dispatchMessage(["trail/select",{trailid:a}])}render(){if(!this.trail)return l`<p>Loading trail data…</p>`;const{name:e,difficulty:t,tags:a,reviews:r,park:i}=this.trail;return l`
      <article>
        <h2>${e}</h2>
        <div class="field">
          <strong>Park:</strong>
          <a href="/app/parks/${i}">${i}</a>
        </div>
        <div class="field">
          <strong>Difficulty:</strong> ${t}
        </div>
        <div class="field">
          <strong>Tags:</strong>
          ${a&&a.length>0?l`<ul>
                ${a.map(n=>l`<li>${n}</li>`)}
              </ul>`:l`<span>None</span>`}
        </div>
        <div class="field">
          <strong>Reviews:</strong>
          ${r&&r.length>0?l`<ul>
                ${r.map(n=>l`<li>${n}</li>`)}
              </ul>`:l`<span>No reviews yet.</span>`}
        </div>
        <!-- Push button to bottom by giving the parent flex-grow -->
        <button
          @click=${()=>$.dispatch(this,"history/navigate",{href:`/app/trails/${this.trailId}/edit`})}
        >
          Edit this Trail
        </button>
      </article>
    `}};P.styles=s`
    /* 1) Let the host fill its parent’s height: */
    :host {
      display: block;
      height: 100%;            /* ← make it stretch vertically */
      padding: 1rem;
      font-family: var(--font-body);
      background-color: var(--color-background);
      box-sizing: border-box;  /* ensure padding is included in height */
    }

    /* 2) If you want the <article> inside to also fill 100%: */
    article {
      display: flex;
      flex-direction: column;
      height: 100vh;
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

    /* BUTTON STYLES */
    button {
      margin-top: auto;       /* push the button to the bottom */
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: var(--color-primary);
      color: black;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:hover {
      opacity: 0.9;
    }
    :host-context(.dark-mode) {
      background-color: var(--color-background-dark, #1e1e1e);
      color: var(--color-text-dark, #f0f0f0);
    }
    /* In dark mode, make button text white: */
    :host-context(.dark-mode) button {
      color: white;
    }
  `;let m=P;M([u({attribute:"trail-id"})],m.prototype,"trailId",2);M([h()],m.prototype,"trail",1);c({"trail-view":m});var te=Object.defineProperty,ae=Object.getOwnPropertyDescriptor,N=(o,e,t,a)=>{for(var r=a>1?void 0:a?ae(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(a?n(e,t,r):n(r))||r);return a&&r&&te(e,t,r),r};const j=class j extends y{get park(){return this.model.park}constructor(){super("app:model")}attributeChangedCallback(e,t,a){super.attributeChangedCallback(e,t,a),e==="park-id"&&t!==a&&a&&this.dispatchMessage(["park/select",{parkid:a}])}render(){if(!this.park)return l`<p>Loading park data…</p>`;const{name:e,description:t,trails:a}=this.park;return l`
      <article>
        <h2>${e}</h2>
        <div class="field">
          <strong>Description:</strong>
          <p>${t}</p>
        </div>
        <div class="field">
          <strong>Trails in this Park:</strong>
          ${a&&a.length>0?l`<ul>
                ${a.map(r=>l`<li><a href="/app/trails/${r}">${r}</a></li>`)}
              </ul>`:l`<p>No trails listed.</p>`}
        </div>
      </article>
    `}};j.styles=s`
    :host {
      display: block;
      height: 100vh;              /* ← span full height */
      padding: 1rem;
      font-family: var(--font-body);
      background-color: var(--color-background);
      box-sizing: border-box;
    }
    article {
      display: flex;
      flex-direction: column;
      height: 100%;
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
  `;let b=j;N([u({attribute:"park-id"})],b.prototype,"parkId",2);N([h()],b.prototype,"park",1);c({"park-view":b});var oe=Object.defineProperty,ie=Object.getOwnPropertyDescriptor,R=(o,e,t,a)=>{for(var r=a>1?void 0:a?ie(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(a?n(e,t,r):n(r))||r);return a&&r&&oe(e,t,r),r};c({"mu-form":B.Element});const D=class D extends y{get trail(){return this.model.trail}constructor(){super("app:model")}attributeChangedCallback(e,t,a){super.attributeChangedCallback(e,t,a),e==="trail-id"&&t!==a&&a&&this.dispatchMessage(["trail/select",{trailid:a}])}handleSubmit(e){e.preventDefault();const t=e.detail;this.dispatchMessage(["trail/save",{trailid:this.trailId,updated:t,onSuccess:()=>{$.dispatch(this,"history/navigate",{href:`/app/trails/${this.trailId}`})},onFailure:a=>console.error("Failed to save trail:",a)}])}render(){return this.trail?l`
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
            Tags (comma-separated):
            <input type="text" name="tags" .value=${this.trail.tags.join(",")} />
          </label>
          <label>
            Reviews (comma-separated):
            <input type="text" name="reviews" .value=${this.trail.reviews.join(",")} />
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
    `:l`<p>Loading trail for editing…</p>`}};D.styles=s`
    :host {
      display: block;
      height: 100%;             /* ← full height */
      padding: 1rem;
      font-family: var(--font-body);
      background-color: var(--color-background);
      box-sizing: border-box;
    }
    article {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    h2 {
      margin-bottom: 0.75rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      flex: 1 1 auto;           /* allow form to grow if needed */
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
    button {
      margin-top: auto;         /* pin “Save” to bottom of article */
      padding: 0.6rem 1rem;
      font-size: 1rem;
      background-color: var(--color-primary);
      color: black;
      border: none;
      border-radius: 4px;
      cursor: pointer;
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
    :host-context(.dark-mode) {
      background-color: var(--color-background-dark, #1e1e1e);
      color: var(--color-text-dark, #f0f0f0);
    }
    :host-context(.dark-mode) button {
      color: white;
    }
  `;let v=D;R([u({attribute:"trail-id"})],v.prototype,"trailId",2);R([h()],v.prototype,"trail",1);c({"trail-edit-view":v});const ne=[{path:"/app/trails/:id/edit",view:o=>l`
          <trail-edit-view trail-id=${o.id}></trail-edit-view>
        `},{path:"/app/trails/:id",view:o=>l`
        <trail-view trail-id=${o.id}></trail-view>
      `},{path:"/app/parks/:id",view:o=>l`
        <park-view park-id=${o.id}></park-view>
      `},{path:"/app",view:()=>l`<home-view></home-view>`},{path:"/",redirect:"/app"}];c({"mu-history":$.Provider,"mu-auth":k.Provider,"mu-switch":class extends Y.Element{constructor(){super(ne,"app:history","app:auth")}},"mu-store":class extends G.Provider{constructor(){super(J,H,"app:auth")}},"peak-header":g,"peak-wrapper":p,"peak-feature":f});
