<script lang="ts" setup>
import { useAxios } from '@/composables';
import { Comic, ComicComments } from '@/types';

type Chapter = {
  name: string;
  id: number;
};
type Tab = 'chapters' | 'comments';

const route = useRoute();
const comicId = route.params.comicId;
const CHAPTER_PER_PAGE = 50;

const currentChapterPage = ref<number>(0);
const chaptersSection = ref<Chapter[]>([]);
const currentTab = ref<Tab>('chapters');

const data = (async () => {
  const [comic, comments]: [Comic, ComicComments] = await Promise.all([
    useAxios(`/comics/${comicId}`),
    useAxios(`/comics/${comicId}/comments`),
  ]);
  return {
    comic,
    comments,
  };
})();

const { comic, comments } = await data;
const newestChapter = comic.chapters[0].name.match(/\d+(\.\d+)?/)?.[0];
const totalChapterPage = Math.ceil(Number(newestChapter) / CHAPTER_PER_PAGE);

const getChapter = (start: number, end: number) => {
  const limit = CHAPTER_PER_PAGE * 6;
  const chapters = [...comic.chapters]
    .reverse()
    .slice(start < limit ? 0 : start - limit, end + limit)
    .filter((chapter) => {
      const chap = chapter.name.match(/\d+(\.\d+)?/)?.[0];
      if (!chap) return false;
      if (parseFloat(chap) >= start && parseFloat(chap) <= end + 0.99)
        return true;
      return false;
    });
  return chapters;
};

chaptersSection.value = getChapter(0, CHAPTER_PER_PAGE);

const handleChangeChapterGroup = (idx: number) => {
  currentChapterPage.value = idx;
  chaptersSection.value = getChapter(
    idx === 0 ? 0 : idx * CHAPTER_PER_PAGE + 1,
    (idx + 1) * CHAPTER_PER_PAGE
  );
};
</script>

