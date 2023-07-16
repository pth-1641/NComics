<script lang="ts" setup>
import { routes, dynamicRoutes } from '@/utils/data';

const device = ref<'mobile' | 'laptop'>('laptop');

const searchValue = ref<string>('');
const suggestComics = ref<any>([]);
const searchInput = ref<any>(null);

const showSuggest = ref<boolean>(false);
const openSidebar = ref<boolean>(false);

const handleSelectComic = (comicId: string) => {
  navigateTo(`/comic/${comicId}`);
  searchInput.value.blur();
};

const handleSearchComics = () => {
  if (!searchValue.value.trim()) return;
  openSidebar.value = false;
  searchInput.value.blur();
  navigateTo(`/search?q=${searchValue.value.replace(/\s+/g, '+')}`);
};

watch(openSidebar, (status) => {
  document.body.style.overflow = status ? 'hidden' : 'auto';
});

let timeout: any;
watch(searchValue, (newValue) => {
  if (!newValue) {
    suggestComics.value = [];
    return;
  }
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const result = await useFetchData(
      `/search-suggest?q=${newValue.replace(/\s+/g, '+')}`
    );
    suggestComics.value = result;
    if (!(searchInput.value === document.activeElement)) return;
    showSuggest.value = result.length;
  }, 200);
});

const getScreenWidth = () => {
  const { width } = window.screen;
  device.value = width >= 1024 ? 'laptop' : 'mobile';
};

onMounted(() => {
  getScreenWidth();
  window.addEventListener('resize', getScreenWidth);
});
onBeforeUnmount(() => {
  clearTimeout(timeout);
  window.removeEventListener('resize', getScreenWidth);
});
</script>

<template>
  <header class="shadow bg-white relative z-50">
    <nav
      class="max-w-7xl h-12 md:h-14 mx-auto flex items-center justify-between px-3"
    >
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
        <ul class="items-center gap-2 text-lg ml-6 text-base hidden lg:flex">
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
      <div v-if="device === 'laptop'" class="items-center gap-3 flex">
        <NuxtLink to="/history">
          <Icon name="ic:outline-history" size="30" class="text-blue-500" />
        </NuxtLink>
        <form
          class="flex items-center rounded-full border py-2 focus-within:border-emerald-500 duration-100 mx-4 relative"
          @submit.prevent="handleSearchComics"
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
            class="z-10 absolute top-11 left-1/2 -translate-x-1/2 w-72 h-max max-h-80 overflow-auto shadow rounded bg-white"
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
      <div v-else>
        <button @click="openSidebar = true">
          <Icon name="carbon:menu" size="32" />
        </button>
        <div
          :class="`fixed inset-0 bg-[rgba(0,0,0,0.85)] duration-200 ${
            openSidebar
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`"
          @click="
            (e) => {
              if (e.currentTarget !== e.target) return;
              openSidebar = false;
            }
          "
        >
          <div
            :class="`absolute right-0 inset-y-0 bg-white p-5 pt-3 w-11/12 max-w-sm duration-200 ${
              openSidebar ? 'translate-x-0' : 'translate-x-full'
            }`"
          >
            <button
              class="ml-auto block w-max mb-2"
              @click="openSidebar = false"
            >
              <Icon name="ep:close-bold" size="28" />
            </button>
            <form
              class="flex items-center rounded-full border py-2 focus-within:border-emerald-500 duration-100 relative mb-3"
              @submit.prevent="handleSearchComics"
            >
              <input
                type="text"
                class="outline-none text-sm pl-3 rounded-full w-full"
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
                class="absolute top-11 left-1/2 -translate-x-1/2 w-full h-max max-h-80 overflow-auto shadow rounded bg-white"
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
            <ul class="grid gap-3 text-lg font-semibold">
              <NuxtLink
                to="/"
                active-class="text-emerald-500"
                @click="openSidebar = false"
              >
                <Icon name="ion:home-outline" size="20" class="mr-1" />
                Home
              </NuxtLink>
              <NuxtLink
                to="/genres?type=all"
                active-class="text-emerald-500"
                @click="openSidebar = false"
              >
                <Icon name="fa-solid:crown" size="20" class="mr-1" />
                Genres
              </NuxtLink>
              <NuxtLink
                to="/top"
                active-class="text-emerald-500"
                @click="openSidebar = false"
              >
                <Icon name="twemoji:top-arrow" size="20" class="mr-1" />
                Top
              </NuxtLink>
              <NuxtLink
                v-for="route in dynamicRoutes"
                :key="route.path"
                :to="route.path"
                active-class="text-emerald-500"
                @click="openSidebar = false"
              >
                <Icon :name="route.icon" size="20" class="mr-1" />
                {{ route.title }}
              </NuxtLink>
              <NuxtLink
                to="/history"
                active-class="text-emerald-500"
                @click="openSidebar = false"
              >
                <Icon name="mdi:clock-outline" size="20" class="mr-1" />
                History
              </NuxtLink>
            </ul>
          </div>
        </div>
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
