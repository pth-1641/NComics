<script lang="ts" setup>
import { Comic } from 'types';
import { historyDeleteComic } from '@/utils/localDb';

const props = defineProps<{
  comic: Comic & { last_reading?: string; chapter_id?: number };
  detail?: boolean;
  isHistory?: boolean;
}>();
const { comic, detail, isHistory = false } = props;
const {
  authors,
  followers,
  id,
  status,
  thumbnail,
  title,
  total_comments,
  total_views,
  is_trending,
  updated_at,
  chapter_id,
  last_reading,
} = comic;

const isImageLoaded = ref<boolean>(false);
const emit = defineEmits(['delete-comic']);

const handleClickCard = (e: Event, type: 'detail' | 'delete' | 'continue') => {
  e.stopPropagation();
  if (type === 'delete') {
    historyDeleteComic(id);
    emit('delete-comic', id);
    return;
  }
  if (type === 'continue') {
    navigateTo(`/comic/${id}/${chapter_id}`);
    return;
  }
  navigateTo(`/comic/${id}`);
};
</script>

<template>
  <div
    class="overflow-hidden rounded-md duration-500 border-2 border-transparent md:hover:border-emerald-300 relative group md:group-hover:shadow-md cursor-pointer"
    @click="(e) => handleClickCard(e, 'detail')"
  >
    <div
      class="flex gap-1 absolute font-semibold top-0 inset-x-0 z-10 text-xs text-white"
    >
      <span
        v-if="is_trending"
        class="bg-rose-500 py-0.5 px-2 rounded-b-sm first:rounded-bl-none"
      >
        Hot
      </span>
      <span
        v-if="status === 'Completed'"
        class="bg-sky-500 py-0.5 px-2 rounded-b-sm first:rounded-bl-none"
      >
        End
      </span>
      <span
        v-if="
          updated_at?.includes('trước') &&
          Number(updated_at.match(/\d+/)?.[0]) <= 3
        "
        class="bg-amber-400 py-0.5 px-2 rounded-b-sm first:rounded-bl-none"
      >
        Up
      </span>
    </div>
    <div class="relative">
      <div
        :class="`absolute inset-0 flex items-center justify-center text-white bg-gray-200 duration-150 ${
          isImageLoaded ? 'hidden' : 'block'
        }`"
      >
        <Icon name="line-md:loading-loop" size="48" />
      </div>
      <img
        :src="thumbnail"
        :alt="title"
        class="w-full aspect-[2/3] object-cover object-center scale-[1.01] group-hover:scale-105 duration-300 origin-bottom select-none"
        loading="lazy"
        @load="isImageLoaded = true"
      />
    </div>
    <div
      class="absolute top-1/2 bottom-0 inset-x-0 flex flex-col justify-end px-2 sm:px-4 py-2 bg-gradient-to-b from-transparent to-black"
    >
      <h5
        class="font-bold leading-5 text-lg text-white group-hover:text-emerald-400 text-shadow duration-200 line-clamp-2"
      >
        <abbr :title="title" class="no-underline">{{ title }}</abbr>
      </h5>
      <template v-if="detail">
        <hr class="mt-3 mb-0.5 border-gray-500" />
        <div>
          <p class="text-sm text-gray-300 truncate font-semibold">
            <template v-if="Array.isArray(authors)">
              {{ authors.join(' | ') }}
            </template>
            <template v-else-if="authors === 'Updating'">
              <span class="flex items-center gap-1">
                <Icon
                  name="mdi:dots-circle"
                  size="16"
                  class="text-emerald-500"
                />
                Updating
              </span>
            </template>
            <template v-else>{{ authors }} </template>
          </p>
          <div
            class="hidden md:flex items-center gap-0.5 justify-center gap-x-2 gap-y-1 text-emerald-400 text-xs py-1 mt-0.5"
            v-if="!isHistory"
          >
            <span class="flex items-center gap-1 bg-white/25 px-1 rounded">
              <Icon name="carbon:view-filled" />
              {{ total_views }}
            </span>
            <span class="flex items-center gap-1 bg-white/25 px-1 rounded">
              <Icon name="ant-design:heart-outlined" />
              {{ followers }}
            </span>
            <span class="flex items-center gap-1 bg-white/25 px-1 rounded">
              <Icon name="mingcute:comment-fill" />
              {{ total_comments }}
            </span>
          </div>
          <div v-else class="text-gray-300">
            <p
              class="text-sm font-semibold flex items-center gap-0.5 mb-1 text-fuchsia-400"
            >
              <Icon name="ph:read-cv-logo-fill" size="18" />
              {{ last_reading }}
            </p>
            <div class="flex items-center gap-1 text-sm text-white">
              <button
                class="bg-sky-500 w-full px-2 py-1 rounded-sm flex justify-center items-center gap-1"
                @click="(e) => handleClickCard(e, 'continue')"
              >
                <Icon name="system-uicons:book-text" size="20" />
                Continue
              </button>
              <button
                class="bg-rose-500 px-2 py-1 rounded-sm"
                @click="(e) => handleClickCard(e, 'delete')"
              >
                <Icon name="ion:trash" size="20" />
              </button>
            </div>
          </div>
        </div>
      </template>
      <span v-else class="py-1" />
    </div>
  </div>
</template>

<style scoped>
.group:hover .text-shadow {
  text-shadow: 0 0 6px #10b981;
}
</style>
