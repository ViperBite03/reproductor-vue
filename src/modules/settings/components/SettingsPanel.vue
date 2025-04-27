<script setup>
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import AddSong from '@/modules/songlist/components/AddSong.vue'
  import TagsEditor from '@/modules/songlist/components/TagsEditor.vue'
  import { PANEL_OPTIONS } from '@/modules/settings/constants/settings'
  import Settings from '@/modules/settings/components/Settings.vue'

  const musicStore = useMusicStore()
</script>

<style lang="scss">
  #settings-panel {
    height: 100%;
  }
</style>

<template>
  <div id="settings-panel">
    <AddSong v-if="musicStore.panel === PANEL_OPTIONS.addSong" />
    <Settings v-if="musicStore.panel === PANEL_OPTIONS.settings" />
    <TagsEditor v-if="musicStore.panel === PANEL_OPTIONS.tagEditor" />
  </div>
</template>
