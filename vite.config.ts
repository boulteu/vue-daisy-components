import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.vue'],
      rollupTypes: true
    })
  ] as any,
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VueDaisyComponents',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' }
      }
    }
  }
})
