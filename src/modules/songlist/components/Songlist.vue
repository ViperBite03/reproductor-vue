<script setup>
  import AddSong from '@/modules/songlist/components/AddSong.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import Song from '@/modules/songlist/components/Song.vue'
  import { PANEL_OPTIONS } from '@/modules/settings/constants/settings'

  const musicStore = useMusicStore()

  console.log(musicStore)

  const toggleAddSong = () => {
    musicStore.panel = musicStore.panel ? '' : PANEL_OPTIONS.addSong
  }
</script>

<style lang="scss">
  .songlist {
    height: 100%;
    overflow-y: auto;
  }

  .add-song {
    border-radius: 100%;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
</style>

<template>
  <div class="songlist">
    <Song v-for="song in musicStore.songsFiltered" :key="song.id" :song="song"> </Song>
  </div>

  <button class="add-song" @click="toggleAddSong">+</button>
</template>
