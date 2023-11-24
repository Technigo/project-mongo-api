// vite.config.js
export default defineConfig({
    build: {
      // generate .vite/manifest.json in outDir
      manifest: true,
      rollupOptions: {
        // overwrite default .html entry
        input: '/path/to/main.js',
      },
    },
  })