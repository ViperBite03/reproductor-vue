<script setup lang="ts">
  import type { ISong } from '@/modules/player/interfaces/ISong'
  import type { ISongMetadata } from '@/modules/backend/interfaces/ISongMetadata'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import InputTag from '@/modules/shared/components/InputTag.vue'
  import { ref, Ref, watch } from 'vue'
  import { setColor } from '@/modules/shared/scripts/generic'

  const musicStore = useMusicStore()

  let title: Ref<string> = ref('')
  let artist: Ref<string> = ref('')
  let cover: Ref<string> = ref('')
  let video: Ref<string> = ref('')
  let selectedTags: Ref<string[]> = ref([])

  const loading: Ref<boolean> = ref(false)

  const updateSong = async () => {
    loading.value = true

    const metadata: ISongMetadata = {
      title: title.value,
      artist: artist.value,
      date: new Date().toISOString(),
      extraData: {
        tags: [...selectedTags.value],
        cover: cover.value,
        video: video.value,
      },
    }

    console.log(metadata)

    await window.electron.ipcRenderer.invoke('write-metadata', metadata, musicStore.editingSong)

    loading.value = false
  }

  const toggleTag = (tagName: string) => {
    if (selectedTags.value.includes(tagName)) {
      selectedTags.value = selectedTags.value.filter((x) => x != tagName)
      return
    }

    selectedTags.value = [...selectedTags.value, tagName]
  }

  watch(
    () => musicStore.editingSong,
    () => {
      title.value = musicStore.editingSong.title
      artist.value = musicStore.editingSong.artist
      cover.value = musicStore.editingSong.cover
      video.value = musicStore.editingSong.video
      selectedTags.value = musicStore.editingSong.tags
    }
  )
</script>

<style lang="scss" scoped>
  #song-editor {
    height: 100%;
    overflow-y: auto;
    padding-right: 20px;

    .fields {
      .section {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-bottom: 20px;
        padding-top: 10px;

        .image-preview {
          width: 100%;
          aspect-ratio: 1;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: var(--radius);

          overflow: hidden;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }

        .tag-list {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          padding-bottom: 20px;

          .g-tag {
            cursor: pointer;

            &:hover {
              opacity: 0.8;
            }
          }
        }

        button,
        input {
          width: 100%;
        }
      }
    }
  }
</style>

<template>
  <div id="song-editor">
    <h2 class="g-title">SONG EDITOR</h2>

    <div class="fields">
      <div class="section">
        <input type="text" v-model="title" placeholder="Título" />
        <input type="text" v-model="artist" placeholder="Artista" />
      </div>

      <div class="section">
        <div
          class="image-preview"
          :style="{ 'background-image': `url(${musicStore.editingSong ? musicStore.editingSong.cover : ''})` }"
        ></div>
        <input type="text" v-model="cover" placeholder="Image URL" />
      </div>

      <div class="section">
        <div class="tag-list">
          <div
            class="g-tag"
            v-for="tag in musicStore.tags"
            :class="{ active: selectedTags.includes(tag.name) }"
            :style="{ 'background-color': tag.color, color: setColor(tag.color) }"
            @click="() => toggleTag(tag.name)"
          >
            {{ tag.name }}
          </div>
        </div>

        <InputTag />
      </div>

      <button @click="updateSong">{{ loading ? 'Actualizando...' : 'Actualizar' }}</button>
    </div>
  </div>
</template>
