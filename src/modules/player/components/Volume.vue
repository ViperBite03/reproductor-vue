<script lang="ts" setup>
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import Svg from '@/modules/shared/components/Svg.vue'
  import Range from '@/modules/shared/components/Range.vue'
  import { player } from '../scripts/player'
  import { Ref, ref, watch } from 'vue'

  const musicStore = useMusicStore()
  const rangeValue: Ref<number> = ref(0)

  watch(
    () => musicStore.volume,
    () => {
      rangeValue.value = musicStore.volume * 1000
    }
  )
</script>

<style lang="scss" scoped>
  .volume-container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;

    .speaker {
      background-color: transparent;
      padding: 5px;
    }
  }
</style>

<template>
  <div class="volume-container">
    <button class="speaker" @click="player.toggleMute()">
      <div v-if="musicStore.volume > 0.05">
        <Svg name="VolumeHigh" fill="transparent"></Svg>
      </div>
      <div v-else-if="musicStore.volume <= 0.05 && musicStore.volume != 0">
        <Svg name="VolumeLow" fill="transparent"></Svg>
      </div>
      <div v-else-if="musicStore.volume == 0">
        <Svg name="Mute" fill="transparent"></Svg>
      </div>
    </button>

    <Range v-model="rangeValue" @pikachu="() => player.updateVolume(rangeValue / 1000)"></Range>
  </div>
</template>
