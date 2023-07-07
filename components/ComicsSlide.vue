<script lang="ts" setup>
type ComicsSlideProps = {
  comics: any;
  title: string;
  icon: string;
};

const props = defineProps<ComicsSlideProps>();
const { comics, title, icon } = props;
</script>

<template>
  <h2 class="flex items-center gap-2 text-3xl font-semibold mb-4 mt-12">
    <Icon :name="icon" size="36" class="text-emerald-500" />
    {{ title }}
  </h2>
  <Swiper
    :slides-per-view="5"
    :navigation="true"
    :space-between="20"
    :modules="[SwiperGrid, SwiperNavigation]"
    :grid="{
      rows: 2,
      fill: 'row',
    }"
  >
    <SwiperSlide v-for="comic in comics" :key="comic.id">
      <ComicCard :comic="comic" :detail="true" />
    </SwiperSlide>
  </Swiper>
</template>
