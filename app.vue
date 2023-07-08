<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
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
  width: 10px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #555;
}
</style>
