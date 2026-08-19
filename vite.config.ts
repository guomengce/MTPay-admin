import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *; @use "@/styles/breakpoints.scss" as *;`,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    // 管理端固定使用 6688；端口被占用时直接报错，不自动跳到其他端口。
    port: 6688,
    strictPort: true,
  },
});
