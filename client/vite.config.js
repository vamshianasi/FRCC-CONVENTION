import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // PAYMENT_MODE switches the gateway implementation. "mock" (default) uses the
  // simulated flows in src/services/payment.js. When a real gateway is wired up,
  // set PAYMENT_MODE=live and only src/services/payment.js needs to change.
  define: {
    'import.meta.env.VITE_PAYMENT_MODE': JSON.stringify(process.env.PAYMENT_MODE || 'mock'),
  },
  server: { proxy: { '/api': 'http://localhost:5000' } },
})
