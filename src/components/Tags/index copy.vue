<template>
  <span :class="{'hidden':hidden}" class="tags-container">
    <el-tag
      v-for="tag in tags"
      :key="tag"
      closable
      :size="size"
      :disable-transitions="false"
      effect="dark"
      @close="handleCloseTag(tags,tag)"
    >{{ tag }}</el-tag>
    <el-input
      v-if="tagInputVisible"
      ref="saveTagInput"
      v-model="tagInputValue"
      class="input-new-tag"
      :size="size"
      @keyup.enter.native="handleTagInputConfirm(tags)"
      @blur="handleTagInputConfirm(tags)"
    />
    <el-button v-else class="button-new-tag" :size="size" @click="showTagInput">+</el-button>
  </span>
</template>

<script>
export default {
  name: 'Tags',
  props: {
    tags: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
    size: {
      required: false,
      type: String,
      default: ''
    },
    hidden: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tagInputVisible: false,
      tagInputValue: ''
    }
  },
  methods: {
    // 处理关闭 tag
    handleCloseTag(tags, tag) {
      tags.splice(tags.indexOf(tag), 1)
    },
    // 显示tag输入框
    showTagInput() {
      this.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 处理tag确认 输入
    handleTagInputConfirm(tags) {
      const tagInputValue = this.tagInputValue
      if (tagInputValue) {
        tags.push(tagInputValue)
      }
      this.tagInputVisible = false
      this.tagInputValue = ''
    }
  }
}
</script>

<style scoped>
.tags-container.hidden {
  display: none;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
