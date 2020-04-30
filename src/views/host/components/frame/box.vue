<template>
  <div class="box">
    <img src="../../../../assets/frame_images/box.jpg" class="img">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.box {
  width: 80%;
  height: 100%;
  position: relative;
  top: -762px;
  left: 25px;
  .img {
    height: auto;
    width: 100%;
  }
}
</style>
