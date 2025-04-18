<script lang="ts" setup>
  import { ref } from 'vue'
  import { cleanYouTubeTitle } from '@/modules/settings/scripts/cleanTitle'
  import { Howl } from 'howler'
  import { IScrapData } from '@/modules/backend/interfaces/IScrapData'

  const youtubeURL = ref('')
  const songName = ref('test')

  const songTitle = ref('')
  const songAuthor = ref('')
  const googleImages = ref([])
  const googleImageSelected = ref('')

  const downloadSong = async () => {
    const scrapResult: IScrapData = await window.electron.ipcRenderer.invoke('scrap-song', youtubeURL.value)

    const { title, author } = cleanYouTubeTitle(scrapResult.youtubeTitle, scrapResult.author)

    songTitle.value = title
    songAuthor.value = author

    const googleSearch = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(`${author}+${title}`)}&searchType=image&key=${import.meta.env.VITE_GOOGLE_API_KEY}&cx=${import.meta.env.VITE_GOOGLE_CX}`

    const imagesResult = await (await fetch(googleSearch)).json()

    googleImages.value = imagesResult.items.map((x) => x.link)

    console.log(googleImages.value)
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
      volume: 0.5,
      onplay: () => {
        console.log('Playing...')
      },
      onplayerror: (err) => {
        console.error(err)
      },
    })

    howl.play()
  }
</script>

<style lang="scss" scoped>
  #add-song {
    .section {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-bottom: 50px;
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

      <input type="text" v-model="songTitle" placeholder="Título" />
      <input type="text" v-model="songAuthor" placeholder="Artista" />

      <button @click="downloadSong">Descargar cancion</button>
    </div>

    <h3>FASE 2: Elegir imagen</h3>

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

    <h3>FASE 3: Elegir tags</h3>
    <div class="section">Proximamente...</div>

    <button @click="play">Play song test</button>
  </div>
</template>
