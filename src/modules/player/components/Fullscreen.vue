<script setup lang="ts">
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { player } from '@/modules/player/scripts/player'
  import { queryChatgpt } from '@/modules/shared/scripts/chatgpt'

  import Svg from '@/modules/shared/components/Svg.vue'
  import Volume from '@/modules/player/components/Volume.vue'
  import Progress from '@/modules/player/components/Progress.vue'

  import { onMounted, Ref, ref } from 'vue'
  import { ISongMetadata } from '@/modules/backend/interfaces/ISongMetadata'

  const musicStore = useMusicStore()
  const curiosity: Ref<string> = ref('')
  const loading: Ref<boolean> = ref(false)

  const getCuriosity = async () => {
    loading.value = true

    if (musicStore.activeSong.curiosity) {
      curiosity.value = musicStore.activeSong.curiosity
      loading.value = false

      return
    }

    const prompt = `Explicame el origen y/o las curiosidades que existen de la cancion ${musicStore.activeSong.title} de ${musicStore.activeSong.artist} en un máximo de 4 líneas y de forma dínamica de leer y dividida en párrafos. Lo quiero estructurado, pon cada párrafo dentro de una etiqueta <p> y sin título. Usa el español hablado en España.`
    const result = await queryChatgpt(prompt)

    curiosity.value = result

    if (!curiosity.value) {
      curiosity.value = 'No se encontraron curiosidades para esta canción.'
    }

    const metadata: ISongMetadata = {
      title: musicStore.activeSong.title,
      artist: musicStore.activeSong.artist,
      date: new Date(musicStore.activeSong.date).toISOString(),
      extraData: {
        tags: [...musicStore.activeSong.tags],
        cover: musicStore.activeSong.cover,
        video: musicStore.activeSong.video,
        curiosity: curiosity.value,
        lyrics: musicStore.activeSong.lyrics,
      },
    }

    console.log('Writing metadata:', metadata)

    await window.electron.ipcRenderer.invoke('write-metadata', metadata, musicStore.activeSong.fileName)

    loading.value = false
  }

  const togglePlay = () => {
    musicStore.isPaused ? player.resume() : player.pause()
  }

  const emit = defineEmits(['closeFullscreen'])

  const closeFullscreen = () => {
    musicStore.isFullscreen = false
  }

  onMounted(() => {
    if (musicStore.activeSong.curiosity) {
      curiosity.value = musicStore.activeSong.curiosity

      console.log(curiosity.value)
      loading.value = false
    }
  })
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
      width: 100%;
      object-fit: cover;
      border-radius: var(--radius);
      height: 100%;
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
          padding-bottom: 20px;
          font-size: 20px;
          text-align: justify;
        }
      }
    }

    .player {
      grid-column: 1/-1;

      margin: 10px 0;
      background-color: var(--colorSecondary);
      border-radius: var(--radius);
      padding: 20px;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .player-buttons {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        button {
          background: none !important;
          border: unset !important;
        }
      }
    }
  }

  :deep(.volume-container) {
    border: 2px solid red;
    width: 250px;
  }
</style>

<template>
  <div class="fullscreen">
    <div class="panel1">
      <div class="titles">
        <div>{{ musicStore.activeSong.title }}</div>
        <div>{{ musicStore.activeSong.artist }}</div>
      </div>
      <button class="close" @click="closeFullscreen()">X</button>
    </div>

    <img class="cover" :src="musicStore.activeSong.cover" alt="cover" />

    <div class="info">
      <div class="actions">
        <button class="curiosity" @click="getCuriosity">{{ loading ? 'Loading...' : 'Generate curiosity' }}</button>
        <button class="lyrics">Lyrics</button>
      </div>
      <div class="curiosity" v-html="curiosity"></div>
      <!--<div class="curiosity">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis aliquid quia, alias officiis eum porro
          reprehenderit fuga eius dolore repudiandae, sint similique placeat pariatur? Neque iure dolor sit! Dicta,
          cumque!
        </p>
      </div>-->
    </div>

    <div class="player">
      <Progress></Progress>

      <div class="player-buttons">
        <button @click="player.updateSlowed()" :class="{ 'active-underbar': musicStore.rate < 1 }" class="can-active">
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

        <button @click="player.updateNightcore" :class="{ 'active-underbar': musicStore.rate > 1 }" class="can-active">
          <Svg name="Groove" height="20" width="20" stroke="var(--colorText)"></Svg>
        </button>
      </div>

      <Volume></Volume>
    </div>
  </div>
</template>
