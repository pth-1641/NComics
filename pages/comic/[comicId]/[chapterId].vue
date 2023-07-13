<script lang="ts" setup>
import { Comment } from '@/types';

const currentPage = ref<number>(1);
const inputRangeVal = ref<number>(1);
const commentPage = ref<number>(1);

const openEpisode = ref<boolean>(false);
const showToolbar = ref<boolean>(true);
const openComments = ref<boolean>(false);
const isFetching = ref<boolean>(false);
const isEnd = ref<boolean>(false);

const comments = ref<Comment[]>([]);
const totalComments = ref<number>(0);

const route = useRoute();
const { chapterId, comicId } = route.params;

const { images, chapters, comic_name, chapter_name } = await useAxios(
  `/comics/${comicId}/chapters/${chapterId}`
);

const getComments = async () => {
  try {
    isFetching.value = true;
    commentPage.value += 1;
    const data = await useAxios(
      `/comics/${comicId}/comments?chapter=${chapterId}&page=${commentPage.value}`
    );
    comments.value = [...comments.value, ...data.comments];
    if (commentPage.value >= data.total_pages) isEnd.value = true;
    return data.total_comments;
  } catch (err) {
    console.log(err);
  } finally {
    isFetching.value = false;
  }
};

const handleChangeEpisode = (type: 'prev' | 'next') => {
  const episodes = [...chapters].reverse();
  const chapterIdx = episodes.findIndex(
    (chapter: any) => chapter.id === Number(chapterId)
  );
  const nextChapterIdx = chapterIdx + (type === 'next' ? 1 : -1);
  navigateTo(`/comic/${comicId}/${episodes[nextChapterIdx].id}`);
};

const handleShowToolbar = (e: Event) => {
  if (e.target !== e.currentTarget) return;
  showToolbar.value = !showToolbar.value;
  openEpisode.value = false;
};

const handleCloseComments = (e: Event) => {
  if (e.target !== e.currentTarget) return;
  openComments.value = false;
};

const handleDownload = async () => {
  try {
    const href = `/api/download?comicId=${comicId}&chapterId=${chapterId}`;
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(href);
  } catch (err) {
    console.log(err);
  }
};

watch(inputRangeVal, (newValue) => {
  const el = document.getElementById(newValue.toString());
  el?.scrollIntoView({ behavior: 'smooth' });
});

const getElementsPos = () => {
  const elements = document.querySelectorAll('.image-source');
  const foundEle = Array.from(elements).find((el) => {
    const rect = el.getBoundingClientRect();
    return rect.top > 0;
  });
  if (foundEle) {
    currentPage.value = Number(foundEle.getAttribute('id')) - 1;
  } else {
    currentPage.value = images.length;
  }
};

onBeforeMount(async () => {
  totalComments.value = await getComments();
});
onMounted(() => document.addEventListener('scroll', getElementsPos));
onBeforeUnmount(() => document.removeEventListener('scroll', getElementsPos));

watch(openComments, (status) => {
  document.body.style.overflow = status ? 'hidden' : 'auto';
});

useSeoMeta(
  meta({
    title: `${comic_name} - ${chapter_name} | NComics`,
  })
);
useServerSeoMeta(
  meta({
    title: `${comic_name} - ${chapter_name} | NComics`,
  })
);
</script>

