<script lang="ts" setup>
import { dynamicRoutes } from '@/utils/data';

const route = useRoute();

const routeData = dynamicRoutes.find((r) => r.path === route.path);
if (!routeData) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

const comics = ref<any>();
const isFetching = ref<boolean>(false);

const getCommics = async (page: number) => {
  try {
    isFetching.value = true;
    const data = await useAxios(`${routeData?.apiPath}?page=${page}`);
    comics.value = data;
  } catch (err) {
    console.log(err);
  } finally {
    isFetching.value = false;
  }
};

onBeforeMount(async () => {
  const page = route.query.page || 1;
  await getCommics(Number(page));
});

watch(route, async (route) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const page = route.query.page || 1;
  await getCommics(Number(page));
});
</script>

<template>
  <Head>
    <Title>{{
      `${
        routeData
          ? `${routeData.title} - Page ${route.query.page ?? 1} | NComics`
          : 'NComics'
      }`
    }}</Title>
    <Meta name="description" content="Free comic and manga reader online" />
  </Head>
  <main class="max-w-6xl mx-auto">
    <ComicsPagination
      :is-fetching="isFetching"
      :comics="comics?.comics"
      :total-pages="comics?.total_pages || 0"
      :title="routeData?.title"
      :icon="routeData?.icon"
    />
  </main>
</template>
