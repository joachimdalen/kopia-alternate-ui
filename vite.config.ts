import react from "@vitejs/plugin-react";
import fs from "fs";
import { defineConfig, loadEnv } from "vite";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "KAU_");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/master": {
          target: "https://localhost:51515",
          changeOrigin: true,
          secure: false,
          configure: (_, options) => {
            options.auth = `${env.KAU_KOPIA_USERNAME}:${env.KAU_KOPIA_PASSWORD}`;
          },
          rewrite(path) {
            return path.replace("master/", "");
          },
        },
        "/api/slave": {
          target: "https://localhost:51525",
          changeOrigin: true,
          secure: false,
          configure: (_, options) => {
            options.auth = `${env.KAU_KOPIA_USERNAME}:${env.KAU_KOPIA_PASSWORD}`;
          },
          rewrite(path) {
            return path.replace("slave/", "");
          },
        },
        "/api": {
          target: env.KAU_KOPIA_ENDPOINT,
          changeOrigin: true,
          secure: false,
          configure: (_, options) => {
            options.auth = `${env.KAU_KOPIA_USERNAME}:${env.KAU_KOPIA_PASSWORD}`;
          },
        },

        "/instances": {
          target: "",
          secure: false,
          bypass: (_, response) => {
            response?.appendHeader("Content-Type", "application/json");
            response?.write(fs.readFileSync("./docker/servers.json"));
            response?.end();
          },
        },
      },
    },
  };
});