<template>
  <main class="bg-zinc-900 min-h-screen">
    <div class="flex flex-col max-w-2xl mx-auto">
      <img
        v-for="image in images"
        :src="image.src"
        :alt="`Page ${image.page}`"
        loading="lazy"
        :id="image.page"
        class="image-source"
      />
    </div>
    <div class="fixed inset-0" @click="handleShowToolbar">
      <div
        :class="`absolute inset-0 z-10 bg-[rgba(0,0,0,0.9)] flex items-center justify-center duration-200 ${
          openComments
            ? 'opacity-1 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`"
        @click="handleCloseComments"
      >
        <div
          :class="`relative bg-white rounded-md duration-300 ${
            openComments ? 'scale-1' : 'scale-0'
          }`"
        >
          <Icon
            name="icon-park:close-small"
            size="32"
            class="cursor-pointer absolute top-3 right-3"
            @click="openComments = false"
          />
          <div
            class="w-full max-w-4xl max-h-[75vh] overflow-auto py-5 p-10 text-sm"
          >
            <h4 class="text-2xl font-bold text-zinc-600">Comments</h4>
            <Comments :comments="comments" />
            <div class="w-max mx-auto pb-2 mt-6" v-if="!isEnd">
              <Icon name="line-md:loading-loop" size="42" v-if="isFetching" />
              <button
                v-else
                class="bg-emerald-100 text-emerald-500 font-medium rounded-full px-4 py-1.5"
                @click="getComments"
              >
                Load more
              </button>
            </div>
            <div
              v-else
              class="mt-6 text-center font-bold text-gray-700 select-none"
            >
              - END -
            </div>
          </div>
        </div>
      </div>
      <div
        :class="`select-none top-0 inset-x-0 bg-[rgba(0,0,0,0.9)] flex items-center justify-center gap-2 py-3 text-gray-300 font-medium duration-200 ${
          showToolbar
            ? 'translate-y-0 opacity-1'
            : '-translate-y-full opacity-0'
        }`"
      >
        <NuxtLink :to="`/comic/${comicId as string}`">{{
          comic_name
        }}</NuxtLink>
        <Icon name="icon-park-outline:right" size="16" />
        <span>{{ chapter_name }}</span>
      </div>
      <div
        :class="`select-none absolute flex items-center justify-center gap-8 py-2 bottom-0 inset-x-0 bg-[rgba(0,0,0,0.75)] text-gray-400 text-sm font-medium duration-300
           ${
             showToolbar
               ? 'translate-y-0 opacity-1'
               : 'translate-y-full opacity-0'
           }
        `"
      >
        <div class="flex items-center gap-2">
          <span class="w-16" v-text="`${currentPage} / ${images.length}`" />
          <input
            type="range"
            min="1"
            :max="images.length"
            v-model="currentPage"
            step="1"
            @input="(e:any) => inputRangeVal = parseInt(e.target.value)"
          />
        </div>
        <div class="flex items-center gap-3">
          <button
            class="px-3 py-1 bg-emerald-200 text-emerald-500 rounded-full"
            @click="handleChangeEpisode('prev')"
          >
            Previous
          </button>
          <button
            class="px-3 py-1 bg-emerald-200 text-emerald-500 rounded-full"
            @click="handleChangeEpisode('next')"
          >
            Next
          </button>
          <button
            class="px-3 py-1 bg-fuchsia-200 text-fuchsia-500 rounded-full relative"
            @click="openEpisode = !openEpisode"
          >
            Episodes
            <div
              :class="`absolute bg-zinc-900 w-60 py-3 rounded bottom-9 text-white right-1/2 translate-x-1/2 text-left duration-200 origin-bottom ${
                openEpisode ? 'scale-1' : 'scale-0'
              }`"
            >
              <h5 class="text-lg px-4 pb-1">
                All Episodes ({{ chapters.length }})
              </h5>
              <ul class="overflow-auto text-sm h-max max-h-72 font-normal">
                <NuxtLink
                  v-for="chapter in chapters"
                  :to="`/comic/${comicId}/${chapter.id}`"
                  :key="chapter.id"
                  :class="`py-2 block truncate px-5 duration-100 hover:bg-zinc-950 ${
                    chapter.id == chapterId ? 'text-emerald-500' : ''
                  }`"
                  :id="chapter.id"
                >
                  {{ chapter.name }}
                </NuxtLink>
              </ul>
            </div>
          </button>
        </div>
        <span class="border-b rotate-90 w-4 border-gray-400" />
        <div class="flex items-center gap-6">
          <button class="flex items-center gap-2" @click="openComments = true">
            <span class="relative">
              <Icon
                name="majesticons:comment-2-text-line"
                size="24"
                class="text-white"
              />
              <span
                class="absolute -right-2 -top-2 text-xs bg-zinc-600 rounded text-gray-200 px-0.5"
              >
                {{ totalComments }}
              </span>
            </span>
            Comments
          </button>
          <button class="flex items-center gap-2">
            <Icon
              name="fluent:star-add-24-regular"
              size="24"
              class="text-white"
            />
            Favorite
          </button>
          <button class="flex items-center gap-2" @click="handleDownload">
            <Icon name="octicon:download-16" size="24" class="text-white" />
            Download
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
input[type='range'] {
  height: 20px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 280px;
  background-color: transparent;
}
input[type='range']:focus {
  outline: none;
}
input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  height: 2px;
  cursor: pointer;
  animation: 0.2s;
  box-shadow: 0px 0px 0px #94a3b8;
  background: #94a3b8;
  border-radius: 0px;
  border: 0px solid #94a3b8;
}
input[type='range']::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #94a3b8;
  border: 0px solid #71717a;
  height: 14px;
  width: 6px;
  border-radius: 0px;
  background: #10b981;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -6px;
}
input[type='range']:focus::-webkit-slider-runnable-track {
  background: #94a3b8;
}
input[type='range']::-moz-range-track {
  width: 100%;
  height: 2px;
  cursor: pointer;
  animation: 0.2s;
  box-shadow: 0px 0px 0px #94a3b8;
  background: #94a3b8;
  border-radius: 0px;
  border: 0px solid #94a3b8;
}
input[type='range']::-moz-range-thumb {
  box-shadow: 0px 0px 0px #94a3b8;
  border: 0px solid #71717a;
  height: 14px;
  width: 6px;
  border-radius: 0px;
  background: #10b981;
  cursor: pointer;
}
input[type='range']::-ms-track {
  width: 100%;
  height: 2px;
  cursor: pointer;
  animation: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type='range']::-ms-fill-lower {
  background: #94a3b8;
  border: 0px solid #94a3b8;
  border-radius: 0px;
  box-shadow: 0px 0px 0px #94a3b8;
}
input[type='range']::-ms-fill-upper {
  background: #94a3b8;
  border: 0px solid #94a3b8;
  border-radius: 0px;
  box-shadow: 0px 0px 0px #94a3b8;
}
input[type='range']::-ms-thumb {
  margin-top: 1px;
  box-shadow: 0px 0px 0px #94a3b8;
  border: 0px solid #71717a;
  height: 14px;
  width: 6px;
  border-radius: 0px;
  background: #10b981;
  cursor: pointer;
}
input[type='range']:focus::-ms-fill-lower {
  background: #94a3b8;
}
input[type='range']:focus::-ms-fill-upper {
  background: #94a3b8;
}
</style>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
</style>
