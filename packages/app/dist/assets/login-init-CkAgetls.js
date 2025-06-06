import{i as f,b as c,x as d,r as l,n as m,d as p,a as b}from"./state-DeUn7hQt.js";var y=Object.defineProperty,s=(h,e,t,o)=>{for(var r=void 0,i=h.length-1,u;i>=0;i--)(u=h[i])&&(r=u(e,t,r)||r);return r&&y(e,t,r),r};const n=class n extends f{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return d`
      <form
        @change=${e=>this.handleChange(e)}
        @submit=${e=>this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Submit</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(e){const t=e.target,{name:o,value:r}=t;this.formData={...this.formData,[o]:r}}handleSubmit(e){e.preventDefault(),this.canSubmit&&fetch(this.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(!t.ok)throw new Error("Authentication failed");return t.json()}).then(t=>{const{token:o}=t,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:o,redirect:this.redirect}]});this.dispatchEvent(r)}).catch(t=>{this.error=t.message})}};n.styles=c`
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
  `;let a=n;s([l()],a.prototype,"formData");s([m()],a.prototype,"api");s([m()],a.prototype,"redirect");s([l()],a.prototype,"error");customElements.define("login-form",a);p({"mu-auth":b.Provider,"login-form":a});
