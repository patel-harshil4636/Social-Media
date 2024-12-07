import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets/uploads/*", // Path to your uploads
          dest: "assets/uploads", // Destination in build folder
        },
        {
          src: "src/assets/posts/*", // Path to your posts
          dest: "assets/posts", // Destination in build folder
        },
      ],
      verbose: true, // Enable logging to debug file copying
    }),
  ],
  server: {
    proxy: {
      "/api/ffData/": {
        target: "http://localhost:8000", // Replace with your backend URL
        changeOrigin: true,
        secure: false,
      },

      "/api/follow": {
        target: "http://localhost:8000", // Replace with your backend URL
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "http://localhost:8000", // Replace with your backend URL
        changeOrigin: true,
        secure: false,
      },
      "user/SearchList/Data": {
        target: "http://localhost:8000", // Backend URL for API calls
        changeOrigin: true,
        secure: false, // Disable SSL verification for development
      },
      "user/allUserNames": {
        target: "http://localhost:8000", // Backend URL for API calls
        changeOrigin: true,
        secure: false, // Disable SSL verification for development
      },
      "/user/this/": {
        target: "http://localhost:8000", // Backend URL for API calls
        changeOrigin: true,
        secure: false, // Disable SSL verification for development
      },
      "/user": {
        target: "http://localhost:8000", // Backend URL for API calls
        changeOrigin: true,
        secure: false, // Disable SSL verification for development
      },
      "/user/api": {
        target: "http://localhost:8000", // Backend URL for API calls
        changeOrigin: true,
        secure: false, // Disable SSL verification for development
      },
      "/user/logout": {
        target: "http://localhost:8000", // Backend URL for logout
        changeOrigin: true,
        secure: false,
      },
      "/user/newPost": {
        target: "http://localhost:8000", // Backend URL for creating posts
        changeOrigin: true,
        secure: false,
      },
      "/user/allPosts": {
        target: "http://localhost:8000", // Backend URL for fetching posts
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true, // Enable SPA fallback for React Router
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
  assetsInclude: ["**/*.JPG", "**/*.JPG", "**/*.jpg", "**/*.jpeg"], // Support for image formats
});
