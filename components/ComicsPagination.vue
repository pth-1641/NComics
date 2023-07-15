<script lang="ts" setup>
type ComicsPaginationProps = {
  comics: any;
  totalPages: number;
  isFetching: boolean;
  title?: string;
  icon?: string;
  isHistory?: boolean;
};

const currentPage = ref<number>(1);
const route = useRoute();
const router = useRouter();

const props = defineProps<ComicsPaginationProps>();
const { icon, title, isHistory } = props;
reactive({
  comics: props.comics,
  totalPages: props.totalPages || 0,
  isFetching: props.isFetching || false,
});

onMounted(() => {
  const page = route.query.page || 1;
  currentPage.value = Number(page);
});

watch(route, (route) => {
  const page = route.query.page || 1;
  currentPage.value = Number(page);
});

const handleChangePage = async (page: number) => {
  currentPage.value = page;
  router.replace({ query: { ...route.query, page } });
};
</script>

<template>
  <h2
    class="flex items-center gap-2 text-xl title md:text-3xl font-bold mb-4 mt-12"
    v-if="title"
  >
    <Icon :name="icon" size="36" class="text-emerald-500" />
    {{ title }} - Page {{ currentPage }}
  </h2>
  <div
    class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-1.5 md:gap-3 lg:gap-4 responsive-devices"
  >
    <div
      v-for="(_, idx) in new Array(20)"
      :key="idx"
      v-if="isFetching"
      class="aspect-[2/3] rounded bg-gray-100 animation-pulse"
    />
    <div v-for="comic in comics" :key="comic.id" v-else>
      <ComicCard :is-history="isHistory" :comic="comic" :detail="true" />
    </div>
  </div>
  <vue-awesome-paginate
    :total-items="totalPages"
    :items-per-page="1"
    :max-pages-shown="3"
    v-model="currentPage"
    :show-ending-buttons="true"
    :hide-prev-next-when-ends="true"
    :disable-breakpoint-buttons="true"
    :on-click="handleChangePage"
  >
    <template #first-page-button>
      <Icon name="icon-park:go-start" size="28" />
    </template>
    <template #prev-button>
      <Icon name="icon-park:left" size="28" />
    </template>
    <template #next-button>
      <Icon name="icon-park:right" size="28" />
    </template>
    <template #last-page-button>
      <Icon name="icon-park:go-end" size="28" />
    </template>
  </vue-awesome-paginate>
</template>

<style>
.pagination-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 50px;
}
.paginate-buttons {
  height: 36px;
  width: 36px;
  border-radius: 100px;
  cursor: pointer;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: black;
}
.paginate-buttons:hover {
  background-color: #d8d8d8;
}
.active-page {
  background-color: #10b981;
  border: 1px solid #10b981;
  color: white;
}
.active-page:hover {
  background-color: #059669;
}
</style>

<style scoped>
@media only screen and (min-width: 320px) and (max-width: 576px) {
  .responsive-devices {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media only screen and (min-width: 576px) and (max-width: 768px) {
  .responsive-devices {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }
  .title {
    font-size: 1.5rem;
    line-height: 2rem;
  }
}
</style>
