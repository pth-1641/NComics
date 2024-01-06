<script lang="ts" setup>
const showFloatIcon = ref<boolean>(false);
const isInReading = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const loadingDiv = ref<HTMLDivElement>();

const route = useRoute();

onMounted(() => {
  isInReading.value = !!route.params.chapterId;
  document.addEventListener('scroll', () => {
    const heightOffset = document.documentElement.scrollTop;
    showFloatIcon.value = heightOffset > 2000;
  });
  isLoading.value = false;
  setTimeout(() => {
    if (loadingDiv.value) {
      loadingDiv.value.style.display = 'none';
    }
  }, 1000);
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
  <div
    :class="`fixed z-50 inset-0 bg-white flex items-center justify-center duration-300 ${
      isLoading
        ? 'opacity-1 pointer-events-auto'
        : 'opacity-0 pointer-events-none'
    }`"
    ref="loadingDiv"
  >
    <svg
      class="pl"
      viewBox="0 0 200 200"
      width="200"
      height="200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
          <stop offset="0%" stop-color="#22c55e" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
        <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#22c55e" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
      <circle
        class="pl__ring"
        cx="100"
        cy="100"
        r="82"
        fill="none"
        stroke="url(#pl-grad1)"
        stroke-width="36"
        stroke-dasharray="0 257 1 257"
        stroke-dashoffset="0.01"
        stroke-linecap="round"
        transform="rotate(-90,100,100)"
      />
      <line
        class="pl__ball"
        stroke="url(#pl-grad2)"
        x1="100"
        y1="18"
        x2="100.01"
        y2="182"
        stroke-width="36"
        stroke-dasharray="1 165"
        stroke-linecap="round"
      />
    </svg>
  </div>
  <button
    @click="scrollToTop"
    :class="`fixed p-2 bottom-6 right-6 flex items-center justify-center aspect-square rounded-full shadow bg-gray-50 -rotate-45 duration-200 sm:bottom-6 sm:right-6 ${
      showFloatIcon
        ? 'opacity-1 pointer-events-auto'
        : 'opacity-0 pointer-events-none'
    }`"
  >
    <Icon name="fluent:rocket-20-regular" size="30" />
  </button>
  <Footer v-show="!isInReading" />
</template>

<style scoped>
.pl {
  display: block;
  width: 6.25em;
  height: 6.25em;
}
.pl__ring,
.pl__ball {
  animation: ring 2s ease-out infinite;
}
.pl__ball {
  animation-name: ball;
}

@keyframes ring {
  from {
    stroke-dasharray: 0 257 0 0 1 0 0 258;
  }
  25% {
    stroke-dasharray: 0 0 0 0 257 0 258 0;
  }
  50%,
  to {
    stroke-dasharray: 0 0 0 0 0 515 0 0;
  }
}
@keyframes ball {
  from,
  50% {
    animation-timing-function: ease-in;
    stroke-dashoffset: 1;
  }
  64% {
    animation-timing-function: ease-in;
    stroke-dashoffset: -109;
  }
  78% {
    animation-timing-function: ease-in;
    stroke-dashoffset: -145;
  }
  92% {
    animation-timing-function: ease-in;
    stroke-dashoffset: -157;
  }
  57%,
  71%,
  85%,
  99%,
  to {
    animation-timing-function: ease-out;
    stroke-dashoffset: -163;
  }
}
</style>
