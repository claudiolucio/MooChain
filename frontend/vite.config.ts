/* eslint-disable linebreak-style */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Substitua 3001 pela porta desejada
  },
});
