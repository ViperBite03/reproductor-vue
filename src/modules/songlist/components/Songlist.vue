<script setup>
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import Song from '@/modules/songlist/components/Song.vue'
  import { PANEL_OPTIONS } from '@/modules/settings/constants/settings'
  import Svg from '@/modules/shared/components/Svg.vue'
  import { ref, computed, onMounted, onUnmounted } from 'vue'

  const musicStore = useMusicStore()
  const itemsPerPage = ref(10)
  const currentPage = ref(1)
  const songlistRef = ref(null)

  const totalPages = computed(() => {
    return Math.ceil(musicStore.songsFiltered.length / itemsPerPage.value)
  })

  const paginatedSongs = computed(() => {
    const end = currentPage.value * itemsPerPage.value
    return musicStore.songsFiltered.slice(0, end)
  })

  const handleScroll = () => {
    if (!songlistRef.value) return

    const { scrollTop, scrollHeight, clientHeight } = songlistRef.value
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

    if (isNearBottom && currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  onMounted(() => {
    if (songlistRef.value) {
      songlistRef.value.addEventListener('scroll', handleScroll)
    }
  })

  onUnmounted(() => {
    if (songlistRef.value) {
      songlistRef.value.removeEventListener('scroll', handleScroll)
    }
  })

  const toggleAddSong = () => {
    if (musicStore.panel === PANEL_OPTIONS.addSong) {
      musicStore.panel = ''
      return
    }

    musicStore.panel = PANEL_OPTIONS.addSong
  }
</script>

<style lang="scss">
  .songlist {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .add-song-container {
    position: absolute;
    bottom: 0px;
    right: 0px;
    padding: 20px;
    padding-left: 200px;

    .add-song {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;

      border-radius: var(--radius);
      backdrop-filter: blur(5px);
    }
  }
</style>

<template>
  <div class="songlist" ref="songlistRef">
    <Song v-for="song in paginatedSongs" :key="song.fileName" :song="song"> </Song>
  </div>

  <span class="add-song-container">
    <button class="add-song" @click="toggleAddSong">
      <Svg name="AddMusic" fill="transparent" stroke="var(--colorPrimary)"></Svg>
    </button>
  </span>
</template>
