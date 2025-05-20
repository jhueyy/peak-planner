import{a as c,i as u,r as p,x as f,b as m,n as d}from"./reset.css-BFLXKToI.js";const g={styles:c`
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading, sans-serif);
      color: var(--color-heading, #222);
      margin-top: 0;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
  `};var b=Object.defineProperty,a=(h,e,t,r)=>{for(var o=void 0,n=h.length-1,l;n>=0;n--)(l=h[n])&&(o=l(e,t,o)||o);return o&&b(e,t,o),o};const i=class i extends u{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return f`
      <form
        @change=${e=>this.handleChange(e)}
        @submit=${e=>this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(e){const t=e.target,r=t==null?void 0:t.name,o=t==null?void 0:t.value;this.formData={...this.formData,[r]:o}}handleSubmit(e){e.preventDefault(),console.log("🔁 SUBMIT triggered"),console.log("🔒 Form data:",this.formData),this.canSubmit?fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(console.log("📡 Got response:",t.status),t.status!==200&&t.status!==201)throw new Error("Register/Login failed");return t.json()}).then(({token:t})=>{console.log("✅ Received token:",t);const r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:t,redirect:this.redirect}]});console.log("📢 Dispatching auth:message event",r),this.dispatchEvent(r)}).catch(t=>{console.error("❌ ERROR:",t),this.error=t.toString()}):console.warn("⚠️ Cannot submit — missing data")}};i.styles=[p.styles,g.styles,c`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `];let s=i;a([m()],s.prototype,"formData");a([d()],s.prototype,"api");a([d()],s.prototype,"redirect");a([m()],s.prototype,"error");export{s as L};
