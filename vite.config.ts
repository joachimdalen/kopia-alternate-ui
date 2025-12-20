import react from "@vitejs/plugin-react";
import fs from "fs";
import { defineConfig } from "vite";
export default defineConfig(() =>
  // { mode }
  {
    //const env = loadEnv(mode, process.cwd(), "KAU_");
    return {
      plugins: [react()],
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
            },
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
            },
          },
          "/instances": {
            target: "",
            secure: false,
            bypass: (_, response) => {
              response?.appendHeader("Content-Type", "application/json");
              response?.write(fs.readFileSync("./.dev/servers.json"));
              response?.end();
            },
          },
        },
      },
    };
  }
);
