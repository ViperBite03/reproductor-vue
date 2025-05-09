<script lang="ts" setup>
  import { ref, Ref, defineEmits } from 'vue'

  const mousePositionX: Ref<number> = ref(0)
  const holding: Ref<boolean> = ref(false)
  const value: Ref<number> = ref(25) //musicStore.volume

  const emit = defineEmits()
  const model = defineModel()

  const changeValue = (event: MouseEvent) => {
    if (!holding.value) return

    const HTMLRangeBar = document.querySelector('.range-container')

    mousePositionX.value = event.clientX
    const { left, width } = HTMLRangeBar.getBoundingClientRect()

    const newWidth: number = Number((((mousePositionX.value - left) * 100) / width).toFixed(3))

    value.value = newWidth > 100 ? 100 : newWidth
    value.value = newWidth < 0 ? 0 : newWidth

    model.value = value.value
    emit('pikachu', model.value)
  }
</script>

<style lang="scss" scoped>
  .range-container {
    width: 100%;
    padding: 15px 0;
    cursor: pointer;

    .range-bar {
      height: 5px;
      background-color: var(--colorText);
      border-radius: 50px;

      .range-value {
        height: 5px;
        background-color: var(--colorPrimary);
        position: relative;
        border-radius: 50px;

        &::after {
          content: '';
          transition:
            background-color 0.2s ease,
            box-shadow 0.5s ease;
          width: 6px;
          height: 6px;
          border-radius: 100%;
          position: absolute;
          right: -3px;
          top: -1.5px;
        }
      }
    }

    &:hover {
      .range-value {
        &::after {
          transition:
            background-color 0.2s ease,
            box-shadow 0.5s ease;
          background-color: var(--colorAccent);
          box-shadow: 0 0 0 5px rgb(255, 255, 255);
        }
      }
    }
  }
</style>

<template>
  <div
    class="range-container"
    @mouseup="() => (holding = false)"
    @mouseleave="() => (holding = false)"
    @mousedown="() => (holding = true)"
    @mousemove="changeValue"
  >
    <div class="range-bar">
      <div class="range-value" :style="{ width: `${value}%` }"></div>
    </div>
  </div>
</template>
