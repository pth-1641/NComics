<script lang="ts" setup>
import { initLocalDb } from './utils/localDb';

onBeforeMount(() => initLocalDb());
</script>

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
  -webkit-tap-highlight-color: transparent;
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

@media screen and (max-width: 576px) {
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: transparent;
  }
}
</style>

<style>
@font-face {
  font-family: Nunito;
  font-weight: 400;
  src: url(@/assets/fonts/Nunito-Regular.ttf) format('truetype');
}
@font-face {
  font-family: Nunito;
  font-weight: 500;
  src: url(@/assets/fonts/Nunito-Medium.ttf) format('truetype');
}
@font-face {
  font-family: Nunito;
  font-weight: 600;
  src: url(@/assets/fonts/Nunito-SemiBold.ttf) format('truetype');
}
@font-face {
  font-family: Nunito;
  font-weight: 700;
  src: url(@/assets/fonts/Nunito-Bold.ttf) format('truetype');
}

@font-face {
  font-family: Nunito;
  font-weight: 800;
  src: url(@/assets/fonts/Nunito-ExtraBold.ttf) format('truetype');
}

html {
  font-family: Nunito, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
