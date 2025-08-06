export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],
  nitro: {
    experimental: {
      wasm: true
    }
  },
  runtimeConfig: {
    public: {
      socketUrl: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'
    }
  },
  css: ['~/assets/css/main.css'],
  ssr: false
})