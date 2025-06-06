import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
    plugins: [tsconfigPaths()],
    server: {
        proxy: {
            "/api": "http://localhost:3000",
            "/auth": "http://localhost:3000",
            "/images": "http://localhost:3000"
        }
    },
    build: {
        rollupOptions: {
            input: {
                // your main SPA
                main: resolve(__dirname, "index.html"),
                // make sure Vite also “sees” these two files
                login: resolve(__dirname, "login.html"),
                register: resolve(__dirname, "newuser.html")
            }
        }
    }
});
