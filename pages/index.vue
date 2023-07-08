<script lang="ts" setup>
import { useAxios } from '../composables';

const data = (async () => {
  const [
    trendingComics,
    completedComics,
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
    completedComics,
    recentlyUpdateComics,
    recommendComics,
  };
})();

const {
  completedComics,
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
  </main>
</template>
