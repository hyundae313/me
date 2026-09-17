import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages: https://hyundae313.github.io/me/ 아래에 놓입니다.
  base: '/me/',
  plugins: [react()],
  // 같은 와이파이에 있는 폰에서 볼 수 있게 LAN 주소로도 엽니다.
  server: { host: true },
})
