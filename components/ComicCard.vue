<script lang="ts" setup>
import { Comic } from 'types';

const props = defineProps<{
  comic: Comic;
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
} = comic;
</script>

<template>
  <div
    class="overflow-hidden rounded-md duration-500 border-2 border-transparent hover:border-emerald-300 relative group group-hover:shadow-md cursor-pointer"
    @click="navigateTo(`/comic/${id}`)"
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
    <img
      :src="thumbnail"
      :alt="title"
      class="w-full aspect-[2/3] object-cover object-center scale-[1.01] group-hover:scale-105 duration-300 origin-bottom select-none"
      loading="lazy"
    />
    <div
      class="absolute top-1/2 bottom-0 inset-x-0 flex flex-col justify-end px-4 py-2 bg-gradient-to-b from-transparent to-black"
    >
      <h5
        class="font-semibold leading-5 text-lg text-white group-hover:text-emerald-400 text-shadow duration-200 line-clamp-2"
      >
        <abbr :title="title" class="no-underline">{{ title }}</abbr>
      </h5>
      <template v-if="detail">
        <hr class="mt-3 mb-0.5 border-gray-500" />
        <div>
          <p class="text-sm text-gray-300 truncate font-medium">
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
            class="flex items-center justify-between text-emerald-400 text-xs py-1 mt-0.5"
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
