<script setup>
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import SongSlim from '@/modules/songlist/components/SongSlim.vue'

  const musicStore = useMusicStore()
</script>

<style lang="scss">
  #queue {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;

    .queue-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>

<template>
  <div id="queue">
    <h2 class="g-title">QUEUE</h2>

    <div class="queue-list">
      <SongSlim v-for="(song, index) in musicStore.queue" :key="song.fileName" :song="song" :index="index"> </SongSlim>
    </div>
  </div>
</template>
