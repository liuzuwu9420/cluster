<template>
  <span>
    <slot />
    <el-button v-clipboard:copy="text" v-clipboard:success="clipboardSuccess" type="text" size="mini"><i class="el-icon-copy-document" /></el-button>
  </span>
</template>
<script>
import clipboard from '@/directive/clipboard/index.js'
export default {
  name: 'Clipboard',
  directives: {
    clipboard
  },
  props: {
    text: {
      type: String,
      require: true,
      default: ''
    }
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>
