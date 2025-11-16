import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/bundle-report.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  build: {
    chunkSizeWarningLimit: 2048,
    cssCodeSplit: true,
    minify: "esbuild",
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React vendor chunk
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-vendor";
          }
          // Core libraries chunk
          if (
            id.includes("node_modules/firebase") ||
            id.includes("node_modules/react-router-dom") ||
            id.includes("node_modules/lucide-react")
          ) {
            return "core-libs";
          }
          // UI-heavy libraries chunk
          if (
            id.includes("node_modules/recharts") ||
            id.includes("node_modules/framer-motion") ||
            id.includes("node_modules/three")
          ) {
            return "ui-heavy";
          }
          // AI engine chunk
          if (
            id.includes("features/wellness-sessions") ||
            id.includes("api/getAiTemplates") ||
            id.includes("core/ai") ||
            id.includes("components/AiSessionCard")
          ) {
            return "ai-engine";
          }
          // Endpoint tools chunk
          if (
            id.includes("features/wellness-sessions/SessionTemplates") ||
            id.includes("Views/SessionDemoPage")
          ) {
            return "endpoint-tools";
          }
          // Dashboard chunk
          if (
            id.includes("components/Dashboard") ||
            id.includes("pages/premium/AuroraDashboard") ||
            id.includes("features/providers/ProviderDashboard")
          ) {
            return "dashboard";
          }
          // News chunk
          if (id.includes("features/news")) {
            return "news";
          }
          // Tools chunk
          if (id.includes("Views/tools") || id.includes("features/recovery/tools")) {
            return "tools";
          }
        },
      },
    },
  },
});
