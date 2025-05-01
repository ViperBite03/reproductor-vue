<script setup>
  import { player } from '@/modules/player/scripts/player'
  import { PANEL_OPTIONS } from '@/modules/settings/constants/settings'
  import Svg from '@/modules/shared/components/Svg.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'

  const musicStore = useMusicStore()

  const props = defineProps(['song'])

  const toggleSongEditor = () => {
    if (musicStore.panel === PANEL_OPTIONS.songEditor) {
      musicStore.panel = ''
      return
    }

    musicStore.editingSong = props.song

    musicStore.panel = PANEL_OPTIONS.songEditor
  }
</script>

<style lang="scss" scoped>
  .song-container {
    position: relative;
    transition: 0.3s ease;
    padding: 10px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .play-zone {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
    }

    .cover {
      height: 75px;
      width: 75px;
      border-radius: var(--maxRadius);
      flex-shrink: 0;
      grid-row: span 2;
    }

    .tags {
      width: 100%;
      display: flex;
      justify-content: right;
      gap: 10px;

      .g-tag {
        width: fit-content;
      }
    }

    .names {
      display: flex;
      flex-direction: column;

      .title {
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .artist {
        font-weight: lighter;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .buttons {
      display: flex;
      gap: 5px;

      button {
        padding: 0;
        background-color: unset;
        border: 0;
      }
    }
  }
</style>

<template>
  <div class="song-container" v-if="props.song">
    <div class="play-zone" @click="() => player.play(props.song.fileName)">
      <div class="cover g-shadow" :style="{ 'background-image': `url('${props.song.cover}')` }"></div>

      <div class="names">
        <div class="title">{{ props.song.title }}</div>
        <div class="artist">{{ props.song.artist }}</div>
      </div>

      <div class="tags">
        <div
          class="g-tag active"
          :style="{ 'background-color': player.getTagColor(tagName) }"
          v-for="tagName in props.song.tags"
        >
          {{ tagName }}
        </div>
      </div>
    </div>

    <div class="buttons">
      <button>
        <Svg name="AddQueue" fill="transparent" stroke="var(--colorPrimary)"></Svg>
      </button>
      <button @click="toggleSongEditor">
        <Svg name="Edit" fill="transparent" stroke="var(--colorPrimary)" width="20" height="20"></Svg>
      </button>
    </div>
  </div>
</template>
