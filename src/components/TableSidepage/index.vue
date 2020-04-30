<template>
  <div v-if="thisShow" :style="styleObject" class="tableSidepage">
    <span class="close" @click="handleClose"><i class="el-icon-close" /></span>
    <span class="bottom" />
    <slot />
  </div>
</template>
<script>
export default {
  name: 'TableSidepage',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    styleObject: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    thisShow: {
      get() { return this.show },
      set() {}
    }
  },
  methods: {
    handleClose() {
      this.thisShow = false
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss" scoped>
    .tableSidepage {
        left: 200px;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        border-right: 1px solid #fff;
        background: #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, .4);
        display: flex;
        flex-flow: column;
        .close{
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 25px;
            cursor: pointer;
            z-index: 1;
        }
        .bottom{
          content: "";
          position: absolute;
          left: 0;
          top: 42px;
          width: 50px;
          height: 2px;
          background-color: #dfe4ed;
          z-index: 1;
        }
    }
</style>
