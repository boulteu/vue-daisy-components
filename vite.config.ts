import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), svgLoader()] as any,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DaisyDataTable',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    minify: 'terser',
    sourcemap: true,
    target: 'es2018'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
