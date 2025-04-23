<script setup>
  import AddSong from '@/modules/songlist/components/AddSong.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import Song from '@/modules/songlist/components/Song.vue'

  const musicStore = useMusicStore()

  console.log(musicStore)
</script>

<style lang="scss">
  #songlist {
  }
</style>

<template>
  <div id="settings">
    <h2 class="g-title">SongList</h2>

    <!-- Queue list porque? -->
    <div class="queue-list" v-for="song in musicStore.songsFiltered" :key="song.id">
      <Song :song="song"> </Song>
    </div>
  </div>
</template>
