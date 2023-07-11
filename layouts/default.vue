<script lang="ts" setup>
const showFloatIcon = ref<boolean>(false);
const isInReading = ref<boolean>(false);

const route = useRoute();

onMounted(() => {
  isInReading.value = !!route.params.chapterId;
  document.addEventListener('scroll', () => {
    const heightOffset = document.documentElement.scrollTop;
    showFloatIcon.value = heightOffset > 2000;
  });
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch(route, (route) => {
  isInReading.value = !!route.params.chapterId;
});
</script>

<template>
  <Navbar v-show="!isInReading" />
  <slot />
  <button
    @click="scrollToTop"
    :class="`fixed p-2 bottom-10 right-10 flex items-center justify-center aspect-square rounded-full shadow bg-gray-50 -rotate-45 duration-200 ${
      showFloatIcon
        ? 'opacity-1 pointer-events-auto'
        : 'opacity-0 pointer-events-none'
    }`"
  >
    <Icon name="fluent:rocket-20-regular" size="30" />
  </button>
  <Footer v-show="!isInReading" />
</template>
