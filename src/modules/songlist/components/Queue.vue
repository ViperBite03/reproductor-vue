<script setup></script>

<style lang="scss">
  #queue {
  }
</style>

<template>
  <div id="settings">
    <h2 class="g-title">QUEUE</h2>

    <div class="queue-list" v-for="n in 3" :key="n">
      <div class="cover"></div>
      <div class="title"></div>
      <div class="artist"></div>
    </div>
  </div>
</template>
