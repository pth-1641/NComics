<script lang="ts" setup>
import { Genre } from 'types';

const currentGenre = ref<string>('');
const comics = ref<any>([]);
const totalPages = ref<number>(0);
const genres = ref<any>([]);
const initSlide = ref<number>(0);
const isFetching = ref<boolean>(false);

const router = useRouter();
const route = useRoute();

const getComics = async (genreId: string, page: number = 1) => {
  try {
    window.scrollTo(0, 0);
    isFetching.value = true;
    const data = await useAxios(`/genres/${genreId}?page=${page}`);
    comics.value = data.comics;
    totalPages.value = data.total_pages;
  } catch (err) {
    console.log(err);
  } finally {
    isFetching.value = false;
  }
};

const currentQuery = route.query.type as string;
currentGenre.value = currentQuery || 'all';
const [_, genresData] = await Promise.all([
  getComics(currentQuery),
  useAxios('/genres'),
]);
genres.value = genresData;
initSlide.value = genresData.findIndex(
  (genre: Genre) => genre.id === currentGenre.value
);

watch([currentGenre, route], async ([newGenre, route]) => {
  const page = route.query.page || 1;
  await getComics(newGenre, Number(page));
});

const handleChangeGenre = async (genreId: string) => {
  currentGenre.value = genreId;
  router.replace({
    query: {
      type: genreId,
    },
  });
};
</script>

<template>
  <main class="max-w-6xl mx-auto">
    <h2 class="flex items-center gap-2 text-3xl font-medium mb-4 mt-8">
      <Icon name="fa-solid:crown" size="36" class="text-emerald-500" />
      Genres
    </h2>
    <Swiper
      slides-per-view="auto"
      :loop="false"
      class="border-y"
      :modules="[SwiperFreeMode]"
      :free-mode="true"
      :initial-slide="initSlide"
    >
      <SwiperSlide
        v-for="genre in genres"
        :key="genre.id"
        :class="`swiper-slide-genre px-5 py-3 select-none cursor-pointer ${
          genre.id === currentGenre ? 'bg-emerald-500 text-white' : ''
        }`"
        @click="handleChangeGenre(genre.id)"
      >
        {{ genre.name }}
      </SwiperSlide>
    </Swiper>
    <p
      class="my-5 flex items-center gap-2 py-2 px-3 rounded bg-sky-500 text-white"
    >
      <Icon
        name="fluent:info-16-filled"
        size="30"
        class="w-full max-w-[30px]"
      />
      {{ genres?.find((genre: any) => genre.id === currentGenre)?.description }}
    </p>
    <ComicsPagination
      :comics="comics"
      :total-pages="totalPages"
      :is-fetching="isFetching"
    />
  </main>
</template>

<style scoped>
.swiper-slide-genre {
  width: max-content !important;
}
</style>
