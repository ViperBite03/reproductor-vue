<script setup>
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { PANEL_OPTIONS } from '@/modules/settings/constants/settings'
  import { player } from '@/modules/player/scripts/player'
  import { watch } from 'vue'
  import Svg from '@/modules/shared/components/Svg.vue'

  const musicStore = useMusicStore()

  //cuando cambias el rate, se activa automaticamente (no debería)

  watch(
    () => musicStore.slowRate,
    (newValue) => {
      window.localStorage.setItem('slowValue', JSON.stringify(newValue))
      player.updateSlowed()
    }
  )

  watch(
    () => musicStore.nightRate,
    (newValue) => {
      window.localStorage.setItem('nightValue', JSON.stringify(newValue))
      player.updateNightcore()
    }
  )
</script>

<style lang="scss">
  .settings {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .volume-container {
      width: 100%;
      display: flex;
      gap: 10px;
      align-items: center;

      .volume-bar {
        width: 100%;
        height: 5px;
        background-color: var(--colorText);
        border-radius: 50px;
        overflow: hidden;

        .current-volume {
          height: 5px;
          background-color: var(--colorPrimary);
        }
      }
      button {
        background-color: transparent;
        border: none;
        padding: 0;
      }
    }

    .rate-container {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .rate {
        border: 1px solid var(--colorPrimary);
        border-radius: var(--radius);
        padding: 10px;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>

<template>
  <div class="settings">
    <h2 class="g-title">Settings</h2>

    <div class="rate-container">
      <div class="night rate">
        <span><strong>Nightcore rate</strong>&emsp;{{ musicStore.nightRate }}</span>

        <input class="input" type="range" v-model="musicStore.nightRate" min="1" max="2" step="0.1" />
      </div>

      <div class="slow rate">
        <span><strong>Slowed rate</strong>&emsp;{{ musicStore.slowRate }}</span>

        <input class="input" type="range" v-model="musicStore.slowRate" min="0.1" max="1" step="0.1" />
      </div>
    </div>

    <div class="dj-container">
      <!--Start, end-->
      <div class="dj-start">
        <span><strong>Start</strong></span>

        <input class="input" type="number" v-model="musicStore.djModeStart" min="1" max="50" />
      </div>

      <div class="dj-start">
        <span><strong>Finish</strong></span>

        <input class="input" type="number" v-model="musicStore.djModeFinish" min="50" max="100" />
      </div>
    </div>
  </div>
</template>
