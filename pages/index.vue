<script lang="ts" setup>
import { meta } from '@/utils/data';

const [
  trendingComics,
  completedComics,
  recentlyUpdateComics,
  recommendComics,
  boyComics,
  girlComics,
] = await Promise.all([
  useFetchData('/trending-comics'),
  useFetchData('/completed-comics'),
  useFetchData('/recent-update-comics'),
  useFetchData('/recommend-comics'),
  useFetchData('/boy-comics'),
  useFetchData('/girl-comics'),
]);

useSeoMeta(meta());
useServerSeoMeta(meta());
</script>

<template>
  <main class="max-w-6xl mx-auto py-5 px-3">
    <Swiper
      :slides-per-view="6"
      :loop="true"
      :space-between="10"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :modules="[SwiperAutoplay]"
      :breakpoints="{
        0: {
          slidesPerView: 1,
        },
        320: {
          slidesPerView: 2,
        },
        576: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 5,
        },
        1280: {
          slidesPerView: 6,
        },
      }"
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
