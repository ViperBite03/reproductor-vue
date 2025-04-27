<script lang="ts" setup>
  import { player } from '@/modules/player/scripts/player'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { Ref, ref } from 'vue'
  import Svg from '@/modules/shared/components/Svg.vue'

  const musicStore = useMusicStore()
  const searchValue: Ref<string> = ref('')

  const updateGlobalSearch = () => {
    musicStore.filterSearch = searchValue.value
    player.filter()
  }
</script>

<style lang="scss" scoped>
  .searcher-container {
    position: relative;

    input {
      padding-left: 40px;
    }

    .svg-container {
      position: absolute;
      display: flex;
      align-items: center;
      margin-left: 10px;
      height: 100%;
    }
  }
</style>

<template>
  <div class="searcher-container">
    <Svg name="Search" fill="transparent" stroke="var(--lilac)"> </Svg>
    <input type="text" placeholder="Type here" class="search" v-model="searchValue" @input="updateGlobalSearch" />
  </div>
</template>
