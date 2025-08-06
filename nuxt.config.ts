export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],
  nitro: {
    experimental: {
      wasm: true
    },
    plugins: ['~/server/plugins/websocket.ts']
  },
  css: ['~/assets/css/main.css'],
  ssr: false // Disable SSR for better WebSocket compatibility
})