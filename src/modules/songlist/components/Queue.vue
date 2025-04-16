<script setup>
  import Song from '@/modules/songlist/components/Song.vue';
</script>

<style lang="scss">
  #queue {
  }
</style>

<template>
  <div id="settings">
    <h2 class="g-title">QUEUE</h2>

    <div class="queue-list" v-for="n in 3" :key="n">
      <Song> </Song>
    </div>
  </div>
</template>
