<script setup>
  import { onMounted, ref } from 'vue'
  import { setAllSongs } from '@/modules/shared/scripts/generic'
  import gsap from 'gsap'

  import Songlist from '@/modules/songlist/components/Songlist.vue'
  import Player from '@/modules/player/components/Player.vue'
  import Settings from '@/modules/settings/components/Settings.vue'
  import Playlist from '@/modules/playlist/components/Playlist.vue'
  import Queue from '@/modules/songlist/components/Queue.vue'

  const expanded = ref(true)

  const toggle = () => {
    /* gsap.to('#grid-container', {
      duration: 2,
      ease: 'elastic.inOut',
      '--col1': expanded.value ? '3fr' : '1fr',
    })

    expanded.value = !expanded.value*/
  }

  onMounted(async () => {
    await setAllSongs()
  })
</script>

<style lang="scss">
  @use '@/sass/global';

  #grid-container {
    --col1: 350px;

    position: relative;
    width: 100vw;
    height: 100vh;
    display: grid;

    grid-template-columns: 320px 1fr 400px;
    grid-template-rows: 220px 1fr 1fr 1fr;

    > * {
      box-shadow: inset 0 0 0 1px var(--colorPrimary);
      padding: 20px;
    }

    .settings-container {
      grid-row: span 4;
    }

    .songs-container {
      grid-row: span 3;
    }

    .player-container,
    .queue-container {
      grid-row: span 2;
    }
  }
</style>

<template>
  <div id="grid-container">
    <div class="settings-container" @click="toggle">
      <Settings />
    </div>

    <div class="playlist-container">
      <Playlist />
    </div>

    <div class="queue-container">
      <Queue />
    </div>

    <div class="songs-container">
      <Songlist />
    </div>
    <div class="player-container">
      <Player />
    </div>
  </div>
</template>
