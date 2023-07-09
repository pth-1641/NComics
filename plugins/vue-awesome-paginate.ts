import VueAwesomePaginate from 'vue-awesome-paginate';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueAwesomePaginate);
});
