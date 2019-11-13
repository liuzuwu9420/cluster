<template>
  <span :class="{'hidden':hidden}" class="tags-container">
    <span v-for="(tag, index) in tags" :key="index" class="tag-value">
      <el-tag
        closable
        :disable-transitions="false"
        @close="handleCloseTag(tag)"
      >
        {{ tag.LabelName }}:{{ tag.LabelValue }}
      </el-tag>
    </span>
    <span v-if="tagInputVisible">
      <el-input
        ref="saveTagInput"
        v-model="tagInputValue.LabelName"
        class="input-new-tag"
        size="small"
      />
      <span>-</span>
      <el-input
        v-model="tagInputValue.LabelValue"
        class="input-new-tag"
        size="small"
        @keyup.enter.native="handleTagInputConfirm"
        @blur="handleTagInputConfirm"
      />
    </span>
    <el-button v-else class="button-new-tag" :size="size" @click="showTagInput">+</el-button>
  </span>
</template>

<script>
import { CreateTags, DeleteTags } from '../../api/tags'
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
    uuid: {
      required: true,
      type: String,
      default: ''
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
      tagInputValue: {}
    }
  },
  methods: {
    // 处理关闭 tag
    handleCloseTag(tag) {
      const _this = this
      DeleteTags(tag.UUID)
        .then(res => {
          _this.tags.splice(_this.tags.indexOf(tag), 1)
        }).catch(res => {
          console.log(res)
          _this.$message({
            type: 'info',
            message: '标签删除失败'
          })
        })
    },
    // 显示tag输入框
    showTagInput() {
      this.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 处理tag确认 输入
    handleTagInputConfirm() {
      const _this = this
      const tagInputValue = _this.tagInputValue
      if (tagInputValue.LabelName && tagInputValue.LabelValue) {
        const data = {
          ResourcesUUID: _this.uuid,
          ResourcesType: 'Hosts',
          LabelName: tagInputValue.LabelName,
          LabelValue: tagInputValue.LabelValue,
          Colour: '#000000',
          LabelType: 'Hosts'
        }
        CreateTags(data)
          .then(res => {
            _this.tags.push(tagInputValue)
          }).catch(res => {
            console.log(res)
            _this.$message({
              type: 'info',
              message: '标签添加失败'
            })
          })
      }
      _this.tagInputVisible = false
      _this.tagInputValue = {}
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
  height: 28px;
  line-height: 26px;
  padding-top: 0;
  padding-bottom: 0;
  font-size: 12px;
}
.input-new-tag {
  width: 80px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
