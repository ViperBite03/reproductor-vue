<script setup>
  import PlaylistItem from '@/modules/playlist/components/PlaylistItem.vue'
  import { PANEL_OPTIONS } from '@/modules/settings/constants/settings'
  import Svg from '@/modules/shared/components/Svg.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'

  const musicStore = useMusicStore()

  const togglePlaylistCreator = () => {
    if (musicStore.panel === PANEL_OPTIONS.addPlaylist) {
      musicStore.panel = ''
      return
    }

    musicStore.panel = PANEL_OPTIONS.addPlaylist
  }
</script>

<style lang="scss">
  #playlist {
    height: 100%;
    display: flex;
    flex-direction: column;

    .p-list {
      display: flex;
      gap: 15px;
      height: 100%;
      width: 100%;
      overflow-y: hidden;

      .new-playlist {
        transition: 0.3s ease;
        cursor: pointer;
        height: 100%;
        aspect-ratio: 1;
        border-radius: var(--radius);
        border: 1px solid var(--colorPrimary);
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        gap: 10px;

        &:hover {
          transform: scale(0.9);
        }

        span {
          color: var(--colorPrimary);
        }
      }
    }
  }
</style>

<template>
  <div id="playlist">
    <h2 class="g-title">PLAYLISTS</h2>

    <div class="p-list">
      <div class="p-item" v-for="n in 3" :key="n">
        <PlaylistItem> </PlaylistItem>
      </div>

      <div class="new-playlist" @click="togglePlaylistCreator">
        <Svg name="Edit" fill="transparent" width="50" height="50" stroke="var(--colorPrimary)"> </Svg>

        <span>{{ musicStore.panel === PANEL_OPTIONS.addPlaylist ? 'Cerrar' : 'Crear playlist' }}</span>
      </div>
    </div>
  </div>
</template>
