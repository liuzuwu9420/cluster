<template>
  <div id="tagSearch">
    <el-autocomplete
      ref="tagName"
      v-model="tagName"
      :fetch-suggestions="keySearchAsync"
      value-key="LabelKey"
      class="tagInput"
      placeholder="标签键"
    />
    <el-autocomplete
      ref="tagValue"
      v-model="tagValue"
      :fetch-suggestions="valueSearchAsync"
      value-key="LabelValue"
      class="tagInput"
      placeholder="标签值"
      @input="handleSearch"
    >
      <i slot="suffix" class="el-icon-search el-input__icon" @click="handleSearch" />
    </el-autocomplete>
  </div>
</template>
<script>
import { GetAllTags, GetAllKeys, GetValuesByKey } from '@/api/tags'

export default {
  name: 'TagSearch',
  data() {
    return {
      tagName: '',
      tagValue: '',
      list: [],
      params: {
        page: { 'PageSize': 100, 'PageNumber': 1 },
        query: {}
      }
    }
  },
  methods: {
    async keySearchAsync(queryString, cb) {
      try {
        const list = (await GetAllKeys(this.params)).Inventory.ResultData
        const result = queryString ? list.filter(this.createFilter(queryString, ['LabelKey'])) : list
        cb(result)
      } catch (e) {
        console.log(`can't GetAllKeys:${e}`)
      }
    },
    async valueSearchAsync(queryString, cb) {
      if (!this.tagName) {
        cb([])
        return
      }
      try {
        const list = (await GetValuesByKey(this.tagName, this.params)).Inventory.ResultData
        const result = queryString ? list.filter(this.createFilter(queryString, ['LabelValue'])) : list
        cb(result)
      } catch (e) {
        console.log(`can't GetValuesByKey:${e}`)
      }
    },
    createFilter(queryString, prop) {
      return (item) => {
        return (item[prop].toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    async getAllTags() {
      try {
        this.list = (await GetAllTags(this.params)).Inventory.ResultData
      } catch (e) {
        console.log(`can't GetAllTags: ${e}`)
      }
    },
    handleSearch: function() {
      let matchTag = {}
      this.getAllTags().then(() => {
        this.list.forEach(tag => {
          if (tag.LabelKey === this.tagName && tag.LabelValue === this.tagValue) {
            matchTag = tag
          }
        })
        if (!matchTag.UUID) {
          matchTag = { LabelKey: this.tagName, LabelValue: this.tagValue }
        }
        this.$emit('change', matchTag)
      })
    }
  }
}
</script>
<style lang="scss">
  #tagSearch{
    .el-input__inner {
      width: 120px;
    }
    .el-input__icon{
      cursor: pointer;
      &:active{
        color:gray;
      }
    }
  }
</style>
