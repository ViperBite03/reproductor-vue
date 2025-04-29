<script setup lang="ts">
  import { ref, Ref } from 'vue'
  import { player } from '@/modules/player/scripts/player'
  import Svg from '@/modules/shared/components/Svg.vue'

  const name: Ref<string> = ref('')
  const color: Ref<string> = ref('')
  const warning: Ref<string> = ref('')

  const createTag = (e) => {
    warning.value = ''

    if (e.key === 'Enter' || !e.key) {
      const firstLetter = name.value[0].toUpperCase()
      const nameCapitalized = firstLetter + name.value.toLowerCase().substring(1, name.value.length)

      warning.value = player.createTag(nameCapitalized, color.value)

      color.value = '#FFFFFF'
      name.value = ''
    }
  }
</script>

<style lang="scss" scoped>
  .input-tag {
    display: flex;
    gap: 10px;

    button {
      padding: 0 10px;
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
      color: var(--colorPrimary);
    }
  }
</style>

<template>
  <div class="input-tag">
    <div class="add-tag">
      <input type="text" v-model="name" />
      <input type="color" v-model="color" />
      <div class="warning">{{ warning }}</div>
    </div>

    <button @click="(ev) => createTag(ev)">
      <Svg name="AddTag" fill="var(--transparent)" stroke="var(--colorText)"></Svg>
    </button>
  </div>
</template>
