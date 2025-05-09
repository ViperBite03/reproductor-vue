<script lang="ts" setup>
  import { ref, watch, Ref } from 'vue'
  import Svg from '@/modules/shared/components/Svg.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { player } from '@/modules/player/scripts/player'

  const musicStore = useMusicStore()

  const totalDurationFormatted: Ref<string> = ref('0:00')
  const currentDurationFormatted: Ref<string> = ref('0:00')
  const progressPercentage: Ref<number> = ref(0)
  const holding: Ref<boolean> = ref(false)
  const mousePositionX: Ref<number> = ref(0)
  let flag: boolean = false

  const formatToDuration = (duration: number): string => {
    let min: number = ~~(duration / 60)
    let sec: number = ~~(duration % 60)

    let secZeros = sec < 10 ? '0' : ''

    return min + ':' + secZeros + sec
  }

  const progressChange = () => {
    const HTMLProgressBar = document.querySelector('.progress-bar')

    const { left, width } = HTMLProgressBar.getBoundingClientRect()

    const newProgress: number = ((mousePositionX.value - left) * 100) / width
    const newSec: number = (newProgress * musicStore.activeSong.howl.duration()) / 100

    musicStore.activeSong.howl.seek(newSec)
  }

  setInterval(() => {
    if (!musicStore.activeSong || !musicStore.activeSong.howl) return

    currentDurationFormatted.value = formatToDuration(~~musicStore.activeSong.howl.seek())

    progressPercentage.value = (musicStore.activeSong.howl.seek() * 100) / musicStore.activeSong.howl.duration()

    if (holding.value) progressChange()

    const songOffset: number = musicStore.activeSong.howl.duration() - musicStore.fadeTime

    if (musicStore.djMode) {
      const endTime = (musicStore.activeSong.howl.duration() * musicStore.djModeFinish) / 100

      if (musicStore.activeSong.howl.seek() > endTime && !flag) {
        flag = true
        player.next()
      }
    } else if (musicStore.activeSong.howl.seek() > songOffset && !flag) {
      flag = true
      player.next()
    }

    if (musicStore.activeSong.howl.seek() < songOffset) flag = false
  }, 100)

  watch(
    () => musicStore.activeSong.howl,
    (howl) => {
      if (!howl) return

      totalDurationFormatted.value = formatToDuration(~~howl.duration())
    }
  )

  const togglePlay = () => {
    musicStore.isPaused ? player.resume() : player.pause()
  }
</script>

<style lang="scss">
  #player {
    height: 100%;
    width: 100%;
    padding: 25px;

    background-color: var(--colorSecondary);
    border-radius: var(--maxRadius);

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    //box-shadow: 0px 10px 29px -14px var(--colorSecondary);

    * {
      user-select: none;
    }

    .button-bar {
      display: flex;
      gap: 10px;
    }

    .can-active {
      background-color: unset;
      border: none;
      padding: 0;

      display: flex;
      flex-direction: column;
      align-items: center;

      gap: 3px;

      .under-bar {
        height: 3px;
        width: 0;
        background-color: var(--colorText);
        border-radius: var(--maxRadius);
        transition: 0.3s;
      }

      &.activeX {
        .under-bar {
          width: 10px;
        }
      }
    }

    .cover {
      overflow: hidden;
      border-radius: var(--maxRadius);
      width: 100%;
      aspect-ratio: 1;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      position: relative;

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

    .progress-container {
      width: 100%;
      display: flex;
      gap: 10px;
      align-items: center;

      .progress-bar {
        width: 100%;
        height: 5px;
        background-color: var(--colorText);
        border-radius: 50px;

        cursor: pointer;

        .progress {
          height: 5px;
          background-color: var(--colorPrimary);
          position: relative;
          border-radius: 50px;

          &::after {
            content: '';
            transition:
              background-color 0.2s ease,
              box-shadow 0.5s ease;
            width: 6px;
            height: 6px;
            border-radius: 100%;
            position: absolute;
            right: -3px;
            top: -1.5px;
          }
        }

        &:hover {
          .progress {
            &::after {
              transition:
                background-color 0.2s ease,
                box-shadow 0.5s ease;
              background-color: var(--colorAccent);
              box-shadow: 0 0 0 5px rgb(255, 255, 255);
            }
          }
        }
      }

      .actual-time,
      .total-time {
        color: var(--colorText);
        min-width: 35px;
        text-align: center;
      }
    }

    .player-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;

      button {
        height: 40px;

        padding: 0;
        background-color: unset;
        border: 0px solid var(--colorPrimary);
        aspect-ratio: 1;
        border-radius: 100%;

        &.activeX {
          border: 1px solid var(--colorPrimary);
        }
      }
    }
  }
</style>

<template>
  <div id="player">
    <div class="button-bar">
      <button @click="player.updateSlowed()" :class="{ activeX: musicStore.rate < 1 }" class="can-active">
        <Svg name="Metronome" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
        <div class="under-bar"></div>
      </button>

      <button @click="player.updateNightcore" :class="{ activeX: musicStore.rate > 1 }" class="can-active">
        <Svg name="Groove" height="20" width="20" stroke="var(--colorText)"></Svg>
        <div class="under-bar"></div>
      </button>

      <button
        @click="() => (musicStore.djMode = !musicStore.djMode)"
        :class="{ activeX: musicStore.djMode }"
        class="can-active"
      >
        <Svg name="DJ" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
        <div class="under-bar"></div>
      </button>
    </div>

    <div class="cover g-shadow" :style="{ 'background-image': `url('${musicStore.activeSong.cover}')` }">
      <div class="details">
        <div class="title">{{ musicStore.activeSong.title }}</div>
        <div class="artist">{{ musicStore.activeSong.artist }}</div>
      </div>
    </div>

    <div class="progress-container">
      <div class="actual-time">{{ currentDurationFormatted }}</div>

      <div
        class="progress-bar"
        @mouseup="() => (holding = false)"
        @mouseleave="() => (holding = false)"
        @mousedown="() => (holding = true)"
        @mousemove="(event) => (mousePositionX = event.clientX)"
      >
        <div class="progress" :style="{ width: `${progressPercentage}%` }"></div>
      </div>

      <div class="total-time">{{ totalDurationFormatted }}</div>
    </div>

    <div class="player-buttons">
      <button class="active-button" :class="{ activeX: musicStore.shuffle }" @click="player.updateShuffle">
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

      <button class="active-button" :class="{ activeX: musicStore.loop }" @click="player.updateLoop">
        <Svg name="Loop" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
      </button>
    </div>
  </div>
</template>
