<script lang="ts" setup>
  import { Ref, ref } from 'vue'
  import { cleanYouTubeTitle } from '@/modules/settings/scripts/cleanTitle'
  import type { IScrapData } from '@/modules/backend/interfaces/IScrapData'
  import type { ISongMetadata } from '@/modules/backend/interfaces/ISongMetadata'
  import { ISong } from '@/modules/player/interfaces/ISong'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import InputTag from '@/modules/shared/components/InputTag.vue'
  import { setColor } from '@/modules/shared/scripts/generic'

  const youtubeURL = ref('')

  const songTitle: Ref<string> = ref('')
  const songArtist: Ref<string> = ref('')
  const songTags: Ref<string[]> = ref([])
  const loadingMetaData: Ref<boolean> = ref(false)
  const loadingMP3: Ref<boolean> = ref(false)
  const selectedTags: Ref<string[]> = ref([])

  const googleImages: Ref<string[]> = ref([])
  const googleImageSelected: Ref<string> = ref('')

  const musicStore = useMusicStore()

  let scrapResult: IScrapData

  const getMetadataFromYT = async () => {
    loadingMetaData.value = true

    scrapResult = await window.electron.ipcRenderer.invoke('scrap-song', youtubeURL.value)

    const { title, artist } = cleanYouTubeTitle(scrapResult.youtubeTitle, scrapResult.artist)

    songTitle.value = title.replace(/[\\\/:*?"<>|]/g, '')
    songArtist.value = artist.replace(/[\\\/:*?"<>|]/g, '')

    const googleSearch = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(`${artist}+${title}`)}&searchType=image&key=${import.meta.env.VITE_GOOGLE_API_KEY}&cx=${import.meta.env.VITE_GOOGLE_CX}`
    const imagesResult = await (await fetch(googleSearch)).json()

    googleImages.value = imagesResult.items.map((img) => img.link)

    loadingMetaData.value = false
  }

  const saveSongAndMetadata = async () => {
    loadingMP3.value = true

    const fileName = `${songArtist.value} - ${songTitle.value}`

    await window.electron.ipcRenderer.invoke('download-file', scrapResult.downloadURL, fileName)

    const metadata: ISongMetadata = {
      title: songTitle.value,
      artist: songArtist.value,
      date: new Date().toISOString(),
      extraData: {
        tags: [...selectedTags.value],
        cover: googleImageSelected.value,
        video: youtubeURL.value,
      },
    }

    await window.electron.ipcRenderer.invoke('write-metadata', metadata, fileName)

    const song: ISong = {
      fileName: fileName,
      title: metadata.title || fileName,
      artist: metadata.artist || '',
      tags: metadata.extraData.tags,
      date: new Date(metadata.date),
      cover: metadata.extraData.cover || '',
      video: metadata.extraData.video,
      lyrics: '',
    }

    musicStore.songs = [song, ...musicStore.songs]
    musicStore.songsFiltered = musicStore.songs

    //reset
    songTitle.value = ''
    songArtist.value = ''
    youtubeURL.value = ''
    googleImages.value = []
    googleImageSelected.value = ''

    loadingMP3.value = false
  }

  const selectImage = (newUrl: string) => {
    googleImageSelected.value = newUrl
  }

  const toggleTag = (tagName: string) => {
    if (selectedTags.value.includes(tagName)) {
      selectedTags.value = selectedTags.value.filter((x) => x != tagName)
      return
    }

    selectedTags.value = [...selectedTags.value, tagName]
  }
</script>

<style lang="scss" scoped>
  #add-song {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    padding-right: 20px;

    .section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-bottom: 20px;
      padding-top: 10px;

      &.row {
        flex-direction: row;
      }

      .tag-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 10px;
        padding-bottom: 20px;

        .g-tag {
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

    .google-images {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
      gap: 10px;
      max-height: 200px;
      overflow: scroll;
    }

    .google-image {
      cursor: pointer;
      transition: 0.3s ease;
      border-radius: var(--radius);
      width: 100%;
      aspect-ratio: 1;
      object-fit: contain;

      &:hover {
        transform: scale(0.9);
      }
    }

    button {
      width: 100%;
    }
  }
</style>

<template>
  <div id="add-song">
    <h2 class="g-title">ADD SONG</h2>

    <div class="section row">
      <input type="text" v-model="youtubeURL" placeholder="youtube url" />
      <button @click="getMetadataFromYT">
        {{ loadingMetaData ? '...' : 'Metadatos' }}
      </button>
    </div>

    <div class="section">
      <input type="text" v-model="songTitle" placeholder="Título" />
      <input type="text" v-model="songArtist" placeholder="Artista" />
    </div>

    <div class="section">
      <div class="google-images">
        <img
          v-for="src of googleImages"
          @click="() => selectImage(src)"
          class="google-image"
          :src="src"
          alt="Google-img"
        />
      </div>

      <input type="text" v-model="googleImageSelected" placeholder="Image url" />
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

    <button @click="saveSongAndMetadata">{{ loadingMP3 ? 'Descargando...' : 'Descargar canción' }}</button>
  </div>
</template>
