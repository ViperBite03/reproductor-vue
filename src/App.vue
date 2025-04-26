<script setup>
  import { onMounted, ref } from 'vue'
  import { setAllSongs } from '@/modules/shared/scripts/generic'

  import Songlist from '@/modules/songlist/components/Songlist.vue'
  import Player from '@/modules/player/components/Player.vue'
  import Settings from '@/modules/settings/components/Settings.vue'
  import Playlist from '@/modules/playlist/components/Playlist.vue'
  import Queue from '@/modules/songlist/components/Queue.vue'
  import { useMusicStore } from './modules/shared/constants/godStore'

  const musicStore = useMusicStore()

  onMounted(async () => {
    await setAllSongs()
  })
</script>

<style lang="scss">
  @use '@/sass/global';

  #grid-container {
    transition: 0.3s ease;
    position: relative;
    max-width: 100vw;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    display: grid;
    grid-template-columns: 0px 1fr 350px;
    grid-template-rows: 70px 220px 1fr 1fr 1fr;

    &.openLeftPanel {
      grid-template-columns: 320px 1fr 350px;

      .settings-container {
        padding: 20px;
        opacity: 1;
      }
    }

    .bg {
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      filter: blur(30px);
    }

    .container {
      position: relative;
      height: 100%;
      min-width: 0;
      min-height: 0;

      &:not(.settings-container, .songs-container) {
        padding: 20px;
      }
    }

    .settings-container {
      transition: 0.3s opacity 0.2s;
      opacity: 0;

      grid-row: span 5;
    }

    .queue-container {
      grid-row: span 3;
    }

    .player-container {
      grid-row: span 2;
    }

    .songs-container {
      grid-row: span 3;
    }
  }
</style>

<template>
  <div id="grid-container" :class="{ openLeftPanel: musicStore.panel }">
    <div class="bg" :style="{ 'background-image': `url('${musicStore.activeSong.cover}')` }"></div>

    <div class="container settings-container" @click="toggle">
      <Settings v-show="musicStore.panel" />
    </div>

    <div class="container toolbar-container">ToolBar</div>

    <div class="container queue-container">
      <Queue />
    </div>

    <div class="container playlist-container">
      <Playlist />
    </div>

    <div class="container songs-container">
      <Songlist />
    </div>

    <div class="container player-container">
      <Player />
    </div>
  </div>
</template>
