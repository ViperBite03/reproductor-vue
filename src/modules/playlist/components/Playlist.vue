<script setup>
  import PlaylistItem from '@/modules/playlist/components/PlaylistItem.vue'
</script>

<script setup></script>

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
    }
  }
</style>

<template>
  <div id="playlist">
    <h2 class="g-title">PLAYLISTS</h2>

    <div class="p-list">
      <div class="p-item" v-for="n in 4" :key="n">
        <PlaylistItem> </PlaylistItem>
      </div>
    </div>
  </div>
</template>
