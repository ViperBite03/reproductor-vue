<script setup>
  import { ref } from 'vue'
  import Svg from '@/modules/shared/components/Svg.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { player } from '@/modules/player/scripts/player'

  let playPause = ref(true)

  const musicStore = useMusicStore()

  const togglePlay = () => {
    playPause.value = !playPause.value
  }
</script>

<style lang="scss">
  #player {
    height: 100%;
    padding: 25px;

    background-color: var(--colorPrimary);
    border-radius: var(--maxRadius);

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    box-shadow: 0px 10px 29px -14px var(--colorSecondary);

    .cover {
      overflow: hidden;
      border-radius: var(--maxRadius);
      width: 100%;
      height: 50%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }

    .details {
      text-align: center;

      .title {
        font-size: 25px;
        color: white;
        font-weight: bold;
      }

      .artist {
        color: white;
        font-weight: lighter;
      }
    }

    .progress-container {
      width: 100%;
      display: flex;
      gap: 10px;
      align-items: center;

      .progress-bar {
        width: 100%;
        height: 8px;
        background-color: white;
        border-radius: 50px;
        overflow: hidden;

        .progress {
          height: 10px;
          width: 50%;
          background-color: red;
        }
      }

      .actual-time,
      .total-time {
        color: white;
      }
    }

    .player-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;

      .btn {
        height: 40px;
      }
    }
  }
</style>

<template>
  <div id="player">
    <div class="cover" :style="{ 'background-image': `url('${musicStore.activeSong.cover}')` }"></div>
    <div class="details">
      <div class="title">{{ musicStore.activeSong.title }}</div>
      <div class="artist">{{ musicStore.activeSong.artist }}</div>
    </div>

    <div class="progress-container">
      <div class="actual-time">1:60</div>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <div class="total-time">3:20</div>
    </div>
    <div class="player-buttons">
      <button @click="player.updateSlowed" :class="{ active: rateValue < 1 }">Slowed</button>

      <button class="before btn" @click="player.back">
        <Svg name="Back" fill="var(--transparent)" stroke="white"></Svg>
      </button>
      <button class="play btn" ref="play" @click="togglePlay">
        <span v-if="playPause">
          <Svg name="PlayFilled" height="40" width="40" fill="white"></Svg>
        </span>
        <span v-else>
          <Svg name="PauseFilled" height="40" width="40" fill="white"></Svg>
        </span>
      </button>
      <button class="after btn" @click="player.forth">
        <Svg name="Forward" fill="var(--transparent)" stroke="white"></Svg>
      </button>

      <!-- La clase active hay que maquetarla -->
      <button @click="player.updateNightcore" :class="{ active: rateValue > 1 }">Nightcore</button>
    </div>
  </div>
</template>
