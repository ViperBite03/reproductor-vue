<script setup lang="ts">
  import { ref, watchEffect, Ref } from 'vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { player } from '@/modules/player/scripts/player'

  const musicStore = useMusicStore()

  const HTMLProgressBar = ref(null)

  const mousePositionX: Ref<number> = ref(0)
  const totalDurationFormatted: Ref<string> = ref('0:00')
  const currentDurationFormatted: Ref<string> = ref('0:00')
  const progressPercentage: Ref<number> = ref(0)
  const holding: Ref<boolean> = ref(false)

  let flag: boolean = false

  const progressChange = () => {
    const { left, width } = HTMLProgressBar.value.getBoundingClientRect()

    const newProgress: number = ((mousePositionX.value - left) * 100) / width
    const newSec: number = (newProgress * musicStore.activeSong.howl.duration()) / 100

    musicStore.activeSong.howl.seek(newSec)
  }

  const formatToDuration = (duration: number): string => {
    let min: number = ~~(duration / 60)
    let sec: number = ~~(duration % 60)

    let secZeros = sec < 10 ? '0' : ''

    return min + ':' + secZeros + sec
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

  watchEffect(() => {
    const howl = musicStore.activeSong.howl
    const _ = musicStore.isFullscreen // 👈 solo para que sea reactivo

    if (!howl) return

    totalDurationFormatted.value = formatToDuration(~~howl.duration())
  })
</script>

<style lang="scss" scoped>
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
</style>

<template>
  <div class="progress-container">
    <div class="actual-time">{{ currentDurationFormatted }}</div>

    <div
      class="progress-bar"
      ref="HTMLProgressBar"
      @mouseup="() => (holding = false)"
      @mouseleave="() => (holding = false)"
      @mousedown="() => (holding = true)"
      @mousemove="(event) => (mousePositionX = event.clientX)"
    >
      <div class="progress" :style="{ width: `${progressPercentage}%` }"></div>
    </div>

    <div class="total-time">{{ totalDurationFormatted }}</div>
  </div>
</template>
