import { lingui } from "@lingui/vite-plugin";
import babel, { defineRolldownBabelPreset } from "@rolldown/plugin-babel";
import react from "@vitejs/plugin-react";
import fs from "fs";
import { defineConfig } from "vite";

const linguiPreset = defineRolldownBabelPreset({
  preset: () => ({ plugins: ["@lingui/babel-plugin-lingui-macro"] }),
  rolldown: {
    filter: {
      code: /from ['"]@lingui\/(?:react|core)\/macro['"]/
    }
  }
});

export default defineConfig(() =>
  // { mode }
  {
    //const env = loadEnv(mode, process.cwd(), "KAU_");
    return {
      plugins: [react(), lingui(), babel({ presets: [linguiPreset] })],
      server: {
        proxy: {
          "/api/primary": {
            target: "https://localhost:51515",
            changeOrigin: true,
            secure: false,
            configure: (
              proxy
              //  , options
            ) => {
              //   options.auth = `${env.KAU_KOPIA_USERNAME}:${env.KAU_KOPIA_PASSWORD}`;
              proxy.on("proxyRes", (proxyRes) => {
                delete proxyRes.headers["www-authenticate"];
              });
            },
            rewrite(path) {
              return path.replace("primary/", "");
            }
          },
          "/api/secondary": {
            target: "https://localhost:51525",
            changeOrigin: true,
            secure: false,
            configure: (
              proxy
              //  options
            ) => {
              //   options.auth = `${env.KAU_KOPIA_USERNAME}:${env.KAU_KOPIA_PASSWORD}`;
              proxy.on("proxyRes", (proxyRes) => {
                delete proxyRes.headers["www-authenticate"];
              });
            },
            rewrite(path) {
              return path.replace("secondary/", "");
            }
          },
          "/api/tertiary": {
            target: "https://localhost:51535",
            changeOrigin: true,
            secure: false,
            configure: (
              proxy
              //  options
            ) => {
              //   options.auth = `${env.KAU_KOPIA_USERNAME}:${env.KAU_KOPIA_PASSWORD}`;
              proxy.on("proxyRes", (proxyRes) => {
                delete proxyRes.headers["www-authenticate"];
              });
            },
            rewrite(path) {
              return path.replace("tertiary/", "");
            }
          },
          "/instances": {
            target: "",
            secure: false,
            bypass: (_, response) => {
              response?.appendHeader("Content-Type", "application/json");
              response?.write(fs.readFileSync("./.dev/servers.json"));
              response?.end();
            }
          }
        }
      },
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./vitest.setup.mjs",
        coverage: {
          provider: "v8" // or 'istanbul'
        }
      }
    };
  }
);
