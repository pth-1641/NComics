<script lang="ts" setup>
import { ComicComments, ComicDetail, Comment } from '@/types';
import { meta } from '@/utils/data';

type Chapter = {
  name: string;
  id: number;
};
type Tab = 'chapters' | 'comments';

const route = useRoute();
const comicId = route.params.comicId as string;
const CHAPTER_PER_PAGE = 50;

const chaptersSection = ref<Chapter[]>([]);
const currentTab = ref<Tab>('chapters');
const comments = ref<Comment[]>([]);
const description = ref<any>(null);

const commentPage = ref<number>(1);
const currentChapterPage = ref<number>(0);

const isFetching = ref<boolean>(false);
const isTooLongDesciption = ref<boolean>(false);
const showFullDesciption = ref<boolean>(false);

const showDownloadModal = ref<boolean>(false);
const downloadChapters = ref<number[]>([]);

const data = (async () => {
  const [comic, commentsData]: [ComicDetail, ComicComments] = await Promise.all(
    [useAxios(`/comics/${comicId}`), useAxios(`/comics/${comicId}/comments`)]
  );
  comments.value = commentsData.comments;
  return {
    comic,
    commentsData,
  };
})();

const { comic } = await data;
const newestChapter = comic.chapters[0]?.name.match(/\d+(\.\d+)?/)?.[0];
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

const handleLoadComments = async () => {
  try {
    isFetching.value = true;
    commentPage.value += 1;
    const data = await useAxios(
      `/comics/${comicId}/comments?page=${commentPage.value}`
    );
    comments.value = [...comments.value, ...data.comments];
  } catch (err) {
    console.log(err);
  } finally {
    isFetching.value = false;
  }
};

const handleAddDownloadChapter = (chapterId: number) => {
  if (downloadChapters.value.includes(chapterId)) {
    const chapterIdx = downloadChapters.value.indexOf(chapterId);
    downloadChapters.value.splice(chapterIdx, 1);
  } else {
    downloadChapters.value = [...downloadChapters.value, chapterId];
  }
};

const handleDownloadChapters = async () => {
  try {
    for (const chapterId of downloadChapters.value) {
      const href = `/api/download?comicId=${comicId}&chapterId=${chapterId}`;
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(href);
    }
    showDownloadModal.value = false;
    downloadChapters.value = [];
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  const { clientHeight, scrollHeight } = description.value;
  isTooLongDesciption.value = clientHeight < scrollHeight;
});

watch(showDownloadModal, (status) => {
  document.body.style.overflow = status ? 'hidden' : 'auto';
});

useSeoMeta(
  meta({
    title: comic.title + ' | NComics',
    description: comic.description,
  })
);
useServerSeoMeta(
  meta({
    title: comic.title + ' | NComics',
    description: comic.description,
  })
);
</script>

<template>
  <div class="relative pt-12">
    <div
      class="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-emerald-100 -z-10"
    />
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
        <div
          class="flex gap-1 absolute font-semibold top-0 inset-x-0 z-10 text-xs text-white"
        >
          <span
            v-if="comic.status === 'Finished'"
            class="bg-sky-500 py-0.5 px-2 rounded-b-sm first:rounded-bl-none"
          >
            End
          </span>
          <span
            v-if="comic.is_adult"
            class="bg-rose-500 py-0.5 px-2 rounded-b-sm first:rounded-bl-none"
          >
            18+
          </span>
        </div>
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
            <div v-for="(author, idx) in comic.authors" :key="author">
              <NuxtLink
                :to="`/search?q=${author.replace(/\s+/g, '+')}`"
                class="text-fuchsia-500"
              >
                {{ author }}
              </NuxtLink>
              <span class="select-none" v-if="idx < comic.authors.length - 1">
                -
              </span>
            </div>
          </template>
          <template v-else-if="comic.authors === 'Updating'">
            <span class="flex items-center gap-1">
              <Icon name="mdi:dots-circle" size="16" class="text-emerald-500" />
              Updating
            </span>
          </template>
          <template v-else>
            <NuxtLink
              :to="`/search?q=${comic.authors.replace(/\s+/g, '+')}`"
              class="text-fuchsia-500"
            >
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
            <Icon name="ph:star-fill" size="20" class="text-yellow-400" />
            <template v-if="comic.total_views === 'Updating'">
              Updating
            </template>
            <template v-else>
              {{ comic.average * 2 }}
            </template>
          </span>
        </div>
        <div class="mt-2" v-if="comic.description">
          <p
            :class="showFullDesciption ? 'line-clamp-none' : 'line-clamp-5'"
            ref="description"
          >
            {{ comic.description.replace(/NetTruyen/g, 'NComics') }}
          </p>
          <button
            v-if="isTooLongDesciption"
            class="font-semibold hover:underline"
            @click="showFullDesciption = !showFullDesciption"
          >
            {{ showFullDesciption ? 'Show less' : 'Show more' }}
          </button>
        </div>
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
          <button
            class="flex flex-col ml-4 items-center text-sm font-semibold text-gray-700"
            @click="showDownloadModal = true"
          >
            <Icon name="octicon:download-16" size="24" />
            Download
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
      <div v-show="currentTab === 'chapters'">
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
      <div v-show="currentTab === 'comments'">
        <Comments :comments="comments" />
        <div class="w-max mx-auto mt-4">
          <Icon name="line-md:loading-loop" size="42" v-if="isFetching" />
          <button
            v-else
            class="bg-emerald-100 text-emerald-500 font-medium rounded-full px-4 py-1.5"
            @click="handleLoadComments"
          >
            Load more
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Download -->
  <div
    :class="`fixed z-50 inset-0 bg-[rgba(0,0,0,0.8)] flex flex-col items-center justify-center duration-200 ${
      showDownloadModal
        ? 'opacity-1 pointer-events-auto'
        : 'opacity-0 pointer-events-none'
    }`"
  >
    <img
      src="@/assets/img/download_girls.webp"
      alt="Download"
      draggable="false"
    />
    <div class="bg-white rounded-lg py-4 px-6 w-full max-w-3xl">
      <h3 class="text-2xl font-semibold">Select chapters</h3>
      <ul
        class="grid grid-cols-5 gap-3 max-h-[45vh] overflow-auto my-3 py-1 pr-1 select-none"
      >
        <li
          v-for="chapter in comic.chapters"
          :key="chapter.id"
          :class="`border rounded px-2 py-1 cursor-pointer duration-100 truncate ${
            downloadChapters.includes(chapter.id)
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : ''
          }`"
          @click="handleAddDownloadChapter(chapter.id)"
        >
          {{ chapter.name }}
        </li>
      </ul>
      <div class="flex items-center justify-end gap-5 font-medium">
        <button class="text-rose-500" @click="showDownloadModal = false">
          Cancel
        </button>
        <button
          class="text-white px-2.5 py-1.5 rounded flex items-center gap-1.5 bg-emerald-500"
          @click="handleDownloadChapters"
        >
          Download
        </button>
      </div>
    </div>
  </div>
</template>
