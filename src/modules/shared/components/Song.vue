<script setup>
  import { ref } from 'vue';

  let title = ref('title');
  let artist = ref('artist');
</script>

<style lang="scss" scoped>
  .song-container {
    display: grid;
    grid-template-columns: 65px 1fr;
    grid-template-rows: 1fr 1fr;
    margin: 10px 0;

    .cover {
      position: relative;
      background-image: url('https://i1.sndcdn.com/artworks-4wL83CnbFTZa-0-t500x500.png');
      background-position: center;
      background-size: cover;
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
  <div class="song-container">
    <div class="cover g-shadow"></div>
    <div class="title">{{ title }}</div>
    <div class="artist">{{ artist }}</div>
  </div>
</template>
