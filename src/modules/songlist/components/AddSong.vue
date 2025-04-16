<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { cleanYouTubeTitle } from '@/modules/settings/scripts/cleanTitle'
  import { Howl } from 'howler'
  import { IScrapData } from '@/modules/backend/interfaces/IScrapData'

  const youtubeURL = ref('')
  const songName = ref('')

  const downloadSong = async () => {
    console.log(youtubeURL.value)
    const result: IScrapData = await window.electron.ipcRenderer.invoke('scrap-song', youtubeURL.value)

    console.log(cleanYouTubeTitle(result.youtubeTitle))
  }

  const play = async () => {
    const path = await window.electron.ipcRenderer.invoke('get-path')
    console.log(path + songName.value + '.mp3')

    const howl = new Howl({
      src: [path + songName.value + '.mp3'],
      rate: 1.2,
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
  }
</style>

<template>
  <div id="add-song">
    <h2 class="g-title">ADD SONG</h2>

    <input type="text" v-model="youtubeURL" placeholder="youtube url" />

    <button @click="downloadSong">Descargar cancion</button>

    <input type="text" v-model="songName" placeholder="song name" />
    <button @click="play">Play song test</button>
  </div>
</template>
