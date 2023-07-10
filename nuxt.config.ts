// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', 'nuxt-swiper'],
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
    },
  },
});
