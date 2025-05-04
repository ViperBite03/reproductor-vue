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

  .add-song-container {
    position: absolute;
    bottom: 0px;
    right: 0px;
    padding: 20px;
    padding-left: 200px;

    .add-song {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;

      border-radius: var(--radius);
      backdrop-filter: blur(5px);
    }
  }
</style>

<template>
  <div class="songlist">
    <Song v-for="song in musicStore.songsFiltered" :key="song.fileName" :song="song"> </Song>
  </div>

  <span class="add-song-container">
    <button class="add-song" @click="toggleAddSong">
      <Svg name="AddMusic" fill="transparent" stroke="var(--colorPrimary)"></Svg>
    </button>
  </span>
</template>
