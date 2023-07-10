<script lang="ts" setup>
const showFloatIcon = ref<boolean>(false);

onMounted(() =>
  document.addEventListener('scroll', () => {
    const heightOffset = document.documentElement.scrollTop;
    showFloatIcon.value = heightOffset > 2000;
  })
);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <Navbar />
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
  <Footer />
</template>
