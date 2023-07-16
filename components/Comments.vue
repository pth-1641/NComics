<script lang="ts" setup>
import { Comment } from '@/types';

const props = defineProps<{ comments: Comment[]; isEnd: boolean }>();

reactive({
  comments: props.comments,
  isEnd: props.isEnd,
});
</script>

<template>
  <div class="grid gap-6 mt-5">
    <div class="flex gap-3 w-full" v-for="comment in comments">
      <img
        :src="comment.avatar"
        :alt="comment.username"
        class="h-10 w-10 rounded-full object-cover"
        draggable="false"
      />
      <div>
        <h5 class="font-bold">
          {{ comment.username }}
        </h5>
        <p class="break-word">{{ comment.content }}</p>
        <div class="flex items-end gap-1 flex-wrap">
          <img
            v-for="sticker in comment.stickers"
            :src="sticker"
            class="max-w-[150px] object-cover rounded h-max"
            alt="NComics"
            draggable="false"
          />
        </div>
        <p
          class="text-xs font-semibold text-gray-600 mt-1 flex flex-wrap items-center gap-2 sm:gap-4"
        >
          {{ comment.created_at }}
          <span class="flex items-center gap-0.5 text-sm font-normal">
            <Icon name="iconamoon:like-thin" size="16" />
            {{ comment.vote_count }}
          </span>
        </p>
        <div class="flex sm:gap-5 mt-4">
          <Icon
            name="bi:reply-all"
            v-if="comment.replies.length"
            class="rotate-180 text-emerald-500 w-0 max-w-[28px] sm:w-full"
            size="28"
          />
          <div class="grid gap-4">
            <div class="grid gap-3" v-for="reply in comment.replies">
              <div class="flex gap-3">
                <img
                  :src="reply.avatar"
                  :alt="reply.username"
                  class="h-10 w-10 rounded-full object-cover"
                  draggable="false"
                />
                <div>
                  <h5 class="font-bold">{{ reply.username }}</h5>
                  <p class="break-word">
                    <span class="text-emerald-500 font-bold">
                      {{ reply.mention_user }}
                    </span>
                    {{ reply.content }}
                  </p>
                  <div class="flex items-end gap-1 flex-wrap">
                    <img
                      v-for="sticker in reply.stickers"
                      :src="sticker"
                      class="max-w-[150px] object-cover rounded h-max"
                      alt="NComics"
                      draggable="false"
                    />
                  </div>
                  <p
                    class="text-xs text-gray-600 mt-1 flex items-center flex-wrap gap-2 sm:gap-4 font-semibold"
                  >
                    {{ reply.created_at }}
                    <span class="flex items-center gap-0.5 text-sm font-normal">
                      <Icon name="iconamoon:like-thin" size="16" />
                      {{ reply.vote_count }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isEnd && comments?.length"
      class="mt-6 text-center font-bold text-gray-700 select-none"
    >
      - END -
    </div>
    <div
      v-if="!comments?.length"
      class="mt-6 text-center text-2xl font-bold text-gray-700 select-none"
    >
      No comments
    </div>
  </div>
</template>
