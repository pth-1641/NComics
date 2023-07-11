<script lang="ts" setup>
import { topRoutes, filterValues } from '@/utils/data';
import { Comic } from '@/types';

const currentTab = ref<string>('all');
const filterValue = ref<string>('all');
const comics = ref<Comic[]>([]);
const totalPages = ref<number>(1);
const isFetching = ref<boolean>(false);

const route = useRoute();
const router = useRouter();

const getComics = async (tab: string, page: number = 1) => {
  try {
    isFetching.value = true;
    const data = await useAxios(
      `/top/${tab === 'all' ? '' : tab}?page=${page}&status=${
        filterValue.value
      }`
    );
    comics.value = data.comics;
    totalPages.value = data.total_pages;
  } catch (err) {
    console.log(err);
  } finally {
    isFetching.value = false;
  }
};

const currentQuery = route.query.tab as string;
currentTab.value = currentQuery || 'all';
const page = route.query.page;
const p = page && !isNaN(+page) ? Number(route.query.page) : 1;
await getComics(currentQuery, p);

const handleChangeTab = (tab: string) => {
  currentTab.value = tab;
  const { page, ...query } = route.query;
  router.replace({
    query: {
      ...query,
      tab,
    },
  });
};

const handleFilter = (value: string) => {
  filterValue.value = value;
  const { filter, page, ...query } = route.query;
  if (value === 'all') {
    router.replace({ query });
    return;
  }
  router.replace({ query: { ...query, filter: value } });
};

watch([currentTab, route], async ([newTab, route]) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const page = route.query.page || 1;
  await getComics(newTab, Number(page));
});
</script>

<template>
  <Head>
    <Title>{{
      `${
        topRoutes.find((route) => route.type === currentTab)?.name +
          ` - Page ${route.query.page ?? 1}` || 'Genres'
      } | NComics`
    }}</Title>
    <Meta name="description" content="Free comic and manga reader online" />
  </Head>
  <main class="max-w-6xl mx-auto">
    <ul class="flex flex-wrap items-center gap-3 mt-5">
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
    <ul class="flex items-center gap-5 mb-5 mt-3">
      <li
        v-for="item in filterValues"
        :class="`min-w-[60px] cursor-pointer text-center border px-3 py-1.5 rounded font-medium ${
          item.value === filterValue
            ? 'border-emerald-500 text-emerald-500'
            : ''
        }`"
        @click="handleFilter(item.value)"
      >
        {{ item.label }}
      </li>
    </ul>
    <ComicsPagination
      :comics="comics"
      :total-pages="totalPages"
      :is-fetching="isFetching"
    />
  </main>
</template>
