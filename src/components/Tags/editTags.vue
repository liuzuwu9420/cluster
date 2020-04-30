<template>
  <el-dialog
    :visible.sync="showThis"
    :modal="true"
    :modal-append-to-body="false"
    width="40%"
    title="编辑标签"
    @close="close"
  >
    <div class="tag-container">
      <el-tag v-for="(tag,index) in TagArr" :key="index" type="info" closable @close="removeTag(tag.UUID)">
        {{ tag.LabelKey }}:{{ tag.LabelValue }}
      </el-tag>
    </div>
    <div class="tag-bind">
      <span>新建标签：</span>
      <span class="input-group">
        <el-input v-model="tagInputKey" placeholder="键" size="mini" />
        <el-input v-model="tagInputValue" placeholder="值" size="mini" />
      </span>
      <el-button-group class="button-group">
        <el-button size="mini" @click="addTag">确定</el-button>
        <el-button size="mini" @click="cancelAddTag">重置</el-button>
      </el-button-group>
    </div>
  </el-dialog>
</template>
<script>
import { DeleteTagOfHost, StickLabelToHost, GetTagOfHost } from '@/api/device'
import { CreateTag } from '@/api/tags'
export default {
  name: 'EditTags',
  props: {
    hostUUID: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    tags: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      TagArr: this.tags,
      tagInputKey: '',
      tagInputValue: '',
      showThis: this.show
    }
  },
  watch: {
    show(value) {
      this.showThis = value
    }
  },
  methods: {
    async removeTag(tagUUID) {
      const v = await DeleteTagOfHost(this.hostUUID, tagUUID)
      console.log(v)
      await this.refreshTagArr()
    },
    async addTag() {
      // 添加标签：先通过tags内api新增一个标签，再与当前机器绑定
      if (this.tagInputKey === '' || this.tagInputValue === '') { return }
      const newTagObj = { LabelKey: this.tagInputKey, LabelValue: this.tagInputValue }
      const newTag = (await CreateTag(newTagObj)).Inventory

      const stickObj = { LabelUUID: newTag.UUID, ResourceType: 'host' }
      await StickLabelToHost(this.hostUUID, stickObj)
      this.refreshTagArr()
      this.cancelAddTag()
    },
    cancelAddTag() {
      this.tagInputKey = ''
      this.tagInputValue = ''
    },
    async refreshTagArr() {
      this.TagArr = (await GetTagOfHost(this.hostUUID)).Inventory
    },
    close() {
      this.showThis = false
      this.$emit('editTagsClosed', this.TagArr)
    }
  }
}
</script>
<style lang="scss" >
    .tag-container{
        height: 100px;
        border: 2px dashed gray;
        border-radius: 5px;
        padding: 10px;
    }
    .tag-bind{
        font-size: 10px;
        padding-top:10px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        .input-group{
            display: flex;
        }
        .button-group{
            display: flex;
        }
    }
</style>
