<script setup>
  import { player } from '@/modules/player/scripts/player'
  import { PANEL_OPTIONS } from '@/modules/settings/constants/settings'
  import Svg from '@/modules/shared/components/Svg.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { setColor } from '@/modules/shared/scripts/generic'

  const musicStore = useMusicStore()

  const props = defineProps(['song'])

  const toggleSongEditor = () => {
    musicStore.editingSong = props.song
    musicStore.panel = PANEL_OPTIONS.songEditor
  }

  const addSongToQueue = () => {
    musicStore.queue.push(props.song)
  }
</script>

<style lang="scss" scoped>
  .song-container {
    transition: transform 0.3s ease;
    position: relative;
    padding: 10px;
    padding-right: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: var(--radius);
    gap: 10px;

    &.playing {
      background-color: rgba(0, 0, 0, 0.2);
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.5);

      .buttons {
        opacity: 1;
      }
    }

    &:active {
      transform: scale(0.99);
    }

    .g-tag {
      transition:
        transform 0.3s ease,
        width 0.3s ease,
        height 0.3s ease;
    }

    &:not(:hover) {
      .g-tag {
        width: 10px !important;
        height: 20px !important;
        color: transparent !important;
        transform: scale(0.7);
      }
    }

    .play-zone {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
    }

    .cover {
      height: 70px;
      width: 70px;
      border-radius: 10px; //hardcoded --radius
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
      opacity: 0;

      button {
        padding: 0;
        background-color: unset;
        border: 0;
      }
    }
  }
</style>

<template>
  <div
    class="song-container"
    :class="{ playing: musicStore.activeSong.fileName === props.song.fileName }"
    v-if="props.song"
  >
    <div class="play-zone" @click="() => player.play(props.song.fileName)">
      <div class="cover g-shadow" :style="{ 'background-image': `url('${props.song.cover}')` }"></div>

      <div class="names">
        <div class="title">{{ props.song.title }}</div>
        <div class="artist">{{ props.song.artist }}</div>
      </div>

      <div class="tags">
        <div
          class="g-tag active"
          :style="{ 'background-color': player.getTagColor(tagName), color: setColor(player.getTagColor(tagName)) }"
          v-for="tagName in props.song.tags"
        >
          {{ tagName }}
        </div>
      </div>
    </div>

    <div class="buttons">
      <button @click="addSongToQueue">
        <Svg name="AddQueue" fill="transparent" stroke="var(--colorPrimary)"></Svg>
      </button>
      <button @click="toggleSongEditor">
        <Svg name="Edit" fill="transparent" stroke="var(--colorPrimary)" width="20" height="20"></Svg>
      </button>
    </div>
  </div>
</template>
