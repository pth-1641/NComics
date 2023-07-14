<script lang="ts" setup>
import { routes } from '@/utils/data';

const searchValue = ref<string>('');
const suggestComics = ref<any>([]);
const showSuggest = ref<boolean>(false);
const searchInput = ref<any>(null);

const handleSelectComic = (comicId: string) => {
  navigateTo(`/comic/${comicId}`);
  searchInput.value.blur();
};

let timeout: any;
watch(searchValue, (newValue) => {
  if (!newValue) {
    suggestComics.value = [];
    return;
  }
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const result = await useData(
      `/search-suggest?q=${newValue.replace(/\s+/g, '+')}`
    );
    suggestComics.value = result;
    if (!(searchInput.value === document.activeElement)) return;
    showSuggest.value = result.length;
  }, 200);
});
onBeforeUnmount(() => clearTimeout(timeout));
</script>

<template>
  <header class="shadow bg-white relative z-50">
    <nav class="max-w-7xl h-14 mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2 h-full">
        <NuxtLink to="/" class="flex items-center gap-2 h-full select-none">
          <img
            src="../assets/img/logo.svg"
            alt="NComics"
            class="h-full py-2"
            draggable="false"
          />
          <h1 class="text-2xl font-bold text-emerald-500 chocopy">NComics</h1>
        </NuxtLink>
        <ul class="flex items-center gap-2 text-lg ml-6 text-base">
          <li v-for="route in routes" :key="route.path">
            <NuxtLink
              :to="route.path"
              class="px-4 py-2 duration-150 font-bold hover:text-emerald-500"
              active-class="bg-emerald-500 rounded-full text-white hover:text-white"
            >
              {{ route.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/history">
          <Icon name="ic:outline-history" size="30" class="text-blue-500" />
        </NuxtLink>
        <form
          class="flex items-center rounded-full border py-2 focus-within:border-emerald-500 duration-100 mx-4 relative"
          @submit.prevent="
            () => {
              searchInput.blur();
              navigateTo(`/search?q=${searchValue.replace(/\s+/g, '+')}`);
            }
          "
        >
          <input
            type="text"
            class="outline-none text-sm pl-3 rounded-full"
            placeholder="Search comics/authors"
            v-model="searchValue"
            ref="searchInput"
            @focus="showSuggest = suggestComics.length > 0"
            @blur="showSuggest = false"
          />
          <button type="submit" class="flex items-center px-3">
            <Icon name="iconamoon:search-bold" />
          </button>
          <ul
            class="absolute top-11 left-1/2 -translate-x-1/2 w-72 h-max max-h-80 overflow-auto shadow rounded bg-white"
            v-show="showSuggest"
          >
            <li
              v-for="comic in suggestComics"
              :key="comic.id"
              @mousedown="handleSelectComic(comic.id)"
              class="flex gap-2 p-2 border-b hover:bg-gray-200 duration-100 cursor-pointer"
            >
              <img
                :src="comic.thumbnail"
                :alt="comic.title"
                class="border border-emerald-500 w-16 h-24 object-cover object-center rounded"
              />
              <div>
                <h6 class="font-bold text-sm">
                  {{ comic.title }}
                  <span class="font-normal">
                    ({{ comic.lastest_chapter }})
                  </span>
                </h6>
                <p
                  class="text-sm font-bold text-emerald-500 flex items-center gap-1"
                >
                  <template v-if="comic.authors === 'Updating'">
                    <Icon name="mdi:dots-circle" size="16" />
                    Updating
                  </template>
                  <template v-else>
                    {{ comic.authors.join(' | ') }}
                  </template>
                </p>
                <p class="text-xs font-semibold flex items-center">
                  <template v-if="Array.isArray(comic.genres)">
                    {{ comic.genres.join(', ') }}
                  </template>
                </p>
              </div>
            </li>
          </ul>
        </form>
      </div>
    </nav>
  </header>
</template>

<style scoped>
@font-face {
  font-family: Chocopy;
  src: url(@/assets/fonts/chocopy.ttf);
}

.chocopy {
  font-family: Chocopy, sans-serif;
}
</style>
