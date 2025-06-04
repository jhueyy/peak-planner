import {
    Auth,
    define,
    History,
    Switch
} from "@calpoly/mustang";
import { html } from "lit";

// Import your components
import { PeakHeader } from "./components/peak-header";
import { PeakWrapperElement } from "./components/peak-wrapper";
import { PeakFeatureElement } from "./components/peak-feature";

// Import views
import "./views/home-view";
import "./views/trail-view";
import "./views/park-view";

// Define SPA routes
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

// Register components
define({
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "app:history", "app:auth");
        }
    },
    "peak-header": PeakHeader,
    "peak-wrapper": PeakWrapperElement,
    "peak-feature": PeakFeatureElement
});
