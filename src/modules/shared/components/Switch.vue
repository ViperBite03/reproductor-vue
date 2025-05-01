<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    modelValue?: boolean
    checked?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'update:checked', value: boolean): void
  }>()

  const isChecked = computed({
    get: () => props.modelValue ?? props.checked ?? false,
    set: (val: boolean) => {
      if (props.modelValue !== undefined) emit('update:modelValue', val)
      if (props.checked !== undefined) emit('update:checked', val)
    },
  })
</script>

<style scoped lang="scss">
  $on-color: var(--colorPrimary);
  $off-color: #ccc;
  $knob-color: white;

  .switch {
    cursor: pointer;
    width: 50px;
    height: 28px;
    border: none;
    border-radius: 14px;
    background-color: $off-color;
    padding: 0;
    position: relative;
    transition: background-color 0.2s;

    &[aria-checked='true'] {
      background-color: $on-color;
    }

    .slider {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: $knob-color;
      transition: transform 0.2s;

      &.on {
        transform: translateX(22px);
      }
    }
  }
</style>

<template>
  <div
    class="switch"
    role="switch"
    :aria-checked="isChecked"
    @click="
      () => {
        isChecked = !isChecked
      }
    "
  >
    <span class="slider" :class="{ on: isChecked }" />
  </div>
</template>
