import {
    Auth,
    define,
    History,
    Switch
} from "@calpoly/mustang";

import { html } from "lit";

// Import your components
import { PeakHeader } from "./components/peak-header";
import "./views/home-view"; // Your homepage view
import { PeakWrapperElement } from "./components/peak-wrapper";
import { PeakFeatureElement } from "./components/peak-feature";


// Define routes
const routes = [
    {
        path: "/app/tour/:id",
        view: (params: Switch.Params) => html`
        <tour-view tour-id=${params.id}></tour-view>
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

// Register all components
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
