// packages/app/src/login-init.ts
import { define, Auth } from "@calpoly/mustang";
import { LoginFormElement } from "./auth/login-form";

// Register the custom elements <mu-auth> and <login-form>
define({
    "mu-auth": Auth.Provider,
    "login-form": LoginFormElement
});
