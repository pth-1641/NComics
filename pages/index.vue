<script lang="ts" setup>
const data = (async () => {
  const [
    trendingComics,
    completedComics,
    recentlyUpdateComics,
    recommendComics,
    boyComics,
    girlComics,
  ] = await Promise.all([
    useAxios('/trending-comics'),
    useAxios('/completed-comics'),
    useAxios('/recent-update-comics'),
    useAxios('/recommend-comics'),
    useAxios('/boy-comics'),
    useAxios('/girl-comics'),
  ]);
  return {
    trendingComics,
    completedComics,
    recentlyUpdateComics,
    recommendComics,
    boyComics,
    girlComics,
  };
})();

const {
  completedComics,
  recentlyUpdateComics,
  trendingComics,
  recommendComics,
  boyComics,
  girlComics,
} = await data;
</script>

<template>
  <main class="max-w-6xl mx-auto py-5">
    <Swiper
      :slides-per-view="6"
      :loop="true"
      :space-between="10"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :modules="[SwiperAutoplay]"
    >
      <SwiperSlide v-for="comic in recommendComics" :key="comic.id">
        <ComicCard :comic="comic" :detail="false" />
      </SwiperSlide>
    </Swiper>
    <ComicsSlide
      title="Popular Comics"
      :comics="trendingComics.comics"
      icon="mdi:fire"
      link="/popular"
    />
    <ComicsSlide
      title="Completed Comics"
      :comics="completedComics.comics"
      icon="ph:seal-check-fill"
      link="/completed"
    />
    <ComicsSlide
      title="Recently Update"
      :comics="recentlyUpdateComics.comics"
      icon="mdi:clock-outline"
      link="/recent"
    />
    <ComicsSlide
      title="Boy Comics"
      :comics="boyComics.comics"
      icon="tabler:gender-male"
      link="/boy"
    />
    <ComicsSlide
      title="Girl Comics"
      :comics="girlComics.comics"
      icon="tabler:gender-female"
      link="/girl"
    />
  </main>
</template>
