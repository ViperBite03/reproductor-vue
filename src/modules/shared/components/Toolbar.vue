<script setup>
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { PANEL_OPTIONS } from '@/modules/settings/constants/settings'
  import Svg from '@/modules/shared/components/Svg.vue'
  import Search from '@/modules/songlist/components/Search.vue'

  const musicStore = useMusicStore()

  const toggleSettings = () => {
    if (musicStore.panel === PANEL_OPTIONS.settings) {
      musicStore.panel = ''
      return
    }

    musicStore.panel = PANEL_OPTIONS.settings
  }
</script>

<style lang="scss">
  #toolbar {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    gap: 10px;

    button {
      border: unset;
      padding: 0;
    }
  }
</style>

<template>
  <div id="toolbar">
    <Search />
    <button @click="toggleSettings">
      <Svg name="Groove"></Svg>
    </button>
  </div>
</template>
