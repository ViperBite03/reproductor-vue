<script setup lang="ts">
  import { player } from '@/modules/player/scripts/player'
  import Svg from '@/modules/shared/components/Svg.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'

  const props = defineProps(['song', 'index'])
  const musicStore = useMusicStore()

  const removeSongFromQueue = () => {
    musicStore.queue = musicStore.queue.filter((_, i) => i != props.index)
  }

  const removeAndPlay = () => {
    player.play(props.song.fileName)
    removeSongFromQueue()
  }
</script>

<style lang="scss">
  .song-slim-container {
    transition: 0.3s ease;
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: var(--radius);
    overflow: hidden;
    padding: 10px 0;
    flex-shrink: 0;
    opacity: 0.5;
    filter: grayscale(1);

    &:hover {
      transform: rotateZ(0deg);
      filter: grayscale(0);
      opacity: 1;
    }

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      top: 0;
      z-index: -1;
      opacity: 1;
      -webkit-mask-image: linear-gradient(black, transparent);
      mask-image: linear-gradient(90deg, black, transparent);
    }

    .names {
      width: 100%;
      padding: 10px;

      .title {
        color: var(--colorPrimary);
        font-weight: bold;
      }

      .artist {
        font-size: 12px;
      }

      &:hover {
        transform: scale(1);
      }
    }

    button {
      border: 0;
      background-color: unset;
      text-align: left;
      padding: 0;
    }
  }
</style>

<template>
  <div class="song-slim-container" v-if="props.song">
    <button class="names" @click="removeAndPlay">
      <div class="title">{{ props.song.title }}</div>
      <div class="artist">{{ props.song.artist }}</div>
    </button>

    <button @click="removeSongFromQueue">
      <Svg name="Trash" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
    </button>
    <img :src="props.song.cover" alt="" />
  </div>
</template>
