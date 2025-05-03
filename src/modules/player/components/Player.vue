<script lang="ts" setup>
  import { ref, watch, Ref } from 'vue'
  import Svg from '@/modules/shared/components/Svg.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { player } from '@/modules/player/scripts/player'

  const musicStore = useMusicStore()
  const totalDurationFormatted: Ref<string> = ref('0:00')
  const currentDurationFormatted: Ref<string> = ref('0:00')
  const translate: Ref<number> = ref(105)
  const holding: Ref<boolean> = ref(false)
  const mousePosition: Ref<number> = ref(0)

  let progressPercentage: number = 0
  let flag: boolean = false

  const formatToDuration = (duration: number): string => {
    let min: number = ~~(duration / 60)
    let sec: number = ~~(duration % 60)

    let secZeros = sec < 10 ? '0' : ''

    return min + ':' + secZeros + sec
  }

  setInterval(() => {
    if (!musicStore.activeSong || !musicStore.activeSong.howl) return

    currentDurationFormatted.value = formatToDuration(~~musicStore.activeSong.howl.seek())

    progressPercentage = (musicStore.activeSong.howl.seek() * 100) / musicStore.activeSong.howl.duration()

    translate.value = 100 - progressPercentage

    //if (holding) progressChange()

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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .button-bar {
      display: flex;
      background-color: var(--colorSecondary);
      border-radius: 100px;
      padding: 15px 25px;
      width: fit-content;
      gap: 10px;
      padding-top: 21px;
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

    .player {
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

      .cover {
        overflow: hidden;
        border-radius: var(--maxRadius);
        width: 100%;
        aspect-ratio: 1;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }

      .details {
        text-align: center;

        .title {
          font-size: 25px;
          color: var(--colorText);
          font-weight: bold;
        }

        .artist {
          color: var(--colorText);
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
          height: 5px;
          background-color: var(--colorText);
          border-radius: 50px;
          overflow: hidden;

          .progress {
            height: 5px;
            background-color: var(--colorPrimary);
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
          border: none;
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

      <button class="can-active">
        <Svg name="DJ" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
        <div class="under-bar"></div>
      </button>
    </div>

    <div class="player">
      <div class="cover g-shadow" :style="{ 'background-image': `url('${musicStore.activeSong.cover}')` }"></div>

      <div class="details">
        <div class="title">{{ musicStore.activeSong.title }}</div>
        <div class="artist">{{ musicStore.activeSong.artist }}</div>
      </div>

      <div class="progress-container">
        <div class="actual-time">{{ currentDurationFormatted }}</div>

        <div class="progress-bar">
          <div class="progress" :style="{ transform: `translateX(-${translate}%)` }"></div>
        </div>

        <div class="total-time">{{ totalDurationFormatted }}</div>
      </div>

      <div class="player-buttons">
        <button class="can-active" :class="{ activeX: musicStore.shuffle }" @click="player.updateShuffle">
          <Svg name="Shuffle" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
          <div class="under-bar"></div>
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

        <button class="can-active" :class="{ activeX: musicStore.loop }" @click="player.updateLoop">
          <Svg name="Loop" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
          <div class="under-bar"></div>
        </button>
      </div>
    </div>
  </div>
</template>
