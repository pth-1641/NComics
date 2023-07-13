<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
    <NuxtErrorBoundary />
  </NuxtLayout>
</template>

<style>
html {
  scroll-behavior: smooth;
}

.swiper-button-prev,
.swiper-button-next {
  width: 36px;
  height: 36px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #10b981;
}

.swiper-button-prev::after,
.swiper-button-next::after {
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  transition: color 0.05s linear;
}

/* Scrollbar */
::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #888;
}
</style>
