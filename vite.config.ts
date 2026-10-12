import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import press from "fumapress/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";

export default defineConfig({
  plugins: [press({ basePath: process.env.BASE_PATH ?? "/" }), fumadocsMdx(), tailwindcss()],
});
