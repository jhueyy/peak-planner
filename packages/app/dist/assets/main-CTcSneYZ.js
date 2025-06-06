(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var V,Ce;class ht extends Error{}ht.prototype.name="InvalidTokenError";function Xs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function tr(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Xs(t)}catch{return atob(t)}}function is(i,t){if(typeof i!="string")throw new ht("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new ht(`Invalid token specified: missing part #${e+1}`);let r;try{r=tr(s)}catch(n){throw new ht(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new ht(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const er="mu:context",te=`${er}:change`;class sr{constructor(t,e){this._proxy=rr(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class oe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new sr(t,this),this.style.display="contents"}attach(t){return this.addEventListener(te,t),t}detach(t){this.removeEventListener(te,t)}}function rr(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let d=new CustomEvent(te,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:r,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function ir(i,t){const e=ns(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function ns(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return ns(i,r.host)}class nr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function os(i="mu:message"){return(t,...e)=>t.dispatchEvent(new nr(e,i))}class ae{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function or(i){return t=>({...t,...i})}const ee="mu:auth:jwt",as=class ls extends ae{constructor(t,e){super((s,r)=>this.update(s,r),t,ls.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(lr(s)),Kt(r);case"auth/signout":return e(cr()),Kt(this._redirectForLogin);case"auth/redirect":return Kt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};as.EVENT_TYPE="auth:message";let cs=as;const hs=os(cs.EVENT_TYPE);function Kt(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class ar extends oe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=Z.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new cs(this.context,this.redirect).attach(this)}}class G{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ee),t}}class Z extends G{constructor(t){super();const e=is(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Z(t);return localStorage.setItem(ee,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ee);return t?Z.authenticate(t):new G}}function lr(i){return or({user:Z.authenticate(i),token:i})}function cr(){return i=>{const t=i.user;return{user:t&&t.authenticated?G.deauthenticate(t):t,token:""}}}function hr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function ur(i){return i.authenticated?is(i.token||""):{}}const Et=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Z,Provider:ar,User:G,dispatch:hs,headers:hr,payload:ur},Symbol.toStringTag,{value:"Module"}));function Ut(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function se(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const dr=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:se,relay:Ut},Symbol.toStringTag,{value:"Module"}));function us(i,...t){const e=i.map((r,n)=>n?[t[n-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const pr=new DOMParser;function L(i,...t){const e=t.map(l),s=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),r=pr.parseFromString(s,"text/html"),n=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Oe(a);case"bigint":case"boolean":case"number":case"symbol":return Oe(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Oe(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Dt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:n};return s;function r(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let fr=(V=class extends HTMLElement{constructor(){super(),this._state={},Dt(this).template(V.template).styles(V.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Ut(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},mr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},V.template=L`
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
  `,V.styles=us`
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
  `,V);function mr(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const gr=Object.freeze(Object.defineProperty({__proto__:null,Element:fr},Symbol.toStringTag,{value:"Module"})),ds=class ps extends ae{constructor(t){super((e,s)=>this.update(e,s),t,ps.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(vr(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(_r(s,r));break}}}};ds.EVENT_TYPE="history:message";let le=ds;class Te extends oe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=yr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ce(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new le(this.context).attach(this)}}function yr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function vr(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function _r(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const ce=os(le.EVENT_TYPE),he=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Te,Provider:Te,Service:le,dispatch:ce},Symbol.toStringTag,{value:"Module"}));class Q{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Re(this._provider,t);this._effects.push(r),e(r)}else ir(this._target,this._contextLabel).then(r=>{const n=new Re(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Re{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const fs=class ms extends HTMLElement{constructor(){super(),this._state={},this._user=new G,this._authObserver=new Q(this,"blazing:auth"),Dt(this).template(ms.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;$r(r,this._state,e,this.authorization).then(n=>ot(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ot(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ue(this.src,this.authorization).then(e=>{this._state=e,ot(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ue(this.src,this.authorization).then(r=>{this._state=r,ot(r,this)});break;case"new":s&&(this._state={},ot({},this));break}}};fs.observedAttributes=["src","new","action"];fs.template=L`
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
  `;function Ue(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function ot(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function $r(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const gs=class ys extends ae{constructor(t,e){super(e,t,ys.EVENT_TYPE,!1)}};gs.EVENT_TYPE="mu:message";let vs=gs;class br extends oe{constructor(t,e,s){super(e),this._user=new G,this._updateFn=t,this._authObserver=new Q(this,s)}connectedCallback(){const t=new vs(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const wr=Object.freeze(Object.defineProperty({__proto__:null,Provider:br,Service:vs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,ue=Tt.ShadowRoot&&(Tt.ShadyCSS===void 0||Tt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),Ne=new WeakMap;let _s=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ue&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ne.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ne.set(e,t))}return t}toString(){return this.cssText}};const Ar=i=>new _s(typeof i=="string"?i:i+"",void 0,de),Er=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new _s(e,i,de)},Sr=(i,t)=>{if(ue)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Tt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Me=ue?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ar(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:xr,defineProperty:kr,getOwnPropertyDescriptor:Pr,getOwnPropertyNames:Cr,getOwnPropertySymbols:Or,getPrototypeOf:Tr}=Object,X=globalThis,Le=X.trustedTypes,Rr=Le?Le.emptyScript:"",je=X.reactiveElementPolyfillSupport,ut=(i,t)=>i,Nt={toAttribute(i,t){switch(t){case Boolean:i=i?Rr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},pe=(i,t)=>!xr(i,t),Ie={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:pe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),X.litPropertyMetadata??(X.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ie){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&kr(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Pr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ie}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Tr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...Cr(e),...Or(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Me(r))}else t!==void 0&&e.push(Me(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Sr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Nt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Nt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??pe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ut("elementProperties")]=new Map,Y[ut("finalized")]=new Map,je==null||je({ReactiveElement:Y}),(X.reactiveElementVersions??(X.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=globalThis,Lt=Mt.trustedTypes,He=Lt?Lt.createPolicy("lit-html",{createHTML:i=>i}):void 0,$s="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,bs="?"+k,Ur=`<${bs}>`,H=document,ft=()=>H.createComment(""),mt=i=>i===null||typeof i!="object"&&typeof i!="function",fe=Array.isArray,Nr=i=>fe(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Jt=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,De=/-->/g,ze=/>/g,R=RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fe=/'/g,qe=/"/g,ws=/^(?:script|style|textarea|title)$/i,Mr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),lt=Mr(1),tt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Be=new WeakMap,N=H.createTreeWalker(H,129);function As(i,t){if(!fe(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return He!==void 0?He.createHTML(t):t}const Lr=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=at;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===at?f[1]==="!--"?o=De:f[1]!==void 0?o=ze:f[2]!==void 0?(ws.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=r??at,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?R:f[3]==='"'?qe:Fe):o===qe||o===Fe?o=R:o===De||o===ze?o=at:(o=R,r=void 0);const h=o===R&&i[l+1].startsWith("/>")?" ":"";n+=o===at?a+Ur:u>=0?(s.push(d),a.slice(0,u)+$s+a.slice(u)+k+h):a+k+(u===-2?l:h)}return[As(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let re=class Es{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Lr(t,e);if(this.el=Es.createElement(d,s),N.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=N.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith($s)){const c=f[o++],h=r.getAttribute(u).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ir:p[1]==="?"?Hr:p[1]==="@"?Dr:zt}),r.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(ws.test(r.tagName)){const u=r.textContent.split(k),c=u.length-1;if(c>0){r.textContent=Lt?Lt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],ft()),N.nextNode(),a.push({type:2,index:++n});r.append(u[c],ft())}}}else if(r.nodeType===8)if(r.data===bs)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:n}),u+=k.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function et(i,t,e=i,s){var r,n;if(t===tt)return t;let o=s!==void 0?(r=e.o)==null?void 0:r[s]:e.l;const l=mt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=et(i,o._$AS(i,t.values),o,s)),t}class jr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??H).importNode(e,!0);N.currentNode=r;let n=N.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new St(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new zr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=N.nextNode(),o++)}return N.currentNode=H,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class St{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),mt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Nr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=re.createElement(As(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new jr(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Be.get(t.strings);return e===void 0&&Be.set(t.strings,e=new re(t)),e}k(t){fe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new St(this.O(ft()),this.O(ft()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=et(this,t,e,0),o=!mt(t)||t!==this._$AH&&t!==tt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=et(this,l[s+a],e,a),d===tt&&(d=this._$AH[a]),o||(o=!mt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ir extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Hr extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Dr extends zt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??$)===tt)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class zr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const Ve=Mt.litHtmlPolyfillSupport;Ve==null||Ve(re,St),(Mt.litHtmlVersions??(Mt.litHtmlVersions=[])).push("3.2.0");const Fr=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new St(t.insertBefore(ft(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let J=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Fr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return tt}};J._$litElement$=!0,J.finalized=!0,(Ce=globalThis.litElementHydrateSupport)==null||Ce.call(globalThis,{LitElement:J});const We=globalThis.litElementPolyfillSupport;We==null||We({LitElement:J});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qr={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:pe},Br=(i=qr,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function Ss(i){return(t,e)=>typeof e=="object"?Br(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function xs(i){return Ss({...i,state:!0,attribute:!1})}function Vr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Wr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var ks={};(function(i){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,v,qt){var A=v.length-1;switch(m){case 1:return new g.Root({},[v[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new g.Literal({value:v[A]});break;case 7:this.$=new g.Splat({name:v[A]});break;case 8:this.$=new g.Param({name:v[A]});break;case 9:this.$=new g.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],v=this.table,qt="",A=0,xe=0,Js=2,ke=1,Gs=m.slice.call(arguments,1),_=Object.create(this.lexer),O={yy:{}};for(var Bt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Bt)&&(O.yy[Bt]=this.yy[Bt]);_.setInput(c,O.yy),O.yy.lexer=_,O.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Vt=_.yylloc;m.push(Vt);var Zs=_.options&&_.options.ranges;typeof O.yy.parseError=="function"?this.parseError=O.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Qs=function(){var B;return B=_.lex()||ke,typeof B!="number"&&(B=h.symbols_[B]||B),B},w,T,E,Wt,q={},Ct,S,Pe,Ot;;){if(T=p[p.length-1],this.defaultActions[T]?E=this.defaultActions[T]:((w===null||typeof w>"u")&&(w=Qs()),E=v[T]&&v[T][w]),typeof E>"u"||!E.length||!E[0]){var Yt="";Ot=[];for(Ct in v[T])this.terminals_[Ct]&&Ct>Js&&Ot.push("'"+this.terminals_[Ct]+"'");_.showPosition?Yt="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+Ot.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Yt="Parse error on line "+(A+1)+": Unexpected "+(w==ke?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Yt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Vt,expected:Ot})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+T+", token: "+w);switch(E[0]){case 1:p.push(w),g.push(_.yytext),m.push(_.yylloc),p.push(E[1]),w=null,xe=_.yyleng,qt=_.yytext,A=_.yylineno,Vt=_.yylloc;break;case 2:if(S=this.productions_[E[1]][1],q.$=g[g.length-S],q._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},Zs&&(q._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),Wt=this.performAction.apply(q,[qt,xe,A,O.yy,E[1],g,m].concat(Gs)),typeof Wt<"u")return Wt;S&&(p=p.slice(0,-1*S*2),g=g.slice(0,-1*S),m=m.slice(0,-1*S)),p.push(this.productions_[E[1]][0]),g.push(q.$),m.push(q._$),Pe=v[p[p.length-2]][p[p.length-1]],p.push(Pe);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(p=this._input.match(this.rules[m[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=v,this.options.backtrack_lexer){if(c=this.test_match(p,m[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Wr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(ks);function W(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Ps={Root:W("Root"),Concat:W("Concat"),Literal:W("Literal"),Splat:W("Splat"),Param:W("Param"),Optional:W("Optional")},Cs=ks.parser;Cs.yy=Ps;var Yr=Cs,Kr=Object.keys(Ps);function Jr(i){return Kr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Os=Jr,Gr=Os,Zr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ts(i){this.captures=i.captures,this.re=i.re}Ts.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Qr=Gr({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Zr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Ts({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Xr=Qr,ti=Os,ei=ti({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),si=ei,ri=Yr,ii=Xr,ni=si;xt.prototype=Object.create(null);xt.prototype.match=function(i){var t=ii.visit(this.ast),e=t.match(i);return e||!1};xt.prototype.reverse=function(i){return ni.visit(this.ast,i)};function xt(i){var t;if(this?t=this:t=Object.create(xt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=ri.parse(i),t}var oi=xt,ai=oi,li=ai;const ci=Vr(li);var hi=Object.defineProperty,Rs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&hi(t,e,r),r};const Us=class extends J{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>lt` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new ci(r.path)})),this._historyObserver=new Q(this,e),this._authObserver=new Q(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),lt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(hs(this,"auth/redirect"),lt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):lt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),lt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){ce(this,"history/redirect",{href:t})}};Us.styles=Er`
    :host,
    main {
      display: contents;
    }
  `;let jt=Us;Rs([xs()],jt.prototype,"_user");Rs([xs()],jt.prototype,"_match");const ui=Object.freeze(Object.defineProperty({__proto__:null,Element:jt,Switch:jt},Symbol.toStringTag,{value:"Module"})),di=class Ns extends HTMLElement{constructor(){if(super(),Dt(this).template(Ns.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};di.template=L`
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
  `;const Ms=class ie extends HTMLElement{constructor(){super(),this._array=[],Dt(this).template(ie.template).styles(ie.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ls("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{se(t,"button.add")?Ut(t,"input-array:add"):se(t,"button.remove")&&Ut(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],pi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Ms.template=L`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ms.styles=us`
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
  `;function pi(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Ls(e)))}function Ls(i,t){const e=i===void 0?L`<input />`:L`<input value="${i}" />`;return L`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function z(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var fi=Object.defineProperty,mi=Object.getOwnPropertyDescriptor,gi=(i,t,e,s)=>{for(var r=mi(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&fi(t,e,r),r};class kt extends J{constructor(t){super(),this._pending=[],this._observer=new Q(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}gi([Ss()],kt.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,me=Rt.ShadowRoot&&(Rt.ShadyCSS===void 0||Rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),Ye=new WeakMap;let js=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(me&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ye.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ye.set(e,t))}return t}toString(){return this.cssText}};const yi=i=>new js(typeof i=="string"?i:i+"",void 0,ge),x=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new js(e,i,ge)},vi=(i,t)=>{if(me)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Rt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ke=me?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return yi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:_i,defineProperty:$i,getOwnPropertyDescriptor:bi,getOwnPropertyNames:wi,getOwnPropertySymbols:Ai,getPrototypeOf:Ei}=Object,C=globalThis,Je=C.trustedTypes,Si=Je?Je.emptyScript:"",Gt=C.reactiveElementPolyfillSupport,dt=(i,t)=>i,It={toAttribute(i,t){switch(t){case Boolean:i=i?Si:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ye=(i,t)=>!_i(i,t),Ge={attribute:!0,type:String,converter:It,reflect:!1,useDefault:!1,hasChanged:ye};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);let K=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ge){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&$i(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=bi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ge}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=Ei(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,s=[...wi(e),...Ai(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ke(r))}else t!==void 0&&e.push(Ke(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:It).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n,o;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:It;this._$Em=r,this[r]=a.fromAttribute(e,l.type)??((o=this._$Ej)==null?void 0:o.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??ye)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[dt("elementProperties")]=new Map,K[dt("finalized")]=new Map,Gt==null||Gt({ReactiveElement:K}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt=globalThis,Ht=pt.trustedTypes,Ze=Ht?Ht.createPolicy("lit-html",{createHTML:i=>i}):void 0,Is="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Hs="?"+P,xi=`<${Hs}>`,D=document,gt=()=>D.createComment(""),yt=i=>i===null||typeof i!="object"&&typeof i!="function",ve=Array.isArray,ki=i=>ve(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Zt=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Qe=/-->/g,Xe=/>/g,U=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ts=/'/g,es=/"/g,Ds=/^(?:script|style|textarea|title)$/i,Pi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),y=Pi(1),st=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ss=new WeakMap,M=D.createTreeWalker(D,129);function zs(i,t){if(!ve(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ze!==void 0?Ze.createHTML(t):t}const Ci=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=ct;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ct?f[1]==="!--"?o=Qe:f[1]!==void 0?o=Xe:f[2]!==void 0?(Ds.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=r??ct,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?U:f[3]==='"'?es:ts):o===es||o===ts?o=U:o===Qe||o===Xe?o=ct:(o=U,r=void 0);const h=o===U&&i[l+1].startsWith("/>")?" ":"";n+=o===ct?a+xi:u>=0?(s.push(d),a.slice(0,u)+Is+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[zs(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class vt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ci(t,e);if(this.el=vt.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=M.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Is)){const c=f[o++],h=r.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ti:p[1]==="?"?Ri:p[1]==="@"?Ui:Ft}),r.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Ds.test(r.tagName)){const u=r.textContent.split(P),c=u.length-1;if(c>0){r.textContent=Ht?Ht.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],gt()),M.nextNode(),a.push({type:2,index:++n});r.append(u[c],gt())}}}else if(r.nodeType===8)if(r.data===Hs)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=D.createElement("template");return s.innerHTML=t,s}}function rt(i,t,e=i,s){var o,l;if(t===st)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=yt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=rt(i,r._$AS(i,t.values),r,s)),t}class Oi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??D).importNode(e,!0);M.currentNode=r;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Pt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Ni(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=D,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Pt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),yt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ki(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=vt.createElement(zs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new Oi(r,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=ss.get(t.strings);return e===void 0&&ss.set(t.strings,e=new vt(t)),e}k(t){ve(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new Pt(this.O(gt()),this.O(gt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Ft{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=rt(this,t,e,0),o=!yt(t)||t!==this._$AH&&t!==st,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=rt(this,l[s+a],e,a),d===st&&(d=this._$AH[a]),o||(o=!yt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ti extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Ri extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Ui extends Ft{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??b)===st)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ni{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}}const Qt=pt.litHtmlPolyfillSupport;Qt==null||Qt(vt,Pt),(pt.litHtmlVersions??(pt.litHtmlVersions=[])).push("3.3.0");const Mi=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Pt(t.insertBefore(gt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=globalThis;class I extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Mi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return st}}var rs;I._$litElement$=!0,I.finalized=!0,(rs=j.litElementHydrateSupport)==null||rs.call(j,{LitElement:I});const Xt=j.litElementPolyfillSupport;Xt==null||Xt({LitElement:I});(j.litElementVersions??(j.litElementVersions=[])).push("4.2.0");const Li={featured:[]};function ji(i,t,e){switch(i[0]){case"profile/select":{const{userid:s}=i[1];Ii({userid:s},e).then(r=>{r&&t(n=>({...n,profile:r}))});break}case"trail/select":{const{trailid:s}=i[1];Hi({trailid:s},e).then(r=>{r&&t(n=>({...n,trail:r}))});break}case"trail/save":{const{trailid:s,updated:r,onSuccess:n,onFailure:o}=i[1];fetch(`/api/trails/${s}`,{method:"PUT",headers:{"Content-Type":"application/json",...Et.headers(e)},body:JSON.stringify(r)}).then(l=>{if(!l.ok)throw new Error(`Failed to save trail ${s}`);return l.json()}).then(l=>{if(l){const a=l;t(d=>({...d,trail:a}))}}).then(()=>{n&&n()}).catch(l=>{o&&o(l)});break}case"park/select":{const{parkid:s}=i[1];Di({parkid:s},e).then(r=>{r&&t(n=>({...n,park:r}))});break}case"home/load":{fetch("/data/featured.json").then(s=>s.json()).then(s=>t(r=>({...r,featured:s})));break}default:{const s=i[0];throw new Error(`Unhandled message: ${s}`)}}}function Ii({userid:i},t){return fetch(`/api/travelers/${i}`,{headers:Et.headers(t)}).then(e=>e.ok?e.json():void 0)}function Hi({trailid:i},t){return fetch(`/api/trails/${i}`,{headers:Et.headers(t)}).then(e=>e.ok?e.json():void 0)}function Di({parkid:i},t){return fetch(`/api/parks/${i}`,{headers:Et.headers(t)}).then(e=>e.ok?e.json():void 0)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zi={attribute:!0,type:String,converter:It,reflect:!1,hasChanged:ye},Fi=(i=zi,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function F(i){return(t,e)=>typeof e=="object"?Fi(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function nt(i){return F({...i,state:!0,attribute:!1})}var qi=Object.defineProperty,Fs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&qi(t,e,r),r};const _e=class _e extends I{constructor(){super(...arguments),this._authObserver=new Q(this,"app:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;this.loggedIn=!!(e&&e.authenticated),this.userid=e==null?void 0:e.username})}render(){return y`
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
          ${this.loggedIn?y`
                <span>Hello, ${this.userid}</span>
                <button @click=${this.handleSignOut}>Sign Out</button>
              `:y`<a href="/login.html" @click=${this.navigateToLogin}>Sign In…</a>`}
        </nav>
      </header>
    `}toggleDarkMode(t){const s=t.target.checked;document.body.classList.toggle("dark-mode",s)}handleSignOut(t){dr.relay(t,"auth:message",["auth/signout"])}navigateToLogin(t){t.preventDefault(),window.location.href="/login.html"}};_e.styles=x`
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
`;let _t=_e;Fs([nt()],_t.prototype,"loggedIn");Fs([nt()],_t.prototype,"userid");const qs={styles:x`
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
  `};var Bi=Object.defineProperty,Bs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Bi(t,e,r),r};const $e=class $e extends I{constructor(){super(...arguments),this.icon="",this.heading=""}render(){return y`
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
    `}};$e.styles=[qs.styles,x`
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
    `];let $t=$e;Bs([F()],$t.prototype,"icon");Bs([F()],$t.prototype,"heading");var Vi=Object.defineProperty,Vs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Vi(t,e,r),r};const be=class be extends I{constructor(){super(...arguments),this.data=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}hydrate(t){fetch(t).then(e=>e.json()).then(e=>{this.data=e})}render(){return y`
      ${this.data.map(t=>y`
          <peak-feature icon="${t.icon}" heading="${t.heading}">
            ${t.items.map(e=>y`<li><a href="${e.href}">${e.label}</a></li>`)}
          </peak-feature>
        `)}
    `}};be.styles=x`
    :host {
      display: block;
      grid-column: span 6;
    }

    @media (max-width: 799px) {
      :host {
        grid-column: span 12;
      }
    }
  `;let it=be;Vs([F()],it.prototype,"src");Vs([nt()],it.prototype,"data");z({"peak-wrapper":it});const Wi=x`
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
`,we=class we extends kt{constructor(){super("app:model")}render(){return y`
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
    `}};we.styles=[qs.styles,Wi,x`
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
    `];let ne=we;z({"home-view":ne});var Yi=Object.defineProperty,Ki=Object.getOwnPropertyDescriptor,Ws=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ki(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Yi(t,e,r),r};const Ae=class Ae extends kt{get trail(){return this.model.trail}constructor(){super("app:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="trail-id"&&e!==s&&s&&this.dispatchMessage(["trail/select",{trailid:s}])}render(){if(!this.trail)return y`<p>Loading trail data…</p>`;const{name:t,difficulty:e,tags:s,reviews:r,park:n}=this.trail;return y`
      <article>
        <h2>${t}</h2>

        <div class="field">
          <strong>Park:</strong>
          <a href="/app/parks/${n}">${n}</a>
        </div>

        <div class="field">
          <strong>Difficulty:</strong> ${e}
        </div>

        <div class="field">
          <strong>Tags:</strong>
          ${s&&s.length>0?y`
                <ul>
                  ${s.map(o=>y`<li>${o}</li>`)}
                </ul>
              `:y`<span>None</span>`}
        </div>

        <div class="field">
          <strong>Reviews:</strong>
          ${r&&r.length>0?y`
                <ul>
                  ${r.map(o=>y`<li>${o}</li>`)}
                </ul>
              `:y`<span>No reviews yet.</span>`}
        </div>

        <!-- “Edit this Trail” button (now visible) -->
        <button
          @click=${()=>he.dispatch(this,"history/navigate",{href:`/app/trails/${this.trailId}/edit`})}
        >
          Edit this Trail
        </button>
      </article>
    `}};Ae.styles=x`
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
  `;let bt=Ae;Ws([F({attribute:"trail-id"})],bt.prototype,"trailId",2);Ws([nt()],bt.prototype,"trail",1);z({"trail-view":bt});var Ji=Object.defineProperty,Gi=Object.getOwnPropertyDescriptor,Ys=(i,t,e,s)=>{for(var r=s>1?void 0:s?Gi(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Ji(t,e,r),r};const Ee=class Ee extends kt{get park(){return this.model.park}constructor(){super("app:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="park-id"&&e!==s&&s&&this.dispatchMessage(["park/select",{parkid:s}])}render(){if(!this.park)return y`<p>Loading park data…</p>`;const{name:t,description:e,trails:s,id:r}=this.park;return y`
      <article>
        <h2>${t}</h2>

        <div class="field">
          <strong>Description:</strong>
          <p>${e}</p>
        </div>

        <div class="field">
          <strong>Trails in this Park:</strong>
          ${s&&s.length>0?y`
                <ul>
                  ${s.map(n=>y`
                      <li>
                        <a href="/app/trails/${n}">
                          ${n}
                        </a>
                      </li>
                    `)}
                </ul>
              `:y`<p>No trails listed.</p>`}
        </div>
      </article>
    `}};Ee.styles=x`
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
  `;let wt=Ee;Ys([F({attribute:"park-id"})],wt.prototype,"parkId",2);Ys([nt()],wt.prototype,"park",1);z({"park-view":wt});var Zi=Object.defineProperty,Qi=Object.getOwnPropertyDescriptor,Ks=(i,t,e,s)=>{for(var r=s>1?void 0:s?Qi(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Zi(t,e,r),r};z({"mu-form":gr.Element});const Se=class Se extends kt{get trail(){return this.model.trail}constructor(){super("app:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="trail-id"&&e!==s&&s&&this.dispatchMessage(["trail/select",{trailid:s}])}handleSubmit(t){t.preventDefault();const e=t.detail;this.dispatchMessage(["trail/save",{trailid:this.trailId,updated:e,onSuccess:()=>{he.dispatch(this,"history/navigate",{href:`/app/trails/${this.trailId}`})},onFailure:s=>{console.error("Failed to save trail:",s)}}])}render(){return this.trail?y`
      <article>
        <h2>Edit Trail: ${this.trail.name}</h2>
        <mu-form .init=${this.trail} @mu-form:submit=${this.handleSubmit}>
          <!-- Each <input name="…" /> must match a key on the Trail interface -->
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
    `:y`<p>Loading trail for editing…</p>`}};Se.styles=x`
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

    button {
      padding: 0.6rem 1rem;
      font-size: 1rem;
      background-color: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
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
  `;let At=Se;Ks([F({attribute:"trail-id"})],At.prototype,"trailId",2);Ks([nt()],At.prototype,"trail",1);z({"trail-edit-view":At});const Xi=[{path:"/app/trails/:id/edit",view:i=>y`
          <trail-edit-view trail-id=${i.id}></trail-edit-view>
        `},{path:"/app/trails/:id",view:i=>y`
        <trail-view trail-id=${i.id}></trail-view>
      `},{path:"/app/parks/:id",view:i=>y`
        <park-view park-id=${i.id}></park-view>
      `},{path:"/app",view:()=>y`<home-view></home-view>`},{path:"/",redirect:"/app"}];z({"mu-history":he.Provider,"mu-auth":Et.Provider,"mu-switch":class extends ui.Element{constructor(){super(Xi,"app:history","app:auth")}},"mu-store":class extends wr.Provider{constructor(){super(ji,Li,"app:auth")}},"peak-header":_t,"peak-wrapper":it,"peak-feature":$t});
