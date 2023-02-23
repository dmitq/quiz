import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

export default defineConfig(({mode}) => {
  dotenv.config({path: `../.env.${mode}`})
  return {
      base: "./",
      plugins: [react()],
      server: {
        proxy: {
          '/api': {
            target: process.env.VITE_API_URL,
            changeOrigin: true,
            secure: true,
          }
        }
      }
    }
  }
)
