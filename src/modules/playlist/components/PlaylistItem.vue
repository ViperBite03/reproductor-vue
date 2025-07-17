<script setup>
  import Svg from '@/modules/shared/components/Svg.vue'
</script>

<style lang="scss" scoped>
  .item-container {
    background-image: url('https://i.scdn.co/image/ab67616d0000b2730ff6d8add33883704b313ff8');
    //background-image: url('https://i.scdn.co/image/ab67616d00001e022cf9106556ed024ae6752608');
    height: 100%;
    aspect-ratio: 1;
    border-radius: var(--radius);

    .details {
      position: absolute;
      display: flex;
      justify-content: space-around;
      padding: 10px 0;

      width: calc(100% - 20px);
      border-radius: var(--radius);
      bottom: 10px;
      left: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(1px);

      .total-songs {
        display: flex;
        font-size: 13px;
        font-weight: 500;
        align-items: center;
      }
    }
  }
</style>

<template>
  <div class="item-container g-shadow" style="--blur: 20px; --scale: 0.9">
    <div class="details">
      <div class="name">Ricochet</div>
      <div class="total-songs">
        <Svg name="Music" height="13" width="13" fill="transparent" style="margin-top: 2px"></Svg>
        <span>157</span>
      </div>
    </div>
  </div>
</template>
