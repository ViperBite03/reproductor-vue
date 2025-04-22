<script lang="ts" setup>
  import { Ref, ref } from 'vue'
  import { cleanYouTubeTitle } from '@/modules/settings/scripts/cleanTitle'
  import { Howl } from 'howler'
  import type { IScrapData } from '@/modules/backend/interfaces/IScrapData'
  import type { ISongMetadata } from '@/modules/backend/interfaces/ISongMetadata'
  import type { ITag } from '@/modules/player/interfaces/ITag'
  import { ISong } from '@/modules/player/interfaces/ISong'
  import { useMusicStore } from '@/modules/shared/constants/godStore'

  const youtubeURL = ref('')
  const songName = ref('test')

  const songTitle: Ref<string> = ref('')
  const songArtist: Ref<string> = ref('')
  const songVideoclip: Ref<string> = ref('')
  const songTags: Ref<string[]> = ref([])

  const googleImages: Ref<string[]> = ref([])
  const googleImageSelected: Ref<string> = ref('')

  let scrapResult: IScrapData

  const getMetadataFromYT = async () => {
    scrapResult = await window.electron.ipcRenderer.invoke('scrap-song', youtubeURL.value)

    const { title, artist } = cleanYouTubeTitle(scrapResult.youtubeTitle, scrapResult.artist)

    songTitle.value = title
    songArtist.value = artist
    songVideoclip.value = scrapResult.youtubeURL

    const googleSearch = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(`${artist}+${title}`)}&searchType=image&key=${import.meta.env.VITE_GOOGLE_API_KEY}&cx=${import.meta.env.VITE_GOOGLE_CX}`
    const imagesResult = await (await fetch(googleSearch)).json()

    googleImages.value = imagesResult.items.map((img) => img.link)
  }

  const saveSongAndMetadata = async () => {
    const musicStore = useMusicStore()
    const fileName = `${songArtist.value} - ${songTitle.value}`

    await window.electron.ipcRenderer.invoke('download-file', scrapResult.downloadURL, fileName)

    const metadata: ISongMetadata = {
      title: songTitle.value,
      artist: songArtist.value,
      date: new Date().toISOString(),
      extraData: {
        tags: [...songTags.value],
        cover: googleImageSelected.value,
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
      lyrics: '',
    }

    musicStore.songs = [song, ...musicStore.songs]
    musicStore.songsFiltered = [song, ...musicStore.songs]
  }

  const selectImage = (newUrl: string) => {
    googleImageSelected.value = newUrl
  }

  const play = async () => {
    const path = await window.electron.ipcRenderer.invoke('get-path')
    console.log(path + songName.value + '.mp3')

    const howl = new Howl({
      src: [path + songName.value + '.mp3'],
      rate: 1.2,
      volume: 0.2,
      onplay: () => {
        console.log('Playing...')
      },
      onplayerror: (err) => {
        console.error(err)
      },
    })

    console.log(path + songName.value + '.mp3')

    howl.play()
  }
</script>

<style lang="scss" scoped>
  #add-song {
    .section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-bottom: 20px;
      padding-top: 10px;
    }

    .google-images {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
      gap: 10px;
    }

    .google-image {
      cursor: pointer;
      transition: 0.3s ease;
      border-radius: var(--radius);
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;

      &:hover {
        transform: scale(0.9);
      }
    }
  }
</style>

<template>
  <div id="add-song">
    <h2 class="g-title">ADD SONG</h2>

    <h3>FASE 1: Descargar canción</h3>
    <div class="section">
      <input type="text" v-model="youtubeURL" placeholder="youtube url" />
      <button @click="getMetadataFromYT">Obtener metadatos</button>

      <input type="text" v-model="songTitle" placeholder="Título" />
      <input type="text" v-model="songArtist" placeholder="Artista" />
      <input type="text" v-model="songVideoclip" placeholder="Videoclip URL (opcional)" />
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

    <button @click="saveSongAndMetadata">Descargar canción</button>

    <input type="text" v-model="songName" />
    <button @click="play">Play song test</button>
  </div>
</template>
