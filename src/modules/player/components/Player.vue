<script lang="ts" setup>
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { player } from '@/modules/player/scripts/player'
  import Svg from '@/modules/shared/components/Svg.vue'
  import Progress from './Progress.vue'
  import Volume from './Volume.vue'

  import Fullscreen from './Fullscreen.vue'

  const musicStore = useMusicStore()

  const togglePlay = () => {
    musicStore.isPaused ? player.resume() : player.pause()
  }
</script>

<style lang="scss" scoped>
  #player {
    height: 100%;
    width: 100%;
    padding: 25px;

    background-color: var(--colorSecondary);
    border-radius: var(--radius);

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    //box-shadow: 0px 10px 29px -14px var(--colorSecondary);

    * {
      user-select: none;
      border: none;
    }

    .button-bar {
      display: flex;
      gap: 10px;
    }

    .cover {
      overflow: hidden;
      border-radius: var(--radius);
      width: 100%;
      aspect-ratio: 1;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      position: relative;

      cursor: pointer;

      .details {
        text-align: center;
        position: absolute;
        bottom: 0;
        padding: 20px;
        padding-top: 50px;
        width: 100%;
        background-color: var(--colorSecondary);
        background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(255, 255, 255, 0) 100%);

        .title {
          font-size: 20px;
          color: var(--colorText);
          font-weight: bold;
          text-align: left;
        }

        .artist {
          text-align: left;
          color: var(--colorPrimary);
          font-weight: lighter;
          font-size: 14px;
        }
      }
    }

    .player-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;

      .play {
        height: 40px;
        aspect-ratio: 1;
      }

      button {
        padding: 0;
        background-color: unset;
        border: none;
        border-radius: 100%;
      }
    }
  }
</style>

<template>
  <div id="player">
    <!--<button class="can-active">
      <Svg name="DJ" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
    </button>-->

    <Volume></Volume>

    <div
      class="cover g-shadow"
      :style="{ 'background-image': `url('${musicStore.activeSong.cover}')` }"
      @click="musicStore.isFullscreen = true"
    >
      <div class="details">
        <div class="title">{{ musicStore.activeSong.title }}</div>
        <div class="artist">{{ musicStore.activeSong.artist }}</div>
      </div>
    </div>

    <Progress></Progress>

    <div class="player-buttons">
      <button @click="player.updateSlowed()" :class="{ active: musicStore.rate < 1 }">
        <Svg name="Metronome" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
      </button>

      <button :class="{ active: musicStore.shuffle }" @click="player.updateShuffle">
        <Svg name="Shuffle" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
      </button>

      <button class="before" @click="player.back">
        <Svg name="Back" fill="transparent" stroke="var(--colorText)"></Svg>
      </button>

      <button class="play" ref="play" @click="togglePlay">
        <span v-if="musicStore.isPaused">
          <Svg name="PlayFilled" height="40" width="40" fill="var(--colorText)"></Svg>
        </span>
        <span v-else>
          <Svg name="PauseFilled" height="40" width="40" fill="var(--colorText)"></Svg>
        </span>
      </button>

      <button class="after" @click="player.forth">
        <Svg name="Forward" fill="transparent" stroke="var(--colorText)"></Svg>
      </button>

      <button :class="{ active: musicStore.loop }" @click="player.updateLoop">
        <Svg name="Loop" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
      </button>

      <button @click="player.updateNightcore" :class="{ active: musicStore.rate > 1 }">
        <Svg name="Groove" height="20" width="20" stroke="var(--colorText)"></Svg>
      </button>
    </div>

    <Fullscreen v-if="musicStore.isFullscreen"></Fullscreen>
  </div>
</template>
