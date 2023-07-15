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
  <main class="max-w-6xl mx-auto px-3">
    <ComicsPagination
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
    />
  </main>
</template>
