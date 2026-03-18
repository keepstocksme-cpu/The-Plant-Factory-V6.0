import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/The-Plant-Factory-V6.0/",
  plugins: [react(), tailwindcss()],
});
