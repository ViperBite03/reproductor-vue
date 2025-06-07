<script setup>
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { player } from '@/modules/player/scripts/player'
  import { watch } from 'vue'

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

  const openMusicFolder = async () => {
    await window.electron.ipcRenderer.invoke('open-path')
  }

  const resetApp = async () => {
    await window.electron.ipcRenderer.invoke('reset-app')
  }

  const toggleDJMode = () => {
    musicStore.djMode = !musicStore.djMode
  }
</script>

<style lang="scss">
  .settings {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-right: 20px;

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

    .dj-start {
      padding-top: 10px;
      span {
        position: relative;
        display: inline-block;
        width: 50px;
      }

      input {
        width: 80px;
      }
    }
  }
</style>

<template>
  <div class="settings">
    <h2 class="g-title">Settings</h2>
    <button @click="openMusicFolder">Abrir carpeta de canciones MP3</button>
    <button @click="resetApp">Reiniciar APP</button>

    <br />

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

    <button @click="toggleDJMode">DJ Mode {{ musicStore.djMode ? 'on' : 'off' }}</button>

    <div class="dj-container">
      <!--Start, end-->
      <div class="dj-start">
        <span>Start</span>
        <input class="input" type="number" v-model="musicStore.djModeStart" min="1" max="50" />
      </div>

      <div class="dj-start">
        <span>Finish</span>
        <input class="input" type="number" v-model="musicStore.djModeFinish" min="50" max="100" />
      </div>
    </div>
  </div>
</template>
