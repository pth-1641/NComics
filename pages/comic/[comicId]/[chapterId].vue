<script lang="ts" setup>
import { useAxios } from '@/composables';

const route = useRoute();
const { chapterId, comicId } = route.params;

const { images } = await useAxios(`/comics/${comicId}/images/${chapterId}`);
</script>

<template>
  <main class="flex flex-col max-w-2xl mx-auto">
    <img v-for="image in images" :src="image.src" :alt="`Page ${image.page}`" />
  </main>
</template>
