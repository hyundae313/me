import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 임시: 도메인 연결 전까지 https://hyundae313.github.io/me/ 로 확인합니다.
  // 도메인 붙이면 '/' 로 되돌리고 public/CNAME 을 복구하세요.
  base: '/me/',
  plugins: [react()],
  // 같은 와이파이에 있는 폰에서 볼 수 있게 LAN 주소로도 엽니다.
  server: { host: true },
})
