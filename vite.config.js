import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // Allows access from mobile devices
    port: 5173         // You can change this if needed
  }
});
