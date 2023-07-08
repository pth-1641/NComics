<script lang="ts" setup>
import { useAxios } from '@/composables';
import { topRoutes } from '@/utils/data';
import { Comic } from '@/types';

const currentTab = ref<string>('all');
const sortBy = ref<string>('all');
const comics = ref<Comic[]>([]);
const totalPages = ref<number>(1);

const route = useRoute();
const router = useRouter();

const getComics = async (tab: string, page: number = 1) => {
  const data = await useAxios(`/top/${tab === 'all' ? '' : tab}?page=${page}`);
  comics.value = data.comics;
  totalPages.value = data.total_pages;
};

const currentQuery = route.query.tab as string;
currentTab.value = currentQuery || 'all';
await getComics(currentQuery);

const handleChangeTab = (tab: string) => {
  currentTab.value = tab;
  router.replace({
    query: {
      tab,
    },
  });
};

const handleChangeSortBy = (sortByVal: string) => {
  sortBy.value = sortByVal;
  router.replace({
    query: {
      sortByVal,
    },
  });
};

watch([currentTab, route], async ([newTab, route]) => {
  const page = route.query.page || 1;
  await getComics(newTab, Number(page));
});
</script>

<template>
  <main class="max-w-6xl mx-auto">
    <ul class="flex flex-wrap items-center gap-3 my-5">
      <li
        v-for="route in topRoutes"
        :key="route.type"
        :class="`flex items-center gap-1 px-3 py-2 rounded cursor-pointer duration-150 select-none ${
          route.type === currentTab ? 'bg-emerald-500 text-white' : ''
        }`"
        @click="handleChangeTab(route.type)"
      >
        <Icon :name="route.icon" size="24" />
        {{ route.name }}
      </li>
    </ul>
    <ComicsPagination :comics="comics" :totalPages="totalPages" />
  </main>
</template>
