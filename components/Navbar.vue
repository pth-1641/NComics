<script lang="ts" setup>
import { routes } from '@/utils/data';
import { useAxios } from '@/composables';

const { path } = useRoute();
const router = useRouter();

const currentPath = ref<string>(path);
const searchValue = ref<string>('');
const suggestComics = ref<any>([]);
const showSuggest = ref<boolean>(false);

const handleChangeRoute = (newPath: string) => {
  currentPath.value = newPath;
};

let timeout: any;
watch(searchValue, (newValue) => {
  if (!newValue) {
    suggestComics.value = [];
    return;
  }
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const result = await useAxios(
      `/search-suggest?q=${newValue.replace(/\s+/g, '+')}`
    );
    suggestComics.value = result;
    showSuggest.value = result.length;
  }, 500);
});
</script>

<template>
  <header class="shadow relative z-50">
    <nav class="max-w-7xl h-14 mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2 h-full">
        <img src="../assets/img/logo.svg" alt="NComics" class="h-full py-2" />
        <h1 class="text-3xl font-bold text-emerald-500">NComics</h1>
        <ul class="flex items-center gap-2 text-lg ml-6">
          <li v-for="route in routes" :key="route.path">
            <NuxtLink
              :to="route.path"
              :class="`px-4 py-2 duration-150 font-medium ${
                route.path === currentPath
                  ? 'bg-emerald-500 rounded-full text-white'
                  : 'hover:text-emerald-500'
              }`"
              @click="handleChangeRoute(route.path)"
            >
              {{ route.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink to="favourite">
          <Icon name="mdi:heart" size="32" />
        </NuxtLink>
        <NuxtLink to="history">
          <Icon name="ic:outline-history" size="32" />
        </NuxtLink>
        <form
          class="flex items-center rounded-full border py-2 focus-within:border-emerald-500 duration-100 mx-4 relative"
          @submit.prevent="router.push(`/search?q=${searchValue}`)"
        >
          <input
            type="text"
            class="outline-none text-sm pl-3 rounded-full"
            placeholder="Search comics/authors"
            v-model="searchValue"
            @focus="showSuggest = suggestComics.length"
            @blur="showSuggest = false"
          />
          <button type="submit" class="flex items-center px-3">
            <Icon name="iconamoon:search-bold" />
          </button>
          <ul
            class="absolute top-11 left-1/2 -translate-x-1/2 w-72 h-max max-h-80 overflow-auto shadow rounded bg-white"
            v-if="showSuggest"
          >
            <NuxtLink
              :to="`/comic/${comic.id}`"
              v-for="comic in suggestComics"
              :key="comic.id"
              class="flex gap-2 p-2 border-b hover:bg-gray-200 duration-100"
            >
              <img
                :src="comic.thumbnail"
                :alt="comic.title"
                class="border border-emerald-500 w-16 h-24 object-cover object-center rounded"
              />
              <div>
                <h6 class="font-medium text-sm">
                  {{ comic.title }}
                  <span class="font-normal">
                    ({{ comic.lastest_chapter }})
                  </span>
                </h6>
                <p
                  class="text-sm font-medium text-emerald-500 flex items-center gap-1"
                >
                  <template v-if="comic.authors === 'Updating'">
                    <Icon name="mdi:dots-circle" size="16" />
                    Updating
                  </template>
                  <template v-else>
                    {{ comic.authors.join(' | ') }}
                  </template>
                </p>
                <p class="text-xs font-medium flex items-center">
                  <template v-if="Array.isArray(comic.genres)">
                    {{ comic.genres.join(', ') }}
                  </template>
                </p>
              </div>
            </NuxtLink>
          </ul>
        </form>
        <NuxtLink to="history">
          <Icon name="line-md:sunny-filled-loop" size="24" />
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
