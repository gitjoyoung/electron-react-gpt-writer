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
  description: "GPT \uD504\uB86C\uD504\uD2B8 \uAD00\uB9AC\uC790 - AI \uCC44\uD305 \uBC0F \uD504\uB86C\uD504\uD2B8 \uAD00\uB9AC \uB3C4\uAD6C",
  author: "JO YOUNG",
  license: "MIT",
  private: true,
  debug: {
    env: {
      VITE_DEV_SERVER_URL: "http://127.0.0.1:7777/"
    }
  },
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
    xlsx: "^0.18.5",
    zustand: "^5.0.4"
  },
  devDependencies: {
    "@playwright/test": "^1.48.2",
    "@tailwindcss/postcss": "^4.1.11",
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
    "tailwind-scrollbar": "^4.0.2",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcZWxlY3Ryb24tcmVhY3QtZ3B0LXdyaXRlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcZWxlY3Ryb24tcmVhY3QtZ3B0LXdyaXRlclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovZWxlY3Ryb24tcmVhY3QtZ3B0LXdyaXRlci92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHJtU3luYyB9IGZyb20gJ25vZGU6ZnMnXHJcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZWxlY3Ryb24gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24vc2ltcGxlJ1xyXG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZS5qc29uJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQgfSkgPT4ge1xyXG4gIHJtU3luYygnZGlzdC1lbGVjdHJvbicsIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KVxyXG5cclxuICBjb25zdCBpc1NlcnZlID0gY29tbWFuZCA9PT0gJ3NlcnZlJ1xyXG4gIGNvbnN0IGlzQnVpbGQgPSBjb21tYW5kID09PSAnYnVpbGQnXHJcbiAgY29uc3Qgc291cmNlbWFwID0gaXNTZXJ2ZSB8fCAhIXByb2Nlc3MuZW52LlZTQ09ERV9ERUJVR1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3NyYycpXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICByZWFjdCgpLFxyXG4gICAgICBlbGVjdHJvbih7XHJcbiAgICAgICAgbWFpbjoge1xyXG4gICAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLmxpYi5lbnRyeWBcclxuICAgICAgICAgIGVudHJ5OiAnZWxlY3Ryb24vbWFpbi9pbmRleC50cycsXHJcbiAgICAgICAgICBvbnN0YXJ0KGFyZ3MpIHtcclxuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52LlZTQ09ERV9ERUJVRykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKC8qIEZvciBgLnZzY29kZS8uZGVidWcuc2NyaXB0Lm1qc2AgKi8nW3N0YXJ0dXBdIEVsZWN0cm9uIEFwcCcpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYXJncy5zdGFydHVwKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHZpdGU6IHtcclxuICAgICAgICAgICAgYnVpbGQ6IHtcclxuICAgICAgICAgICAgICBzb3VyY2VtYXAsXHJcbiAgICAgICAgICAgICAgbWluaWZ5OiBpc0J1aWxkLFxyXG4gICAgICAgICAgICAgIG91dERpcjogJ2Rpc3QtZWxlY3Ryb24vbWFpbicsXHJcbiAgICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgZXh0ZXJuYWw6IE9iamVjdC5rZXlzKCdkZXBlbmRlbmNpZXMnIGluIHBrZyA/IHBrZy5kZXBlbmRlbmNpZXMgOiB7fSksXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwcmVsb2FkOiB7XHJcbiAgICAgICAgICAvLyBTaG9ydGN1dCBvZiBgYnVpbGQucm9sbHVwT3B0aW9ucy5pbnB1dGAuXHJcbiAgICAgICAgICAvLyBQcmVsb2FkIHNjcmlwdHMgbWF5IGNvbnRhaW4gV2ViIGFzc2V0cywgc28gdXNlIHRoZSBgYnVpbGQucm9sbHVwT3B0aW9ucy5pbnB1dGAgaW5zdGVhZCBgYnVpbGQubGliLmVudHJ5YC5cclxuICAgICAgICAgIGlucHV0OiAnZWxlY3Ryb24vcHJlbG9hZC9pbmRleC50cycsXHJcbiAgICAgICAgICB2aXRlOiB7XHJcbiAgICAgICAgICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgICAgICAgc291cmNlbWFwOiBzb3VyY2VtYXAgPyAnaW5saW5lJyA6IHVuZGVmaW5lZCwgLy8gIzMzMlxyXG4gICAgICAgICAgICAgIG1pbmlmeTogaXNCdWlsZCxcclxuICAgICAgICAgICAgICBvdXREaXI6ICdkaXN0LWVsZWN0cm9uL3ByZWxvYWQnLFxyXG4gICAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cygnZGVwZW5kZW5jaWVzJyBpbiBwa2cgPyBwa2cuZGVwZW5kZW5jaWVzIDoge30pLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gUGxveWZpbGwgdGhlIEVsZWN0cm9uIGFuZCBOb2RlLmpzIEFQSSBmb3IgUmVuZGVyZXIgcHJvY2Vzcy5cclxuICAgICAgICAvLyBJZiB5b3Ugd2FudCB1c2UgTm9kZS5qcyBpbiBSZW5kZXJlciBwcm9jZXNzLCB0aGUgYG5vZGVJbnRlZ3JhdGlvbmAgbmVlZHMgdG8gYmUgZW5hYmxlZCBpbiB0aGUgTWFpbiBwcm9jZXNzLlxyXG4gICAgICAgIC8vIFNlZSBcdUQ4M0RcdURDNDkgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uLXZpdGUvdml0ZS1wbHVnaW4tZWxlY3Ryb24tcmVuZGVyZXJcclxuICAgICAgICByZW5kZXJlcjoge30sXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICAgIHNlcnZlcjogcHJvY2Vzcy5lbnYuVlNDT0RFX0RFQlVHICYmICgoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGtnLmRlYnVnLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMKVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhvc3Q6IHVybC5ob3N0bmFtZSxcclxuICAgICAgICBwb3J0OiArdXJsLnBvcnQsXHJcbiAgICAgIH1cclxuICAgIH0pKCksXHJcbiAgICBjbGVhclNjcmVlbjogZmFsc2UsXHJcbiAgfVxyXG59KVxyXG4iLCAie1xuICBcIm5hbWVcIjogXCJncHQtcHJvbXB0LW1hbmFnZXJcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjFcIixcbiAgXCJtYWluXCI6IFwiZGlzdC1lbGVjdHJvbi9tYWluL2luZGV4LmpzXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJHUFQgXHVENTA0XHVCODZDXHVENTA0XHVEMkI4IFx1QUQwMFx1QjlBQ1x1Qzc5MCAtIEFJIFx1Q0M0NFx1RDMwNSBcdUJDMEYgXHVENTA0XHVCODZDXHVENTA0XHVEMkI4IFx1QUQwMFx1QjlBQyBcdUIzQzRcdUFENkNcIixcbiAgXCJhdXRob3JcIjogXCJKTyBZT1VOR1wiLFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwiZGVidWdcIjoge1xuICAgIFwiZW52XCI6IHtcbiAgICAgIFwiVklURV9ERVZfU0VSVkVSX1VSTFwiOiBcImh0dHA6Ly8xMjcuMC4wLjE6Nzc3Ny9cIlxuICAgIH1cbiAgfSxcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXG4gICAgXCJidWlsZFwiOiBcInRzYyAmJiB2aXRlIGJ1aWxkICYmIGVsZWN0cm9uLWJ1aWxkZXJcIixcbiAgICBcInByZXZpZXdcIjogXCJ2aXRlIHByZXZpZXdcIixcbiAgICBcInByZXRlc3RcIjogXCJ2aXRlIGJ1aWxkIC0tbW9kZT10ZXN0XCIsXG4gICAgXCJ0ZXN0XCI6IFwidml0ZXN0IHJ1blwiLFxuICAgIFwidmVyc2lvbjpwYXRjaFwiOiBcInBucG0gdmVyc2lvbiBwYXRjaFwiLFxuICAgIFwidmVyc2lvbjptaW5vclwiOiBcInBucG0gdmVyc2lvbiBtaW5vclwiLFxuICAgIFwidmVyc2lvbjptYWpvclwiOiBcInBucG0gdmVyc2lvbiBtYWpvclwiLFxuICAgIFwicmVsZWFzZVwiOiBcInBucG0gdmVyc2lvbiBwYXRjaCAmJiBwbnBtIHJ1biBidWlsZFwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkbmQta2l0L2NvcmVcIjogXCJeNi4zLjFcIixcbiAgICBcIkBkbmQta2l0L3NvcnRhYmxlXCI6IFwiXjEwLjAuMFwiLFxuICAgIFwiQGRuZC1raXQvdXRpbGl0aWVzXCI6IFwiXjMuMi4yXCIsXG4gICAgXCJAc3VwYWJhc2Uvc3VwYWJhc2UtanNcIjogXCJeMi41MC4yXCIsXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4yMi4xNS4zXCIsXG4gICAgXCJheGlvc1wiOiBcIl4xLjkuMFwiLFxuICAgIFwiY2xzeFwiOiBcIl4yLjEuMVwiLFxuICAgIFwiZG90ZW52XCI6IFwiXjE2LjUuMFwiLFxuICAgIFwiZWxlY3Ryb24tdXBkYXRlclwiOiBcIl42LjMuOVwiLFxuICAgIFwib3BlbmFpXCI6IFwiXjUuOC4yXCIsXG4gICAgXCJ0YWlsd2luZC1tZXJnZVwiOiBcIl4zLjIuMFwiLFxuICAgIFwieGxzeFwiOiBcIl4wLjE4LjVcIixcbiAgICBcInp1c3RhbmRcIjogXCJeNS4wLjRcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAcGxheXdyaWdodC90ZXN0XCI6IFwiXjEuNDguMlwiLFxuICAgIFwiQHRhaWx3aW5kY3NzL3Bvc3Rjc3NcIjogXCJeNC4xLjExXCIsXG4gICAgXCJAdHlwZXMvcmVhY3RcIjogXCJeMTkuMS44XCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE5LjEuNlwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4zLjNcIixcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjIwXCIsXG4gICAgXCJlbGVjdHJvblwiOiBcIl4zNy4xLjBcIixcbiAgICBcImVsZWN0cm9uLWJ1aWxkZXJcIjogXCJeMjQuMTMuM1wiLFxuICAgIFwicG9zdGNzc1wiOiBcIl44LjQuNDlcIixcbiAgICBcInBvc3Rjc3MtaW1wb3J0XCI6IFwiXjE2LjEuMFwiLFxuICAgIFwicmVhY3RcIjogXCJeMTguMy4xXCIsXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTguMy4xXCIsXG4gICAgXCJ0YWlsd2luZC1zY3JvbGxiYXJcIjogXCJeNC4wLjJcIixcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiXjQuMS4xMVwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl41LjQuMlwiLFxuICAgIFwidml0ZVwiOiBcIl41LjQuMTFcIixcbiAgICBcInZpdGUtcGx1Z2luLWVsZWN0cm9uXCI6IFwiXjAuMjkuMFwiLFxuICAgIFwidml0ZS1wbHVnaW4tZWxlY3Ryb24tcmVuZGVyZXJcIjogXCJeMC4xNC42XCIsXG4gICAgXCJ2aXRlc3RcIjogXCJeMi4xLjVcIlxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBRLFNBQVMsY0FBYztBQUNqUyxPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sY0FBYzs7O0FDSnJCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixRQUFVO0FBQUEsRUFDVixTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsRUFDWCxPQUFTO0FBQUEsSUFDUCxLQUFPO0FBQUEsTUFDTCxxQkFBdUI7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
