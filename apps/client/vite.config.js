import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/auth': 'http://localhost:5000',
      '/users': 'http://localhost:5000',
      '/customers': 'http://localhost:5000',
      '/products': 'http://localhost:5000',
      '/price-lists': 'http://localhost:5000',
      '/discount-tiers': 'http://localhost:5000',
      '/approval-chains': 'http://localhost:5000',
      '/quotations': 'http://localhost:5000',
      '/approvals': 'http://localhost:5000',
      '/warehouses': 'http://localhost:5000',
      '/fulfillment': 'http://localhost:5000',
      '/subscriptions': 'http://localhost:5000',
      '/billing': 'http://localhost:5000',
      '/upsell': 'http://localhost:5000',
      '/negotiation': 'http://localhost:5000',
      '/dashboard': 'http://localhost:5000',
      '/reports': 'http://localhost:5000',
      '/audit': 'http://localhost:5000',
    },
  },
});
