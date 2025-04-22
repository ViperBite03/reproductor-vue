<script setup>
  import { player } from '@/modules/player/scripts/player'
  import { ref } from 'vue'

  const props = defineProps(['song'])

  console.log(props.song?.title)
</script>

<style lang="scss" scoped>
  .song-container {
    display: grid;
    grid-template-columns: 65px 1fr;
    grid-template-rows: 1fr 1fr;
    margin: 10px 0;

    .cover {
      background-image: url('https://i1.sndcdn.com/artworks-4wL83CnbFTZa-0-t500x500.png');

      height: 50px;
      width: 50px;
      border-radius: var(--maxRadius);

      grid-row: span 2;
    }

    .title {
      font-weight: bold;
      align-self: end;
    }

    .artist {
      font-weight: lighter;
      font-size: 14px;
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
