<script setup lang="ts">
  import InputTag from '@/modules/shared/components/InputTag.vue'
  import Svg from '@/modules/shared/components/Svg.vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { player } from '@/modules/player/scripts/player'
  import { setColor } from '@/modules/shared/scripts/generic'

  const musicStore = useMusicStore()
</script>

<style lang="scss" scoped>
  #tags-editor {
    position: relative;
    overflow-y: auto;
    height: 100%;

    .tag-editor-list {
      display: flex;
      gap: 20px;
      flex-direction: column;

      .row {
        display: flex;
        gap: 10px;

        button {
          padding: 0 10px;
        }
      }
    }
  }
</style>

<template>
  <div id="tags-editor">
    <h2 class="g-title">TAGS EDITOR</h2>

    <div class="tag-editor-list">
      <InputTag />

      <div class="row" v-for="tag in musicStore.tags">
        <div class="g-tag active" :style="{ 'background-color': tag.color, color: setColor(tag.color) }">
          {{ tag.name }}
        </div>

        <button @click="() => player.removeTag(tag.name)">
          <Svg name="Trash" fill="transparent" stroke="var(--colorText)"></Svg>
        </button>
      </div>
    </div>
  </div>
</template>
