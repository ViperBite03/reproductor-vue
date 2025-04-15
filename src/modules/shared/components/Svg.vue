<script setup lang="ts">
  import { computed } from 'vue';
  import type { SvgStore } from '@/modules/shared/interfaces/ISvgStore';
  import { svgStore } from '@/modules/shared/constants/svgStore';

  interface Props {
    name: keyof SvgStore;
    fill?: string;
    stroke?: string;
    width?: string;
    height?: string;
    className?: string;
  }

  const props = defineProps<Props>();

  const fill = props.fill || 'var(--colorText)';
  const stroke = props.stroke || 'var(--colorText)';
  const width = props.width || '25';
  const height = props.height || '25';
  const classNameAttr = props.className ? `class="${props.className}"` : '';

  const svgContent = computed(() => {
    let raw: string = svgStore[props.name];
    if (!raw) return '';

    if (stroke) {
      raw = raw.replace(/stroke\s*=\s*["'][^"']+["']/g, `stroke="${stroke}"`);
    }

    const svgBody = raw.split('<svg')[1] || '';
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="${fill}" width="${width}px" height="${height}px" ${classNameAttr} ${svgBody}`;
  });
</script>

<template>
  <span
    v-if="svgContent"
    v-html="svgContent"
    style="line-height: 0; display: block"
  ></span>
</template>
