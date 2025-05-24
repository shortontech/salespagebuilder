import { defineConfig } from 'vite';

export default defineConfig({
  // Optional: Adjust based on your project structure
  root: './src',              // Root directory of your project
  build: {
    sourcemap: true,
    outDir: '../dist',        // Output directory for production build
    minify: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]' // This helps organize output
      }
    },
  },
});