(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var B,we;class ct extends Error{}ct.prototype.name="InvalidTokenError";function Bs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Fs(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Bs(t)}catch{return atob(t)}}function Qe(i,t){if(typeof i!="string")throw new ct("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new ct(`Invalid token specified: missing part #${e+1}`);let r;try{r=Fs(s)}catch(n){throw new ct(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new ct(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Ys="mu:context",Gt=`${Ys}:change`;class Ws{constructor(t,e){this._proxy=Ks(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Xe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Ws(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Gt,t),t}detach(t){this.removeEventListener(Gt,t)}}function Ks(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let d=new CustomEvent(Gt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:r,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function Js(i,t){const e=ts(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function ts(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return ts(i,r.host)}class Gs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function es(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Gs(e,i))}class se{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Zs(i){return t=>({...t,...i})}const Zt="mu:auth:jwt",ss=class rs extends se{constructor(t,e){super((s,r)=>this.update(s,r),t,rs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(Xs(s)),Bt(r);case"auth/signout":return e(tr()),Bt(this._redirectForLogin);case"auth/redirect":return Bt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ss.EVENT_TYPE="auth:message";let is=ss;const ns=es(is.EVENT_TYPE);function Bt(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class Qs extends Xe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=J.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new is(this.context,this.redirect).attach(this)}}class pt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Zt),t}}class J extends pt{constructor(t){super();const e=Qe(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new J(t);return localStorage.setItem(Zt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Zt);return t?J.authenticate(t):new pt}}function Xs(i){return Zs({user:J.authenticate(i),token:i})}function tr(){return i=>{const t=i.user;return{user:t&&t.authenticated?pt.deauthenticate(t):t,token:""}}}function er(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function sr(i){return i.authenticated?Qe(i.token||""):{}}const rr=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:J,Provider:Qs,User:pt,dispatch:ns,headers:er,payload:sr},Symbol.toStringTag,{value:"Module"}));function Ct(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function Qt(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const ir=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Qt,relay:Ct},Symbol.toStringTag,{value:"Module"}));function os(i,...t){const e=i.map((r,n)=>n?[t[n-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const nr=new DOMParser;function I(i,...t){const e=t.map(l),s=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),r=nr.parseFromString(s,"text/html"),n=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Ee(a);case"bigint":case"boolean":case"number":case"symbol":return Ee(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ee(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Mt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:n};return s;function r(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}B=class extends HTMLElement{constructor(){super(),this._state={},Mt(this).template(B.template).styles(B.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Ct(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},or(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},B.template=I`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,B.styles=os`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function or(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const as=class ls extends se{constructor(t){super((e,s)=>this.update(e,s),t,ls.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(lr(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(cr(s,r));break}}}};as.EVENT_TYPE="history:message";let re=as;class Se extends Xe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=ar(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ie(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new re(this.context).attach(this)}}function ar(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function lr(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function cr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const ie=es(re.EVENT_TYPE),hr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Se,Provider:Se,Service:re,dispatch:ie},Symbol.toStringTag,{value:"Module"}));class ft{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new xe(this._provider,t);this._effects.push(r),e(r)}else Js(this._target,this._contextLabel).then(r=>{const n=new xe(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class xe{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const cs=class hs extends HTMLElement{constructor(){super(),this._state={},this._user=new pt,this._authObserver=new ft(this,"blazing:auth"),Mt(this).template(hs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;ur(r,this._state,e,this.authorization).then(n=>nt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},nt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ke(this.src,this.authorization).then(e=>{this._state=e,nt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&ke(this.src,this.authorization).then(r=>{this._state=r,nt(r,this)});break;case"new":s&&(this._state={},nt({},this));break}}};cs.observedAttributes=["src","new","action"];cs.template=I`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function ke(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function nt(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function ur(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const dr=class us extends se{constructor(t,e){super(e,t,us.EVENT_TYPE,!1)}};dr.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,ne=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,oe=Symbol(),Pe=new WeakMap;let ds=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==oe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ne&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Pe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Pe.set(e,t))}return t}toString(){return this.cssText}};const pr=i=>new ds(typeof i=="string"?i:i+"",void 0,oe),fr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new ds(e,i,oe)},mr=(i,t)=>{if(ne)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=kt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ce=ne?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return pr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gr,defineProperty:yr,getOwnPropertyDescriptor:vr,getOwnPropertyNames:_r,getOwnPropertySymbols:$r,getPrototypeOf:br}=Object,G=globalThis,Oe=G.trustedTypes,Ar=Oe?Oe.emptyScript:"",Te=G.reactiveElementPolyfillSupport,ht=(i,t)=>i,Ot={toAttribute(i,t){switch(t){case Boolean:i=i?Ar:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ae=(i,t)=>!gr(i,t),Re={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:ae};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),G.litPropertyMetadata??(G.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Re){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&yr(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=vr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Re}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;const t=br(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){const e=this.properties,s=[..._r(e),...$r(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ce(r))}else t!==void 0&&e.push(Ce(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Ot).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ot;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ae)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ht("elementProperties")]=new Map,Y[ht("finalized")]=new Map,Te==null||Te({ReactiveElement:Y}),(G.reactiveElementVersions??(G.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Rt=Tt.trustedTypes,Ue=Rt?Rt.createPolicy("lit-html",{createHTML:i=>i}):void 0,ps="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,fs="?"+k,wr=`<${fs}>`,j=document,mt=()=>j.createComment(""),gt=i=>i===null||typeof i!="object"&&typeof i!="function",le=Array.isArray,Er=i=>le(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Ft=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ne=/-->/g,Le=/>/g,U=RegExp(`>|${Ft}(?:([^\\s"'>=/]+)(${Ft}*=${Ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Me=/'/g,Ie=/"/g,ms=/^(?:script|style|textarea|title)$/i,Sr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),at=Sr(1),Z=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),He=new WeakMap,L=j.createTreeWalker(j,129);function gs(i,t){if(!le(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ue!==void 0?Ue.createHTML(t):t}const xr=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ot?f[1]==="!--"?o=Ne:f[1]!==void 0?o=Le:f[2]!==void 0?(ms.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=r??ot,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?U:f[3]==='"'?Ie:Me):o===Ie||o===Me?o=U:o===Ne||o===Le?o=ot:(o=U,r=void 0);const h=o===U&&i[l+1].startsWith("/>")?" ":"";n+=o===ot?a+wr:u>=0?(s.push(d),a.slice(0,u)+ps+a.slice(u)+k+h):a+k+(u===-2?l:h)}return[gs(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let Xt=class ys{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=xr(t,e);if(this.el=ys.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=L.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(ps)){const c=f[o++],h=r.getAttribute(u).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Pr:p[1]==="?"?Cr:p[1]==="@"?Or:It}),r.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(ms.test(r.tagName)){const u=r.textContent.split(k),c=u.length-1;if(c>0){r.textContent=Rt?Rt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],mt()),L.nextNode(),a.push({type:2,index:++n});r.append(u[c],mt())}}}else if(r.nodeType===8)if(r.data===fs)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:n}),u+=k.length-1}n++}}static createElement(t,e){const s=j.createElement("template");return s.innerHTML=t,s}};function Q(i,t,e=i,s){var r,n;if(t===Z)return t;let o=s!==void 0?(r=e.o)==null?void 0:r[s]:e.l;const l=gt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=Q(i,o._$AS(i,t.values),o,s)),t}class kr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??j).importNode(e,!0);L.currentNode=r;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new At(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Tr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=j,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class At{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),gt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==Z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Er(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Xt.createElement(gs(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new kr(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=He.get(t.strings);return e===void 0&&He.set(t.strings,e=new Xt(t)),e}k(t){le(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new At(this.O(mt()),this.O(mt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class It{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=Q(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==Z,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=Q(this,l[s+a],e,a),d===Z&&(d=this._$AH[a]),o||(o=!gt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Pr extends It{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Cr extends It{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Or extends It{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??$)===Z)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Tr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const je=Tt.litHtmlPolyfillSupport;je==null||je(Xt,At),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.2.0");const Rr=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new At(t.insertBefore(mt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let K=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Rr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Z}};K._$litElement$=!0,K.finalized=!0,(we=globalThis.litElementHydrateSupport)==null||we.call(globalThis,{LitElement:K});const ze=globalThis.litElementPolyfillSupport;ze==null||ze({LitElement:K});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ur={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:ae},Nr=(i=Ur,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function vs(i){return(t,e)=>typeof e=="object"?Nr(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _s(i){return vs({...i,state:!0,attribute:!1})}function Lr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Mr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var $s={};(function(i){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,y,jt){var w=y.length-1;switch(m){case 1:return new g.Root({},[y[w-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[w-1],y[w]]);break;case 4:case 5:this.$=y[w];break;case 6:this.$=new g.Literal({value:y[w]});break;case 7:this.$=new g.Splat({name:y[w]});break;case 8:this.$=new g.Param({name:y[w]});break;case 9:this.$=new g.Optional({},[y[w-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],y=this.table,jt="",w=0,$e=0,zs=2,be=1,Ds=m.slice.call(arguments,1),_=Object.create(this.lexer),T={yy:{}};for(var zt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,zt)&&(T.yy[zt]=this.yy[zt]);_.setInput(c,T.yy),T.yy.lexer=_,T.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Dt=_.yylloc;m.push(Dt);var Vs=_.options&&_.options.ranges;typeof T.yy.parseError=="function"?this.parseError=T.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var qs=function(){var q;return q=_.lex()||be,typeof q!="number"&&(q=h.symbols_[q]||q),q},A,R,E,Vt,V={},St,x,Ae,xt;;){if(R=p[p.length-1],this.defaultActions[R]?E=this.defaultActions[R]:((A===null||typeof A>"u")&&(A=qs()),E=y[R]&&y[R][A]),typeof E>"u"||!E.length||!E[0]){var qt="";xt=[];for(St in y[R])this.terminals_[St]&&St>zs&&xt.push("'"+this.terminals_[St]+"'");_.showPosition?qt="Parse error on line "+(w+1)+`:
`+_.showPosition()+`
Expecting `+xt.join(", ")+", got '"+(this.terminals_[A]||A)+"'":qt="Parse error on line "+(w+1)+": Unexpected "+(A==be?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(qt,{text:_.match,token:this.terminals_[A]||A,line:_.yylineno,loc:Dt,expected:xt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+R+", token: "+A);switch(E[0]){case 1:p.push(A),g.push(_.yytext),m.push(_.yylloc),p.push(E[1]),A=null,$e=_.yyleng,jt=_.yytext,w=_.yylineno,Dt=_.yylloc;break;case 2:if(x=this.productions_[E[1]][1],V.$=g[g.length-x],V._$={first_line:m[m.length-(x||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(x||1)].first_column,last_column:m[m.length-1].last_column},Vs&&(V._$.range=[m[m.length-(x||1)].range[0],m[m.length-1].range[1]]),Vt=this.performAction.apply(V,[jt,$e,w,T.yy,E[1],g,m].concat(Ds)),typeof Vt<"u")return Vt;x&&(p=p.slice(0,-1*x*2),g=g.slice(0,-1*x),m=m.slice(0,-1*x)),p.push(this.productions_[E[1]][0]),g.push(V.$),m.push(V._$),Ae=y[p[p.length-2]][p[p.length-1]],p.push(Ae);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Mr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})($s);function F(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var bs={Root:F("Root"),Concat:F("Concat"),Literal:F("Literal"),Splat:F("Splat"),Param:F("Param"),Optional:F("Optional")},As=$s.parser;As.yy=bs;var Ir=As,Hr=Object.keys(bs);function jr(i){return Hr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var ws=jr,zr=ws,Dr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Es(i){this.captures=i.captures,this.re=i.re}Es.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Vr=zr({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Dr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Es({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),qr=Vr,Br=ws,Fr=Br({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Yr=Fr,Wr=Ir,Kr=qr,Jr=Yr;wt.prototype=Object.create(null);wt.prototype.match=function(i){var t=Kr.visit(this.ast),e=t.match(i);return e||!1};wt.prototype.reverse=function(i){return Jr.visit(this.ast,i)};function wt(i){var t;if(this?t=this:t=Object.create(wt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Wr.parse(i),t}var Gr=wt,Zr=Gr,Qr=Zr;const Xr=Lr(Qr);var ti=Object.defineProperty,Ss=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ti(t,e,r),r};const xs=class extends K{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>at` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new Xr(r.path)})),this._historyObserver=new ft(this,e),this._authObserver=new ft(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),at` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ns(this,"auth/redirect"),at` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):at` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),at` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){ie(this,"history/redirect",{href:t})}};xs.styles=fr`
    :host,
    main {
      display: contents;
    }
  `;let Ut=xs;Ss([_s()],Ut.prototype,"_user");Ss([_s()],Ut.prototype,"_match");const ei=Object.freeze(Object.defineProperty({__proto__:null,Element:Ut,Switch:Ut},Symbol.toStringTag,{value:"Module"})),si=class ks extends HTMLElement{constructor(){if(super(),Mt(this).template(ks.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};si.template=I`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Ps=class te extends HTMLElement{constructor(){super(),this._array=[],Mt(this).template(te.template).styles(te.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Cs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Qt(t,"button.add")?Ct(t,"input-array:add"):Qt(t,"button.remove")&&Ct(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],ri(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Ps.template=I`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ps.styles=os`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function ri(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Cs(e)))}function Cs(i,t){const e=i===void 0?I`<input />`:I`<input value="${i}" />`;return I`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Os(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ii=Object.defineProperty,ni=Object.getOwnPropertyDescriptor,oi=(i,t,e,s)=>{for(var r=ni(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ii(t,e,r),r};class ai extends K{constructor(t){super(),this._pending=[],this._observer=new ft(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}oi([vs()],ai.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,ce=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),De=new WeakMap;let Ts=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ce&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=De.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&De.set(e,t))}return t}toString(){return this.cssText}};const li=i=>new Ts(typeof i=="string"?i:i+"",void 0,he),O=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Ts(e,i,he)},ci=(i,t)=>{if(ce)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Pt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ve=ce?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return li(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:hi,defineProperty:ui,getOwnPropertyDescriptor:di,getOwnPropertyNames:pi,getOwnPropertySymbols:fi,getPrototypeOf:mi}=Object,C=globalThis,qe=C.trustedTypes,gi=qe?qe.emptyScript:"",Yt=C.reactiveElementPolyfillSupport,ut=(i,t)=>i,Nt={toAttribute(i,t){switch(t){case Boolean:i=i?gi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ue=(i,t)=>!hi(i,t),Be={attribute:!0,type:String,converter:Nt,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&ui(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=di(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Be}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=mi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...pi(e),...fi(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ve(r))}else t!==void 0&&e.push(Ve(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ci(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Nt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n,o;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:Nt;this._$Em=r,this[r]=a.fromAttribute(e,l.type)??((o=this._$Ej)==null?void 0:o.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??ue)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[ut("elementProperties")]=new Map,W[ut("finalized")]=new Map,Yt==null||Yt({ReactiveElement:W}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt=globalThis,Lt=dt.trustedTypes,Fe=Lt?Lt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Rs="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Us="?"+P,yi=`<${Us}>`,z=document,yt=()=>z.createComment(""),vt=i=>i===null||typeof i!="object"&&typeof i!="function",de=Array.isArray,vi=i=>de(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Wt=`[ 	
\f\r]`,lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ye=/-->/g,We=/>/g,N=RegExp(`>|${Wt}(?:([^\\s"'>=/]+)(${Wt}*=${Wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ke=/'/g,Je=/"/g,Ns=/^(?:script|style|textarea|title)$/i,_i=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),v=_i(1),X=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Ge=new WeakMap,M=z.createTreeWalker(z,129);function Ls(i,t){if(!de(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fe!==void 0?Fe.createHTML(t):t}const $i=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=lt;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===lt?f[1]==="!--"?o=Ye:f[1]!==void 0?o=We:f[2]!==void 0?(Ns.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=r??lt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?Je:Ke):o===Je||o===Ke?o=N:o===Ye||o===We?o=lt:(o=N,r=void 0);const h=o===N&&i[l+1].startsWith("/>")?" ":"";n+=o===lt?a+yi:u>=0?(s.push(d),a.slice(0,u)+Rs+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[Ls(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class _t{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=$i(t,e);if(this.el=_t.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=M.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Rs)){const c=f[o++],h=r.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ai:p[1]==="?"?wi:p[1]==="@"?Ei:Ht}),r.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Ns.test(r.tagName)){const u=r.textContent.split(P),c=u.length-1;if(c>0){r.textContent=Lt?Lt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],yt()),M.nextNode(),a.push({type:2,index:++n});r.append(u[c],yt())}}}else if(r.nodeType===8)if(r.data===Us)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function tt(i,t,e=i,s){var o,l;if(t===X)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=vt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=tt(i,r._$AS(i,t.values),r,s)),t}class bi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??z).importNode(e,!0);M.currentNode=r;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Et(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Si(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=z,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Et{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),vt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=_t.createElement(Ls(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new bi(r,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Ge.get(t.strings);return e===void 0&&Ge.set(t.strings,e=new _t(t)),e}k(t){de(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new Et(this.O(yt()),this.O(yt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Ht{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=tt(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=tt(this,l[s+a],e,a),d===X&&(d=this._$AH[a]),o||(o=!vt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ai extends Ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class wi extends Ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Ei extends Ht{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??b)===X)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Si{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const Kt=dt.litHtmlPolyfillSupport;Kt==null||Kt(_t,Et),(dt.litHtmlVersions??(dt.litHtmlVersions=[])).push("3.3.0");const xi=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Et(t.insertBefore(yt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=globalThis;class S extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=xi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return X}}var Ze;S._$litElement$=!0,S.finalized=!0,(Ze=H.litElementHydrateSupport)==null||Ze.call(H,{LitElement:S});const Jt=H.litElementPolyfillSupport;Jt==null||Jt({LitElement:S});(H.litElementVersions??(H.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ki=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pi={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:ue},Ci=(i=Pi,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function it(i){return(t,e)=>typeof e=="object"?Ci(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function D(i){return it({...i,state:!0,attribute:!1})}var Oi=Object.defineProperty,Ms=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Oi(t,e,r),r};const me=class me extends S{constructor(){super(...arguments),this._authObserver=new ft(this,"blazing:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;this.loggedIn=!!(e&&e.authenticated),this.userid=e==null?void 0:e.username})}render(){return v`
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
          ${this.loggedIn?v`
                <span>Hello, ${this.userid}</span>
                <button @click=${this.handleSignOut}>Sign Out</button>
              `:v`<a href="/login.html" @click=${this.navigateToLogin}>Sign In…</a>`}
        </nav>
      </header>
    `}toggleDarkMode(t){const s=t.target.checked;document.body.classList.toggle("dark-mode",s)}handleSignOut(t){ir.relay(t,"auth:message",["auth/signout"])}navigateToLogin(t){t.preventDefault(),window.location.href="/login.html"}};me.styles=O`
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
`;let $t=me;Ms([D()],$t.prototype,"loggedIn");Ms([D()],$t.prototype,"userid");const Is={styles:O`
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
  `};var Ti=Object.defineProperty,Hs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ti(t,e,r),r};const ge=class ge extends S{constructor(){super(...arguments),this.icon="",this.heading=""}render(){return v`
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
    `}};ge.styles=[Is.styles,O`
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
    `];let bt=ge;Hs([it()],bt.prototype,"icon");Hs([it()],bt.prototype,"heading");var Ri=Object.defineProperty,js=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ri(t,e,r),r};const ye=class ye extends S{constructor(){super(...arguments),this.data=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}hydrate(t){fetch(t).then(e=>e.json()).then(e=>{this.data=e})}render(){return v`
      ${this.data.map(t=>v`
          <peak-feature icon="${t.icon}" heading="${t.heading}">
            ${t.items.map(e=>v`<li><a href="${e.href}">${e.label}</a></li>`)}
          </peak-feature>
        `)}
    `}};ye.styles=O`
    :host {
      display: block;
      grid-column: span 6;
    }

    @media (max-width: 799px) {
      :host {
        grid-column: span 12;
      }
    }
  `;let et=ye;js([it()],et.prototype,"src");js([D()],et.prototype,"data");Os({"peak-wrapper":et});const Ui=O`
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
`;var Ni=Object.getOwnPropertyDescriptor,Li=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ni(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(r)||r);return r};let ee=class extends S{render(){return v`
      <main class="page-grid">
        <p>Explore hiking trails, parks, viewpoints, and more!</p>

        <peak-wrapper src="/data/featured.json"></peak-wrapper>
        

        <section class="feature">
          <h2>
            <svg class="icon">
              <use href="/icons/hiking.svg#icon-trail"></use>
            </svg>
            Parks
          </h2>
          <ul>
            <li><a href="/app/parks/slo-open-space">SLO Open Space</a></li>
          </ul>
        </section>

        <section class="feature">
          <h2>
            <svg class="icon">
              <use href="/icons/hiking.svg#icon-pickaxe"></use>
            </svg>
            Difficulty Levels
          </h2>
          <ul>
            <li><a href="/app/difficulty/moderate">Moderate</a></li>
            <li><a href="/app/difficulty/hard">Hard</a></li>
          </ul>
        </section>

        <section class="feature">
          <h2>
            <svg class="icon">
              <use href="/icons/hiking.svg#icon-bonfire"></use>
            </svg>
            Tags
          </h2>
          <ul>
            <li><a href="/app/tags/view">Great Views</a></li>
            <li><a href="/app/tags/sunset">Sunset Spot</a></li>
          </ul>
        </section>

        <section class="feature">
          <h2>
            <svg class="icon">
              <use href="/icons/hiking.svg#icon-mountain"></use>
            </svg>
            Reviews
          </h2>
          <ul>
            <li><a href="/app/reviews/madonna-review">"Great city views from Madonna!"</a></li>
            <li><a href="/app/reviews/bishop-review">"Challenging hike with a rewarding summit."</a></li>
          </ul>
        </section>
      </main>
    `}};ee.styles=[Is.styles,Ui,O`
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
        :host-context(.dark-mode) {
      background-color: var(--color-background-dark, #1e1e1e);
      color: var(--color-text-dark, #f0f0f0);
    }
    `];ee=Li([ki("home-view")],ee);var Mi=Object.defineProperty,pe=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Mi(t,e,r),r};const ve=class ve extends S{constructor(){super(...arguments),this.trailId=""}async connectedCallback(){if(super.connectedCallback(),!!this.trailId)try{const t=await fetch(`/api/trails/${this.trailId}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(!t.ok){const e=await t.text();throw new Error(e||"Failed to load trail")}this.trail=await t.json()}catch(t){console.error("Error loading trail:",t),this.error="Unable to load trail. You may need to sign in."}}render(){return this.error?v`<p style="color: red;">${this.error}</p>`:this.trail?v`
      <section>
        <h2>${this.trail.name}</h2>
        <p><strong>Difficulty:</strong> ${this.trail.difficulty}</p>
        <p><strong>Park:</strong> ${this.trail.park}</p>
        <p><strong>Tags:</strong> ${this.trail.tags.join(", ")}</p>
        <h3>Reviews:</h3>
        <ul>
          ${this.trail.reviews.map(t=>v`<li>${t}</li>`)}
        </ul>
      </section>
    `:v`<p>Loading trail...</p>`}};ve.styles=O`
    section {
      padding: 1rem;
    }
    h2 {
      font-size: 1.8rem;
    }
    ul {
      list-style: disc;
      padding-left: 1.5rem;
    }
  `;let st=ve;pe([it({attribute:"trail-id"})],st.prototype,"trailId");pe([D()],st.prototype,"trail");pe([D()],st.prototype,"error");customElements.define("trail-view",st);var Ii=Object.defineProperty,fe=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ii(t,e,r),r};const _e=class _e extends S{constructor(){super(...arguments),this.parkId=""}async connectedCallback(){if(super.connectedCallback(),!!this.parkId)try{const t=await fetch(`/api/parks/${this.parkId}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(!t.ok){const e=await t.text();throw new Error(e||"Failed to load park")}this.park=await t.json()}catch(t){console.error("Error loading park:",t),this.error="Unable to load park. You may need to sign in."}}render(){return this.error?v`<p style="color: red;">${this.error}</p>`:this.park?v`
      <section>
        <h2>${this.park.name}</h2>
        <p>${this.park.description}</p>
        <h3>Trails:</h3>
        <ul>
          ${this.park.trails.map(t=>v`
            <li><a href="/app/trails/${t}">${t}</a></li>
          `)}
        </ul>
      </section>
    `:v`<p>Loading park...</p>`}};_e.styles=O`
    section {
      padding: 1rem;
    }
    h2 {
      font-size: 1.8rem;
    }
  `;let rt=_e;fe([it({attribute:"park-id"})],rt.prototype,"parkId");fe([D()],rt.prototype,"park");fe([D()],rt.prototype,"error");customElements.define("park-view",rt);const Hi=[{path:"/app/trails/:id",view:i=>v`
        <trail-view trail-id=${i.id}></trail-view>
      `},{path:"/app/parks/:id",view:i=>v`
        <park-view park-id=${i.id}></park-view>
      `},{path:"/app",view:()=>v`
        <home-view></home-view>
      `},{path:"/",redirect:"/app"}];Os({"mu-auth":rr.Provider,"mu-history":hr.Provider,"mu-switch":class extends ei.Element{constructor(){super(Hi,"app:history","app:auth")}},"peak-header":$t,"peak-wrapper":et,"peak-feature":bt});
