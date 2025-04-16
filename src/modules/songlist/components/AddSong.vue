<script setup>
  import { onMounted, ref } from 'vue'

  console.log(window.electron)

  const youtubeURL = ref('')

  const downloadSong = async () => {
    const result = await window.electron.ipcRenderer.invoke(
      'download-song',
      youtubeURL.value
    )

    console.log(result)
  }
</script>

<style lang="scss" scoped>
  #add-song {
  }
</style>

<template>
  <div id="add-song">
    <h2 class="g-title">ADD SONG</h2>

    <input type="text" v-model="youtubeURL" />

    <button @click="downloadSong">Descargar cancion</button>
  </div>
</template>
