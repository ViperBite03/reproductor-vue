<script setup>
  import AddSong from '@/modules/songlist/components/AddSong.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import Song from '@/modules/songlist/components/Song.vue'
  import { PANEL_OPTIONS } from '@/modules/settings/constants/settings'
  import Svg from '@/modules/shared/components/Svg.vue'

  const musicStore = useMusicStore()

  const toggleAddSong = () => {
    if (musicStore.panel === PANEL_OPTIONS.addSong) {
      musicStore.panel = ''
      return
    }

    musicStore.panel = PANEL_OPTIONS.addSong
  }
</script>

<style lang="scss">
  .songlist {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .add-song {
    border-radius: 100%;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 70px;
    height: 70px;
    border-radius: var(--radius);
    backdrop-filter: blur(5px);
  }
</style>

<template>
  <div class="songlist">
    <Song v-for="song in musicStore.songsFiltered" :key="song.fileName" :song="song"> </Song>
  </div>

  <button class="add-song" @click="toggleAddSong">
    <Svg name="AddMusic" fill="transparent" stroke="var(--colorPrimary)"></Svg>
  </button>
</template>
