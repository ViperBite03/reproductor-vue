<script setup lang="ts">
  import { player } from '@/modules/player/scripts/player'
  import Svg from '@/modules/shared/components/Svg.vue'
  import { ref, Ref } from 'vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'

  const musicStore = useMusicStore()

  const name: Ref<string> = ref('')
  const color: Ref<string> = ref('')
  const warning: Ref<string> = ref('')

  const createTag = (e) => {
    warning.value = ''

    if (e.key === 'Enter' || !e.key) {
      warning.value = player.createTag(name.value, color.value)

      color.value = '#FFFFFF'
      name.value = ''
    }
  }
</script>

<style lang="scss">
  #tags-editor {
    position: relative;

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

      .add-tag {
        position: relative;
        width: 100%;

        [type='text'] {
          width: 100%;
        }

        [type='color'] {
          position: absolute;
          height: 30px;
          width: 40px;
          padding: 0;
          border: 0;
          top: 4px;
          right: 10px;
        }
      }

      .warning {
        position: absolute;
        font-size: 10px;
        color: var(--lilac);
      }
    }
  }
</style>

<template>
  <div id="tags-editor">
    <h2 class="g-title">TAGS EDITOR</h2>

    <div class="tag-editor-list">
      <div class="row">
        <div class="add-tag">
          <input type="text" v-model="name" />
          <input type="color" v-model="color" />
          <div class="warning">{{ warning }}</div>
        </div>

        <button @click="(ev) => createTag(ev)">
          <Svg name="AddTag" fill="var(--transparent)" stroke="var(--colorText)"></Svg>
        </button>
      </div>

      <div class="row" v-for="tag in musicStore.tags">
        <div class="g-tag active" :style="{ 'background-color': tag.color }">
          {{ tag.name }}
        </div>

        <button @click="(ev) => createTag(ev)">
          <Svg name="Trash" fill="var(--transparent)" stroke="var(--colorText)"></Svg>
        </button>
      </div>
    </div>
  </div>
</template>
