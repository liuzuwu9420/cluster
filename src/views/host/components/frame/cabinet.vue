<template>
  <div class="cabinet">
    <img src="../../../../assets/frame_images/cabinet.jpg" class="img">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.cabinet {
  width: 100%;
  height: 100%;
  .img {
    height: auto;
    max-width: 100%;
  }
}
</style>
