<script setup lang="ts">
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { player } from '@/modules/player/scripts/player'
  import { queryChatgpt } from '@/modules/shared/scripts/chatgpt'

  import Svg from '@/modules/shared/components/Svg.vue'
  import Volume from './Volume.vue'
  import Progress from './Progress.vue'

  import { Ref, ref, defineEmits } from 'vue'

  const musicStore = useMusicStore()
  const curiosity: Ref<string> = ref('')
  const loading: Ref<boolean> = ref(false)

  const getCuriosity = async () => {
    loading.value = true
    const prompt = `Explicame el origen y/o las curiosidades que existen de la cancion ${musicStore.activeSong.title} de ${musicStore.activeSong.artist} en un máximo de 10 líneas y de forma dínamica de leer y dividida en párrafos. Lo quiero estructurado, pon cada párrafo dentro de una etiqueta <p> y sin título. Usa el español hablado en España.`
    const result = await queryChatgpt(prompt)

    curiosity.value = result
    loading.value = false
  }

  const togglePlay = () => {
    musicStore.isPaused ? player.resume() : player.pause()
  }

  const emit = defineEmits(['closeFullscreen'])

  const closeFullscreen = () => {
    emit('closeFullscreen', false)
  }
</script>

<style lang="scss" scoped>
  .fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 75px 1fr 150px;

    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    backdrop-filter: blur(20px);
    background-color: rgba(0, 0, 0, 0.5);

    padding: 0 50px;
    gap: 50px;

    .panel1 {
      grid-column: 1/-1;

      display: flex;
      align-items: center;
      justify-content: flex-end;

      .close {
        background-color: transparent;
        font-size: 30px;
        padding: 0;
      }
    }

    .cover {
      overflow: hidden;
      border-radius: var(--maxRadius);
      display: flex;
      justify-content: center;

      img {
        height: 100%;
      }
    }

    .info {
      display: flex;
      flex-direction: column;

      gap: 50px;

      .actions {
        display: flex;
        gap: 20px;

        button {
          width: fit-content;
        }
      }

      .curiosity {
        p {
          padding-bottom: 10px;
          font-size: 20px;
          text-align: justify;
        }
      }
    }

    .player {
      grid-column: 1/-1;

      margin: 10px 0;
      background-color: var(--colorSecondary);
      border-radius: var(--maxRadius);
      padding: 20px;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .player-buttons {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>

<template>
  <div class="fullscreen">
    <div class="panel1">
      <button class="close" @click="closeFullscreen()">X</button>
    </div>

    <div class="cover">
      <img :src="musicStore.activeSong.cover" alt="cover" />
    </div>

    <div class="info">
      <div class="actions">
        <button class="curiosity">{{ loading ? 'Loading...' : 'Generate curiosity' }}</button>
        <button class="lyrics">Lyrics</button>
      </div>
      <!--<div class="curiosity" v-html="curiosity"></div>-->
      <div class="curiosity">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis aliquid quia, alias officiis eum porro
          reprehenderit fuga eius dolore repudiandae, sint similique placeat pariatur? Neque iure dolor sit! Dicta,
          cumque!
        </p>
      </div>
    </div>

    <div class="player">
      <Progress></Progress>

      <div class="player-buttons">
        <button @click="player.updateSlowed()" :class="{ 'active-underbar': musicStore.rate < 1 }" class="can-active">
          <Svg name="Metronome" height="20" width="20" stroke="var(--colorText)" fill="transparent"></Svg>
          <div class="under-bar"></div>
        </button>

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

        <button @click="player.updateNightcore" :class="{ 'active-underbar': musicStore.rate > 1 }" class="can-active">
          <Svg name="Groove" height="20" width="20" stroke="var(--colorText)"></Svg>
          <div class="under-bar"></div>
        </button>

        <Volume></Volume>
      </div>
    </div>
  </div>
</template>
