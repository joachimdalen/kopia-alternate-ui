import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "KAU_");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.KAU_KOPIA_ENDPOINT,
          changeOrigin: true,
          secure: false,
          configure: (_, options) => {
            options.auth = `${env.KAU_KOPIA_USERNAME}:${env.KAU_KOPIA_PASSWORD}`;
          },
        },
      },
    },
  };
});
