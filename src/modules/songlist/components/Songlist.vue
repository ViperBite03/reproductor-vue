<script setup>
  import AddSong from '@/modules/songlist/components/AddSong.vue'
  import Song from '@/modules/songlist/components/Song.vue'
</script>

<style lang="scss">
  #songlist {
  }
</style>

<template>
  <div id="settings">
    <h2 class="g-title">SongList</h2>

    <div class="queue-list" v-for="n in 6" :key="n">
      <Song> </Song>
    </div>
  </div>
</template>
