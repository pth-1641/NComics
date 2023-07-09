<script lang="ts" setup>
import { dynamicRoutes } from '@/utils/data';

const route = useRoute();
const router = useRouter();

const routeData = dynamicRoutes.find((r) => r.path === route.path);
if (!routeData) router.push('/404');

const comics = ref<any>();
const isFetching = ref<boolean>(false);

const getCommics = async (page: number) => {
  try {
    window.scrollTo(0, 0);
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
  const page = route.query.page || 1;
  await getCommics(Number(page));
});
</script>

<template>
  <main class="max-w-6xl mx-auto">
    <ComicsPagination
      :is-fetching="isFetching"
      :comics="comics?.comics"
      :total-pages="comics?.total_pages"
      :title="routeData?.title"
      :icon="routeData?.icon"
    />
  </main>
</template>
