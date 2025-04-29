<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue'
  import { setAllSongs } from '@/modules/shared/scripts/generic'

  import Songlist from '@/modules/songlist/components/Songlist.vue'
  import Player from '@/modules/player/components/Player.vue'
  import SettingsPanel from '@/modules/settings/components/SettingsPanel.vue'
  import Playlist from '@/modules/playlist/components/Playlist.vue'
  import Toolbar from '@/modules/shared/components/Toolbar.vue'
  import Queue from '@/modules/songlist/components/Queue.vue'
  import { useMusicStore } from './modules/shared/constants/godStore'

  const musicStore = useMusicStore()
  let bg: Ref<string> = ref(
    'https://preview.redd.it/abstract-wallpaper-bundle-13-v0-g9z6vphde1le1.jpg?width=1080&crop=smart&auto=webp&s=475687a2a51af63558c09d9b80a2a3d768560ada'
  )

  const getSettings = () => {
    musicStore.volume = Number(JSON.parse(window.localStorage.getItem('volume') || '""')) || musicStore.volume

    musicStore.nightRate = Number(window.localStorage.getItem('nightValue')) || musicStore.nightRate
    musicStore.slowRate = Number(window.localStorage.getItem('slowValue')) || musicStore.slowRate

    musicStore.djModeStart = Number(window.localStorage.getItem('djModeStart') || musicStore.djModeStart)
    musicStore.djModeFinish = Number(window.localStorage.getItem('djModeFinish') || musicStore.djModeFinish)
  }

  onMounted(async () => {
    musicStore.tags = JSON.parse(window.localStorage.getItem('tags') || '[]')
    musicStore.playlists = JSON.parse(window.localStorage.getItem('playlists') || '[]')
    getSettings()
    await setAllSongs()
  })
</script>

<style lang="scss">
  @use '/src/sass/mixins.scss' as *;
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
    grid-template-rows: 70px 250px;

    &.openLeftPanel {
      grid-template-columns: 350px 1fr 350px;

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

      //border: 0.5px solid red;

      &:not(.settings-container, .songs-container) {
        padding: 20px;
      }
    }

    .settings-container {
      transition: 0.3s opacity 0.3s;
      opacity: 0;

      grid-row: span 5;
    }

    .queue-container {
      grid-row: span 2;
    }

    .player-container {
      grid-row: span 3;
    }

    .songs-container {
      grid-row: span 3;
    }

    @include microDevice {
      display: block;

      .container {
        display: none;
      }

      .player-container {
        display: block;
      }
    }
  }
</style>

<template>
  <div id="grid-container" :class="{ openLeftPanel: musicStore.panel }">
    <div
      class="bg"
      :style="{
        'background-image': `url('${musicStore.activeSong.howl ? musicStore.activeSong.cover : bg}')`,
      }"
    ></div>

    <div class="container settings-container">
      <SettingsPanel v-show="musicStore.panel" />
    </div>

    <div class="container toolbar-container">
      <Toolbar />
    </div>

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
