<script lang="ts" setup>
const COMICS_PER_PAGE = 30;
const route = useRoute();

const comics = ref<any>([]);
const isFetching = ref<boolean>(false);
const currentPage = ref<number>(1);

const getHistoryComics = () => {
  const db = window.db;
  const trans = db.transaction('history', 'readwrite');
  const store = trans.objectStore('history');
  const cursorRequest = store
    .index('reading_at')
    .openCursor(null, 'prevunique');
  const response: any = [];
  cursorRequest.onsuccess = () => {
    const cursor = cursorRequest.result;
    if (cursor) {
      response.push(cursor.value);
      cursor.continue();
    } else {
      comics.value = response;
    }
  };
};

onMounted(() => {
  getHistoryComics();
  currentPage.value = Number(route.query.page) || 1;
});

watch(route, (route) => {
  getHistoryComics();
  currentPage.value = Number(route.query.page) || 1;
});
</script>

<template>
  <Head>
    <Title>{{ `History - Page ${route.query.page ?? 1} | NComics` }}</Title>
    <Meta name="description" content="Free comic and manga reader online" />
  </Head>
  <main class="max-w-6xl mx-auto px-3 min-h-screen">
    <ComicsPagination
      v-if="comics.length"
      :is-fetching="isFetching"
      :comics="
        comics.slice(
          (currentPage - 1) * COMICS_PER_PAGE,
          currentPage * COMICS_PER_PAGE
        )
      "
      :total-pages="Math.ceil(comics.length / COMICS_PER_PAGE)"
      title="Recently Read"
      icon="mdi:clock-outline"
      :is-history="true"
      @delete-comic="getHistoryComics"
    />
    <h3 v-else class="text-2xl mt-8 font-bold text-gray-600 text-center">
      No History
    </h3>
  </main>
</template>
