<script setup>
  import AddSong from '@/modules/songlist/components/AddSong.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import Song from '@/modules/songlist/components/Song.vue'

  const musicStore = useMusicStore()

  console.log(musicStore)
</script>

<style lang="scss">
  .songlist {
    height: 100%;
    overflow-y: auto;
  }
</style>

<template>
  <div class="songlist">
    <Song v-for="song in musicStore.songsFiltered" :key="song.id" :song="song"> </Song>
  </div>
</template>
