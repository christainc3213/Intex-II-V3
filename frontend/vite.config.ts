import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com data:; " +
        "img-src 'self' data:; " +
        "connect-src 'self' https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net;  " +
        "frame-src 'self'; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';",
    },
    proxy: {
      "/api": {
        target:
          "https://cineniche3-9-dfbefvebc2gthdfd.eastus-01.azurewebsites.net",
        changeOrigin: true,
        secure: false, // allows self-signed certificates
      },
    },
  },
});
