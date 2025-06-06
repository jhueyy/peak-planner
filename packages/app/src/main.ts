// packages/app/src/main.ts

import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html } from "lit";

import { Msg } from "./message";
import { Model, init } from "./model";
import update from "./update";

// Components (make sure these names exactly match what each file exports)
import { PeakHeaderElement } from "./components/peak-header";
import { PeakWrapperElement } from "./components/peak-wrapper";
import { PeakFeatureElement } from "./components/peak-feature";

// Views (we import only for side‐effects; each view file must call define({ … }))
import "./views/home-view";
import "./views/trail-view";
import "./views/park-view";

// ----------------------------------------------------------------------------
// 1) Define your route array exactly as you want the URLs to resolve.
//    Because index.html has just <mu-switch></mu-switch>, we need to pass
//    this array into our custom Switch.Element subclass below.
//
const routes = [
    {
        path: "/app/trails/:id",
        view: (params: Switch.Params) => html`
        <trail-view trail-id=${params.id}></trail-view>
      `
    },
    {
        path: "/app/parks/:id",
        view: (params: Switch.Params) => html`
        <park-view park-id=${params.id}></park-view>
      `
    },
    {
        path: "/app",
        view: () => html`<home-view></home-view>`
    },
    {
        path: "/",
        redirect: "/app"
    }
];
// ----------------------------------------------------------------------------
// 2) Call define({ … }) to register every custom element/tag your app uses.
//    Make sure the strings here match exactly what you put in index.html.
//
//    In index.html you have:
//      <mu-history provides="app:history"> … </mu-history>
//      <mu-auth    provides="app:auth">    … </mu-auth>
//      <mu-store   provides="app:model">   … </mu-store>
//      <peak-header></peak-header>
//      <mu-switch>…</mu-switch>
//
//    So here we register those tags to their correct classes below. If you see
//    a “custom element not defined” error at runtime, double‐check that you
//    imported the correct class name (e.g. Auth.Provider vs Auth, History.Provider vs History).
//
define({
    // a) Mustang’s history/auth elements (must match provides="app:history" / "app:auth")
    "mu-history": History.Provider,      // or just History (depending on your Mustang version)
    "mu-auth": Auth.Provider,            // or just Auth

    // b) A custom <mu-switch>, passing in our routes + the two provider keys
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "app:history", "app:auth");
        }
    },

    // c) A custom <mu-store> that extends Mustang’s Store.Provider<Model, Msg>.
    //    The third argument ("app:auth") must exactly match provides="app:auth" in index.html.
    "mu-store": class AppStore extends Store.Provider<Model, Msg> {
        constructor() {
            super(update, init, "app:auth");
        }
    },

    // d) Your own Lit‐based components (these must match the tag names used in index.html)
    "peak-header": PeakHeaderElement,
    "peak-wrapper": PeakWrapperElement,
    "peak-feature": PeakFeatureElement

    // Note: We do NOT register the views (home-view, trail-view, park-view) here,
    // because each of those files already calls define({ "view-tag": ViewClass }) on its own.
});
