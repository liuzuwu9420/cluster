<template>
  <div class="tag">
    <el-popover placement="top" trigger="hover">
      <div class="tags">
        <el-tag v-for="(tag,index) in TagArr" :key="index" type="info">
          {{ tag.LabelKey }} : {{ tag.LabelValue }}
        </el-tag>
      </div>
      <div class="edit-Tag">
        <el-button type="text" size="small" @click="editTagVisible = true">编辑标签</el-button>
        <editTags :host-u-u-i-d="hostUUID" :tags="tags" :show="editTagVisible" @editTagsClosed="editTagClosed" />
      </div>
      <svg-icon slot="reference" icon-class="tag" />
    </el-popover>
  </div>
</template>
<script>
import editTags from './editTags'
export default {
  name: 'Tags',
  components: {
    editTags
  },
  props: {
    hostUUID: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      TagArr: this.tags,
      editTagVisible: false,
      tagInputKey: '',
      tagInputValue: ''
    }
  },
  watch: {
    TagArr(v) {
      this.$emit('tagChanged', v)
    }
  },
  methods: {
    editTagClosed(tags) {
      this.editTagVisible = false
      this.TagArr = tags
    }
  }
}
</script>
<style lang="scss" scoped>
  .tag{
    cursor: pointer;
  }
</style>

