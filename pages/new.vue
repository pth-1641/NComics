<script lang="ts" setup>
import { useAxios } from '@/composables';

const newComics = await useAxios('/new-comics');
</script>

<template>
  <main class="max-w-6xl mx-auto">
    <ComicsPagination
      :comics="newComics.comics"
      title="New Comics"
      icon="clarity:new-solid"
    />
  </main>
</template>
