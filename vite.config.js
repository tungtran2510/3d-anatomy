import { defineConfig } from 'vite'

// Deployed as a GitHub Pages project site, so production is served from a
// sub-path. Asset URLs in JS are built from import.meta.env.BASE_URL — see
// src/utils/paths.js — because `base` alone does not rewrite string literals.
const REPO_BASE = process.env.BASE_URL || './'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? REPO_BASE : './',
  build: {
    target: 'esnext',
    assetsInlineLimit: 0
  },
  server: {
    port: 3000,
    open: true
  }
}))
