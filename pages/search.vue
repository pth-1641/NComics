<script lang="ts" setup>
import { Comic } from 'types';

const comics = ref<Comic[]>([]);
const query = ref<string>('');

const route = useRoute();

const getSearchComics = async () => {
  try {
    const data = await useAxios(`/search?q=${query.value}`);
    comics.value = data.comics;
  } catch (err) {
    console.log(err);
  }
};

onBeforeMount(async () => {
  query.value = route.query.q as string;
  await getSearchComics();
});

watch(route, async (route) => {
  query.value = route.query.q as string;
  await getSearchComics();
});
</script>

<template>
  <main class="max-w-6xl mx-auto min-h-screen py-6">
    <div class="flex items-center gap-1 text-gray-500 font-medium text-lg">
      <NuxtLink to="/">Home</NuxtLink>
      <Icon name="icon-park:right" size="16" />
      <span>Search result</span>
      <Icon name="icon-park:right" size="16" />
      <span class="text-black">{{ query }}</span>
    </div>
    <ul class="grid grid-cols-2 gap-6 py-5">
      <NuxtLink
        :to="`/comic/${comic.id}`"
        v-for="comic in comics"
        :key="comic.id"
        class="flex gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4"
      >
        <img
          :src="comic.thumbnail"
          :alt="comic.title"
          class="rounded aspect-[2/3] h-36 border border-emerald-500 object-cover"
        />
        <div class="text-gray-500 font-medium">
          <h3 class="text-lg text-black leading-5">
            {{ comic.title }}
            <span class="text-sm text-gray-500">
              ({{ comic.lastest_chapters[0].name }})
            </span>
          </h3>
          <p class="flex items-center gap-1 text-emerald-500">
            <template v-if="Array.isArray(comic.authors)">
              {{ comic.authors.join(' | ') }}
            </template>
            <template v-else-if="comic.authors === 'Updating'">
              <Icon name="mdi:dots-circle" size="16" />
              Updating
            </template>
            <template v-else>
              {{ comic.authors }}
            </template>
          </p>
          <p class="text-sm line-clamp-2">{{ comic.short_description }}</p>
          <ul class="text-sm flex items-center flex-wrap gap-2 mt-1">
            <li
              v-for="genre in comic.genres"
              :key="genre.id"
              class="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {{ genre.name }}
            </li>
          </ul>
        </div>
      </NuxtLink>
    </ul>
  </main>
</template>
