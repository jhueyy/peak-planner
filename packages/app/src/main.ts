import {
    Auth,
    define,
    History,
    Switch,
    Store
} from "@calpoly/mustang";
import { html } from "lit";

import { Msg } from "./message";
import { Model, init } from "./model";
import update from "./update";

// Components
import { PeakHeader } from "./components/peak-header";
import { PeakWrapperElement } from "./components/peak-wrapper";
import { PeakFeatureElement } from "./components/peak-feature";

// Views
import "./views/home-view";
import "./views/trail-view";
import "./views/park-view";

// Routes
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
        view: () => html`
        <home-view></home-view>
      `
    },
    {
        path: "/",
        redirect: "/app"
    }
];

// Register custom elements
define({
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "app:history", "app:auth");
        }
    },
    "mu-store": class AppStore extends Store.Provider<Model, Msg> {
        constructor() {
            super(update, init, "app:auth");
        }
    },
    "peak-header": PeakHeader,
    "peak-wrapper": PeakWrapperElement,
    "peak-feature": PeakFeatureElement
});