<template>
  <div class="h-80 bg-gradient-to-b from-emerald-100 pt-12">
    <div
      class="max-w-5xl mx-auto border-4 border-white rounded-xl grid grid-cols-4 gap-6 p-4"
    >
      <div
        class="col-span-1 aspect-[2/3] rounded-lg border-2 overflow-hidden border-emerald-500 relative"
      >
        <img
          class="w-full h-full object-cover"
          :src="comic.thumbnail"
          :alt="comic.title"
          draggable="false"
        />
        <span
          v-if="comic.is_adult"
          class="absolute top-0 left-0 font-bold text-white text-xs bg-rose-500 py-0.5 px-2 rounded-b-sm"
        >
          18+
        </span>
      </div>
      <div class="col-span-3">
        <h4 class="text-3xl font-bold">{{ comic.title }}</h4>
        <p class="mb-3 mt-1 text-sm font-semibold text-gray-700">
          {{ comic.other_names.join(' | ') }}
        </p>
        <div class="font-medium text-sm flex flex-wrap items-center gap-2 my-1">
          <NuxtLink
            v-for="genre in comic.genres"
            :to="`/genres?type=${genre.id}`"
            class="px-2 py-0.5 rounded bg-transparent border-2 border-emerald-300 duration-100 hover:bg-emerald-300"
          >
            {{ genre.name }}
          </NuxtLink>
        </div>
        <div class="font-medium flex items-center gap-2 my-1">
          Creator:
          <template v-if="Array.isArray(comic.authors)">
            <NuxtLink v-for="author in comic.authors">
              {{ author }}
            </NuxtLink>
          </template>
          <template v-else-if="comic.authors === 'Updating'">
            <span class="flex items-center gap-1">
              <Icon name="mdi:dots-circle" size="16" class="text-emerald-500" />
              Updating
            </span>
          </template>
          <template v-else>
            <NuxtLink>
              {{ comic.authors }}
            </NuxtLink>
          </template>
        </div>
        <div class="flex items-center font-medium text-gray-800 gap-4">
          <span class="flex items-center gap-1">
            <Icon name="carbon:view-filled" size="20" class="text-sky-500" />
            <template v-if="comic.total_views === 'Updating'">
              Updating
            </template>
            <template v-else>
              {{ comic.total_views.toLocaleString() }}
            </template>
          </span>
          <span class="flex items-center gap-1">
            <Icon name="mdi:heart" size="20" class="text-rose-500" />
            <template v-if="comic.total_views === 'Updating'">
              Updating
            </template>
            <template v-else>
              {{ comic.followers.toLocaleString() }}
            </template>
          </span>
          <span class="flex items-center gap-1">
            <Icon name="ph:star-fill" size="20" class="text-yellow-500" />
            <template v-if="comic.total_views === 'Updating'">
              Updating
            </template>
            <template v-else>
              {{ comic.average * 2 }}
            </template>
          </span>
        </div>
        <p class="mt-2" v-if="comic.description">
          {{ comic.description.replace(/NetTruyen/g, 'NComics') }}
        </p>
        <div class="flex items-center gap-3 mt-5">
          <NuxtLink
            :to="`/comic/${comic.id}/${comic.chapters.at(-1)?.id}`"
            class="flex items-center gap-1 border-2 border-emerald-500 rounded bg-emerald-500 text-white text-lg px-6 py-2 font-medium"
          >
            <Icon name="carbon:book" size="24" />
            Read Now
          </NuxtLink>
          <button
            class="flex items-center gap-1 rounded border-2 border-emerald-500 text-emerald-500 text-lg px-6 py-2 font-medium"
          >
            <Icon name="tabler:heart-plus" size="24" />
            Favorite
          </button>
        </div>
      </div>
    </div>
    <div class="max-w-5xl mx-auto">
      <div
        class="flex items-center gap-6 font-semibold text-xl border-b-2 py-1"
      >
        <button
          :class="`flex items-center gap-1 ${
            currentTab === 'chapters' ? 'text-emerald-500' : ''
          }`"
          @click="currentTab = 'chapters'"
        >
          <Icon name="bytesize:book" size="20" />
          Chapters
        </button>
        <button
          :class="`flex items-center gap-1 ${
            currentTab === 'comments' ? 'text-emerald-500' : ''
          }`"
          @click="currentTab = 'comments'"
        >
          <Icon name="mingcute:comment-fill" size="20" />
          Comments
        </button>
      </div>
      <div v-if="currentTab === 'chapters'">
        <div
          class="flex items-center gap-3 my-5 text-gray-800 font-medium flex-wrap"
        >
          <button
            v-for="(_, idx) in new Array(totalChapterPage)"
            :class="`px-2 py-0.5 rounded-full ${
              idx === currentChapterPage
                ? 'bg-emerald-100 text-emerald-500'
                : 'bg-gray-100'
            }`"
            @click="handleChangeChapterGroup(idx)"
          >
            <template v-if="idx + 1 < totalChapterPage">
              {{
                `${idx === 0 ? 0 : idx * CHAPTER_PER_PAGE + 1} - ${
                  (idx + 1) * CHAPTER_PER_PAGE
                }`
              }}
            </template>
            <template v-else>
              {{ `${idx * CHAPTER_PER_PAGE + 1} - ${newestChapter}` }}
            </template>
          </button>
        </div>
        <ul class="grid grid-cols-4 gap-4">
          <NuxtLink
            v-for="chapter in chaptersSection"
            class="border rounded px-3 py-2 truncate hover:bg-emerald-50 duration-100"
            :to="`/comic/${comic.id}/${chapter.id}`"
          >
            <abbr :title="chapter.name" class="no-underline">
              {{ chapter.name }}
            </abbr>
          </NuxtLink>
        </ul>
      </div>
      <Comments v-else :comments="comments.comments" />
    </div>
  </div>
</template>
