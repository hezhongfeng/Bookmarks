import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup/index.html'),
        options: resolve(__dirname, 'options/index.html'),
        newtab: resolve(__dirname, 'newtab/index.html')
      }
    }
  }
});
