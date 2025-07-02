// vite.config.ts
import { rmSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "file:///C:/electron-react-gpt-writer/node_modules/.pnpm/vite@5.4.19_@types+node@22.16.0/node_modules/vite/dist/node/index.js";
import react from "file:///C:/electron-react-gpt-writer/node_modules/.pnpm/@vitejs+plugin-react@4.6.0_vite@5.4.19/node_modules/@vitejs/plugin-react/dist/index.mjs";
import electron from "file:///C:/electron-react-gpt-writer/node_modules/.pnpm/vite-plugin-electron@0.29.0_vite-plugin-electron-renderer@0.14.6/node_modules/vite-plugin-electron/dist/simple.mjs";

// package.json
var package_default = {
  name: "gpt-prompt-manager",
  version: "1.0.1",
  main: "dist-electron/main/index.js",
  description: "Electron Vite React boilerplate.",
  author: "JO YOUNG",
  license: "MIT",
  private: true,
  type: "module",
  scripts: {
    dev: "vite",
    build: "tsc && vite build && electron-builder",
    preview: "vite preview",
    pretest: "vite build --mode=test",
    test: "vitest run",
    "version:patch": "pnpm version patch",
    "version:minor": "pnpm version minor",
    "version:major": "pnpm version major",
    release: "pnpm version patch && pnpm run build"
  },
  dependencies: {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@supabase/supabase-js": "^2.50.2",
    "@types/node": "^22.15.3",
    axios: "^1.9.0",
    clsx: "^2.1.1",
    dotenv: "^16.5.0",
    "electron-updater": "^6.3.9",
    openai: "^5.8.2",
    "tailwind-merge": "^3.2.0",
    "tailwind-scrollbar": "^4.0.2",
    xlsx: "^0.18.5",
    zustand: "^5.0.4"
  },
  devDependencies: {
    "@playwright/test": "^1.48.2",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.3.3",
    autoprefixer: "^10.4.20",
    electron: "^37.1.0",
    "electron-builder": "^24.13.3",
    postcss: "^8.4.49",
    "postcss-import": "^16.1.0",
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    tailwindcss: "^4.1.11",
    typescript: "^5.4.2",
    vite: "^5.4.11",
    "vite-plugin-electron": "^0.29.0",
    "vite-plugin-electron-renderer": "^0.14.6",
    vitest: "^2.1.5"
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "C:\\electron-react-gpt-writer";
var vite_config_default = defineConfig(({ command }) => {
  rmSync("dist-electron", { recursive: true, force: true });
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  return {
    resolve: {
      alias: {
        "@": path.join(__vite_injected_original_dirname, "src")
      }
    },
    plugins: [
      react(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: "electron/main/index.ts",
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */
                "[startup] Electron App"
              );
            } else {
              args.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: "electron/preload/index.ts",
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : void 0,
              // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {}
      })
    ],
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(package_default.debug.env.VITE_DEV_SERVER_URL);
      return {
        host: url.hostname,
        port: +url.port
      };
    })(),
    clearScreen: false
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcZWxlY3Ryb24tcmVhY3QtZ3B0LXdyaXRlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcZWxlY3Ryb24tcmVhY3QtZ3B0LXdyaXRlclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovZWxlY3Ryb24tcmVhY3QtZ3B0LXdyaXRlci92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHJtU3luYyB9IGZyb20gJ25vZGU6ZnMnXHJcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZWxlY3Ryb24gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24vc2ltcGxlJ1xyXG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZS5qc29uJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQgfSkgPT4ge1xyXG4gIHJtU3luYygnZGlzdC1lbGVjdHJvbicsIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KVxyXG5cclxuICBjb25zdCBpc1NlcnZlID0gY29tbWFuZCA9PT0gJ3NlcnZlJ1xyXG4gIGNvbnN0IGlzQnVpbGQgPSBjb21tYW5kID09PSAnYnVpbGQnXHJcbiAgY29uc3Qgc291cmNlbWFwID0gaXNTZXJ2ZSB8fCAhIXByb2Nlc3MuZW52LlZTQ09ERV9ERUJVR1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3NyYycpXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICByZWFjdCgpLFxyXG4gICAgICBlbGVjdHJvbih7XHJcbiAgICAgICAgbWFpbjoge1xyXG4gICAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLmxpYi5lbnRyeWBcclxuICAgICAgICAgIGVudHJ5OiAnZWxlY3Ryb24vbWFpbi9pbmRleC50cycsXHJcbiAgICAgICAgICBvbnN0YXJ0KGFyZ3MpIHtcclxuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52LlZTQ09ERV9ERUJVRykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKC8qIEZvciBgLnZzY29kZS8uZGVidWcuc2NyaXB0Lm1qc2AgKi8nW3N0YXJ0dXBdIEVsZWN0cm9uIEFwcCcpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYXJncy5zdGFydHVwKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHZpdGU6IHtcclxuICAgICAgICAgICAgYnVpbGQ6IHtcclxuICAgICAgICAgICAgICBzb3VyY2VtYXAsXHJcbiAgICAgICAgICAgICAgbWluaWZ5OiBpc0J1aWxkLFxyXG4gICAgICAgICAgICAgIG91dERpcjogJ2Rpc3QtZWxlY3Ryb24vbWFpbicsXHJcbiAgICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgZXh0ZXJuYWw6IE9iamVjdC5rZXlzKCdkZXBlbmRlbmNpZXMnIGluIHBrZyA/IHBrZy5kZXBlbmRlbmNpZXMgOiB7fSksXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwcmVsb2FkOiB7XHJcbiAgICAgICAgICAvLyBTaG9ydGN1dCBvZiBgYnVpbGQucm9sbHVwT3B0aW9ucy5pbnB1dGAuXHJcbiAgICAgICAgICAvLyBQcmVsb2FkIHNjcmlwdHMgbWF5IGNvbnRhaW4gV2ViIGFzc2V0cywgc28gdXNlIHRoZSBgYnVpbGQucm9sbHVwT3B0aW9ucy5pbnB1dGAgaW5zdGVhZCBgYnVpbGQubGliLmVudHJ5YC5cclxuICAgICAgICAgIGlucHV0OiAnZWxlY3Ryb24vcHJlbG9hZC9pbmRleC50cycsXHJcbiAgICAgICAgICB2aXRlOiB7XHJcbiAgICAgICAgICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgICAgICAgc291cmNlbWFwOiBzb3VyY2VtYXAgPyAnaW5saW5lJyA6IHVuZGVmaW5lZCwgLy8gIzMzMlxyXG4gICAgICAgICAgICAgIG1pbmlmeTogaXNCdWlsZCxcclxuICAgICAgICAgICAgICBvdXREaXI6ICdkaXN0LWVsZWN0cm9uL3ByZWxvYWQnLFxyXG4gICAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cygnZGVwZW5kZW5jaWVzJyBpbiBwa2cgPyBwa2cuZGVwZW5kZW5jaWVzIDoge30pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gUGxveWZpbGwgdGhlIEVsZWN0cm9uIGFuZCBOb2RlLmpzIEFQSSBmb3IgUmVuZGVyZXIgcHJvY2Vzcy5cclxuICAgICAgICAvLyBJZiB5b3Ugd2FudCB1c2UgTm9kZS5qcyBpbiBSZW5kZXJlciBwcm9jZXNzLCB0aGUgYG5vZGVJbnRlZ3JhdGlvbmAgbmVlZHMgdG8gYmUgZW5hYmxlZCBpbiB0aGUgTWFpbiBwcm9jZXNzLlxyXG4gICAgICAgIC8vIFNlZSBcdUQ4M0RcdURDNDkgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uLXZpdGUvdml0ZS1wbHVnaW4tZWxlY3Ryb24tcmVuZGVyZXJcclxuICAgICAgICByZW5kZXJlcjoge30sXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICAgIHNlcnZlcjogcHJvY2Vzcy5lbnYuVlNDT0RFX0RFQlVHICYmICgoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGtnLmRlYnVnLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMKVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhvc3Q6IHVybC5ob3N0bmFtZSxcclxuICAgICAgICBwb3J0OiArdXJsLnBvcnQsXHJcbiAgICAgIH1cclxuICAgIH0pKCksXHJcbiAgICBjbGVhclNjcmVlbjogZmFsc2UsXHJcbiAgfVxyXG59KVxyXG4iLCAie1xuICBcIm5hbWVcIjogXCJncHQtcHJvbXB0LW1hbmFnZXJcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjFcIixcbiAgXCJtYWluXCI6IFwiZGlzdC1lbGVjdHJvbi9tYWluL2luZGV4LmpzXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJFbGVjdHJvbiBWaXRlIFJlYWN0IGJvaWxlcnBsYXRlLlwiLFxuICBcImF1dGhvclwiOiBcIkpPIFlPVU5HXCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcInByaXZhdGVcIjogdHJ1ZSxcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXG4gICAgXCJidWlsZFwiOiBcInRzYyAmJiB2aXRlIGJ1aWxkICYmIGVsZWN0cm9uLWJ1aWxkZXJcIixcbiAgICBcInByZXZpZXdcIjogXCJ2aXRlIHByZXZpZXdcIixcbiAgICBcInByZXRlc3RcIjogXCJ2aXRlIGJ1aWxkIC0tbW9kZT10ZXN0XCIsXG4gICAgXCJ0ZXN0XCI6IFwidml0ZXN0IHJ1blwiLFxuICAgIFwidmVyc2lvbjpwYXRjaFwiOiBcInBucG0gdmVyc2lvbiBwYXRjaFwiLFxuICAgIFwidmVyc2lvbjptaW5vclwiOiBcInBucG0gdmVyc2lvbiBtaW5vclwiLFxuICAgIFwidmVyc2lvbjptYWpvclwiOiBcInBucG0gdmVyc2lvbiBtYWpvclwiLFxuICAgIFwicmVsZWFzZVwiOiBcInBucG0gdmVyc2lvbiBwYXRjaCAmJiBwbnBtIHJ1biBidWlsZFwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkbmQta2l0L2NvcmVcIjogXCJeNi4zLjFcIixcbiAgICBcIkBkbmQta2l0L3NvcnRhYmxlXCI6IFwiXjEwLjAuMFwiLFxuICAgIFwiQGRuZC1raXQvdXRpbGl0aWVzXCI6IFwiXjMuMi4yXCIsXG4gICAgXCJAc3VwYWJhc2Uvc3VwYWJhc2UtanNcIjogXCJeMi41MC4yXCIsXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4yMi4xNS4zXCIsXG4gICAgXCJheGlvc1wiOiBcIl4xLjkuMFwiLFxuICAgIFwiY2xzeFwiOiBcIl4yLjEuMVwiLFxuICAgIFwiZG90ZW52XCI6IFwiXjE2LjUuMFwiLFxuICAgIFwiZWxlY3Ryb24tdXBkYXRlclwiOiBcIl42LjMuOVwiLFxuICAgIFwib3BlbmFpXCI6IFwiXjUuOC4yXCIsXG4gICAgXCJ0YWlsd2luZC1tZXJnZVwiOiBcIl4zLjIuMFwiLFxuICAgIFwidGFpbHdpbmQtc2Nyb2xsYmFyXCI6IFwiXjQuMC4yXCIsXG4gICAgXCJ4bHN4XCI6IFwiXjAuMTguNVwiLFxuICAgIFwienVzdGFuZFwiOiBcIl41LjAuNFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBwbGF5d3JpZ2h0L3Rlc3RcIjogXCJeMS40OC4yXCIsXG4gICAgXCJAdHlwZXMvcmVhY3RcIjogXCJeMTkuMS44XCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE5LjEuNlwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4zLjNcIixcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjIwXCIsXG4gICAgXCJlbGVjdHJvblwiOiBcIl4zNy4xLjBcIixcbiAgICBcImVsZWN0cm9uLWJ1aWxkZXJcIjogXCJeMjQuMTMuM1wiLFxuICAgIFwicG9zdGNzc1wiOiBcIl44LjQuNDlcIixcbiAgICBcInBvc3Rjc3MtaW1wb3J0XCI6IFwiXjE2LjEuMFwiLFxuICAgIFwicmVhY3RcIjogXCJeMTguMy4xXCIsXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTguMy4xXCIsXG4gICAgXCJ0YWlsd2luZGNzc1wiOiBcIl40LjEuMTFcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS40LjJcIixcbiAgICBcInZpdGVcIjogXCJeNS40LjExXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1lbGVjdHJvblwiOiBcIl4wLjI5LjBcIixcbiAgICBcInZpdGUtcGx1Z2luLWVsZWN0cm9uLXJlbmRlcmVyXCI6IFwiXjAuMTQuNlwiLFxuICAgIFwidml0ZXN0XCI6IFwiXjIuMS41XCJcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUSxTQUFTLGNBQWM7QUFDalMsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLGNBQWM7OztBQ0pyQjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsYUFBZTtBQUFBLEVBQ2YsUUFBVTtBQUFBLEVBQ1YsU0FBVztBQUFBLEVBQ1gsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLElBQ1QsS0FBTztBQUFBLElBQ1AsT0FBUztBQUFBLElBQ1QsU0FBVztBQUFBLElBQ1gsU0FBVztBQUFBLElBQ1gsTUFBUTtBQUFBLElBQ1IsaUJBQWlCO0FBQUEsSUFDakIsaUJBQWlCO0FBQUEsSUFDakIsaUJBQWlCO0FBQUEsSUFDakIsU0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLGNBQWdCO0FBQUEsSUFDZCxpQkFBaUI7QUFBQSxJQUNqQixxQkFBcUI7QUFBQSxJQUNyQixzQkFBc0I7QUFBQSxJQUN0Qix5QkFBeUI7QUFBQSxJQUN6QixlQUFl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
