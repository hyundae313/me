import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 커스텀 도메인(ryankim.kr) 루트에 놓입니다.
  base: '/',
  plugins: [react()],
  // 같은 와이파이에 있는 폰에서 볼 수 있게 LAN 주소로도 엽니다.
  server: { host: true },
})
