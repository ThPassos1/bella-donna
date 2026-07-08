import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Repo name = GitHub Pages project path: https://USER.github.io/bella-donna/
const repoName = 'bella-donna'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/',
})
