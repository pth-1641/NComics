<script lang="ts" setup>
type ComicsPaginationProps = {
  comics: any;
  totalPages: number;
  title?: string;
  icon?: string;
};

const currentPage = ref<number>(1);
const route = useRoute();
const router = useRouter();

const props = defineProps<ComicsPaginationProps>();
const { icon, title } = props;
reactive({
  comics: props.comics,
  totalPages: props.totalPages,
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
    class="flex items-center gap-2 text-3xl font-semibold mb-4 mt-12"
    v-if="title"
  >
    <Icon :name="icon" size="36" class="text-emerald-500" />
    {{ title }}
  </h2>
  <div :class="`grid grid-cols-5 gap-5`">
    <div v-for="comic in comics" :key="comic.id">
      <ComicCard :comic="comic" :detail="true" />
    </div>
  </div>
  <ul class="flex justify-center items-stretch gap-2 py-8">
    <Icon
      name="lucide:chevron-first"
      size="32"
      class="p-1 rounded border hover:border-emerald-500 duration-100 cursor-pointer"
      @click="handleChangePage(1)"
    />
    <Icon
      name="lucide:chevron-left"
      size="32"
      class="p-1 rounded border hover:border-emerald-500 duration-100 cursor-pointer"
      @click="handleChangePage(currentPage - 1)"
    />
    <li
      v-for="page in [currentPage - 1, currentPage, currentPage + 1]"
      :key="page"
      :class="`px-3 flex items-center rounded border hover:border-emerald-500 duration-100 cursor-pointer ${
        page === currentPage ? 'bg-emerald-500 text-white' : ''
      }`"
      @click="handleChangePage(page)"
      v-show="page > 0"
    >
      {{ page }}
    </li>
    <Icon name="pepicons-pencil:dots-x" size="24" class="h-8" />
    <li
      v-for="page in [totalPages - 2, totalPages - 1, totalPages]"
      :key="page"
      :class="`px-3 flex items-center rounded border hover:border-emerald-500 duration-100 cursor-pointer ${
        page === currentPage ? 'bg-emerald-500 text-white' : ''
      }`"
      @click="handleChangePage(page)"
    >
      {{ page }}
    </li>
    <Icon
      name="lucide:chevron-right"
      size="32"
      class="p-1 rounded border hover:border-emerald-500 duration-100 cursor-pointer"
      @click="handleChangePage(currentPage + 1)"
    />
    <Icon
      name="lucide:chevron-last"
      size="32"
      class="p-1 rounded border hover:border-emerald-500 duration-100 cursor-pointer"
      @click="handleChangePage(totalPages)"
    />
  </ul>
</template>
