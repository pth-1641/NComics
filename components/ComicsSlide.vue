<script lang="ts" setup>
type ComicsSlideProps = {
  comics: any;
  title: string;
  icon: string;
  link: string;
};

const props = defineProps<ComicsSlideProps>();
const { comics, title, icon, link } = props;
</script>

<template>
  <div class="flex items-center justify-between mb-4 mt-12">
    <h2 class="flex items-center gap-2 text-3xl font-semibold">
      <Icon :name="icon" size="36" class="text-emerald-500" />
      {{ title }}
    </h2>
    <NuxtLink
      :to="link"
      class="cursor-pointer rounded-full px-3 py-0.5 overflow-hidden bg-transparent hover:border-transparent border-2 border-emerald-500 group hover:bg-emerald-500 text-emerald-500 hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-emerald-400 duration-300"
    >
      <span class="text-sm font-medium"> More </span>
    </NuxtLink>
  </div>
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
