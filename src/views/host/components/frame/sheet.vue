<template>
  <span class="sheet">
    <img :tabIndex="index" :class="{ sheetBorder: borderShow }" src="../../../../assets/frame_images/sheet.jpg" class="img">
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    index: {
      required: true,
      type: Number,
      default() {
        return 0
      }
    },
    borderShow: {
      required: true,
      type: Boolean,
      default() {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sheet {
  width: auto;
  height: auto;
  position: relative;
  top: -174px;
  left: 15px;
  cursor: pointer;
  .img {
    height: 8%;
    width: 8.65%;
  }
  .img:hover {
    border: 1px solid #1890ff;
  }
  .img:focus {
    border: 2px solid #1890ff;
  }
  .sheetBorder {
    border: 2px solid #1890ff;
  }
}
</style>
