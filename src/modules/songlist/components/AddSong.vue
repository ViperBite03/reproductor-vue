<script setup>
  import { onMounted, ref } from 'vue'
  import { Howl } from 'howler'

  const youtubeURL = ref('')
  const songName = ref('')

  const downloadSong = async () => {
    const result = await window.electron.ipcRenderer.invoke(
      'download-song',
      youtubeURL.value
    )
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
