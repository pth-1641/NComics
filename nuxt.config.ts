// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', 'nuxt-swiper'],
  runtimeConfig: {
    public: {
      baseURl: process.env.BASE_URL,
    },
  },
});
