<script lang="ts" setup>
import { useAxios } from '../composables';

const data = (async () => {
  const [
    trendingComics,
    finishedComics,
    recentlyUpdateComics,
    recommendComics,
  ] = await Promise.all([
    useAxios('/trending-comics'),
    useAxios('/completed-comics'),
    useAxios('/recent-update-comics'),
    useAxios('/recommend-comics'),
  ]);
  return {
    trendingComics,
    finishedComics,
    recentlyUpdateComics,
    recommendComics,
  };
})();

const {
  finishedComics,
  recentlyUpdateComics,
  trendingComics,
  recommendComics,
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
    />
    <ComicsSlide
      title="Finished Comics"
      :comics="finishedComics.comics"
      icon="ph:seal-check-fill"
    />
    <ComicsSlide
      title="Recently Update"
      :comics="recentlyUpdateComics.comics"
      icon="mdi:clock-outline"
    />
  </main>
</template>
