<script setup>
  import { player } from '@/modules/player/scripts/player'
  import { ref } from 'vue'

  const props = defineProps(['song'])
</script>

<style lang="scss" scoped>
  .song-container {
    position: relative;
    transition: 0.3s ease;
    cursor: pointer;
    display: grid;
    grid-template-columns: 90px 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 10px 20px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .cover {
      height: 75px;
      width: 75px;
      border-radius: var(--maxRadius);

      grid-row: span 2;
    }

    .title {
      font-weight: bold;
      align-self: end;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .artist {
      font-weight: lighter;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>

<template>
  <div class="song-container" v-if="props.song" @click="() => player.play(props.song.fileName)">
    <div class="cover g-shadow" :style="{ 'background-image': `url('${props.song.cover}')` }"></div>
    <div class="title">{{ props.song.title }}</div>
    <div class="artist">{{ props.song.artist }}</div>
  </div>
</template>
