<script lang="ts" setup>
import { Comment } from '@/types';

const props = defineProps<{ comments: Comment[] }>();

reactive({
  comments: props.comments,
});
</script>

<template>
  <div class="grid gap-6 mt-5">
    <div class="flex gap-3" v-for="comment in comments">
      <img
        :src="comment.avatar"
        :alt="comment.username"
        class="h-10 w-10 rounded-full object-cover"
        draggable="false"
      />
      <div>
        <h5 class="font-medium">
          {{ comment.username }}
        </h5>
        <p class="break-word">{{ comment.content }}</p>
        <img
          v-for="sticker in comment.stickers"
          :src="sticker"
          class="max-w-[150px] object-cover rounded"
          alt="NComics"
          draggable="false"
        />
        <p class="text-sm text-gray-600 mt-1 flex items-center gap-4">
          {{ comment.created_at }}
          <span class="flex items-center gap-0.5">
            <Icon name="iconamoon:like-thin" size="16" />
            {{ comment.vote_count }}
          </span>
        </p>
        <div class="flex gap-5 mt-4">
          <Icon
            name="bi:reply-all"
            v-if="comment.replies.length"
            class="rotate-180 text-emerald-500"
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
                  <h5 class="font-medium">{{ reply.username }}</h5>
                  <p class="break-all">
                    <span class="text-emerald-500 font-medium">
                      {{ reply.mention_user }}
                    </span>
                    {{ reply.content }}
                  </p>
                  <img
                    v-for="sticker in reply.stickers"
                    :src="sticker"
                    class="max-w-[150px] object-cover rounded"
                    alt="NComics"
                    draggable="false"
                  />
                  <p class="text-sm text-gray-600 mt-1 flex items-center gap-4">
                    {{ reply.created_at }}
                    <span class="flex items-center gap-0.5">
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
  </div>
</template>
