// packages/app/vite.config.js
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    server: {
        proxy: {
            "/api": "http://localhost:3000",
            "/auth": "http://localhost:3000",
            "/images": "http://localhost:3000",
            "/login": "http://localhost:3000",
            "/register": "http://localhost:3000"
        }
    },
    build: {
        rollupOptions: {
            // Only bundle index.html as the main entry
            input: {
                main: new URL("index.html", import.meta.url).pathname
            }
        }
    }
});
