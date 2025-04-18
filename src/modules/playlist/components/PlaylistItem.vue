<script setup>
  import Svg from '@/modules/shared/components/Svg.vue'
</script>

<style lang="scss" scoped>
  .item-container {
    background-image: url('https://i.scdn.co/image/ab67616d0000b2730ff6d8add33883704b313ff8');
    height: 100%;
    aspect-ratio: 1;
    border-radius: var(--maxRadius);

    .details {
      position: absolute;
      display: flex;
      flex-direction: column;
      padding: 10px 0;
      width: calc(100% - 20px);
      border-radius: var(--maxRadius);
      bottom: 10px;
      left: 10px;
      background-color: red;

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
        <Svg name="Music" height="13" width="13" fill="var(--transparent)" style="margin-top: 2px"></Svg>
        <span>157 tracks</span>
      </div>
    </div>
  </div>
</template>
