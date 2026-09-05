import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5001',
      '/auth': 'http://localhost:5001',
      '/users': 'http://localhost:5001',
      '/customers': 'http://localhost:5001',
      '/products': 'http://localhost:5001',
      '/price-lists': 'http://localhost:5001',
      '/discount-tiers': 'http://localhost:5001',
      '/approval-chains': 'http://localhost:5001',
      '/quotations': 'http://localhost:5001',
      '/approvals': 'http://localhost:5001',
      '/warehouses': 'http://localhost:5001',
      '/fulfillment': 'http://localhost:5001',
      '/subscriptions': 'http://localhost:5001',
      '/billing': 'http://localhost:5001',
      '/upsell': 'http://localhost:5001',
      '/negotiation': 'http://localhost:5001',
      '/portal': 'http://localhost:5001',
      '/dashboard': 'http://localhost:5001',
      '/deal-health': 'http://localhost:5001',
      '/reports': 'http://localhost:5001',
      '/audit': 'http://localhost:5001',
      '/audit-log': 'http://localhost:5001'
    }
  }
});
