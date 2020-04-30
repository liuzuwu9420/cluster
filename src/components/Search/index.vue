<template>
  <div>
    <div v-show="showSearch">
      <el-button type="primary" class="head-button" size="small" icon="el-icon-search" @click="showSearch = false" />
    </div>
    <div v-show="!showSearch">
      <el-input v-model="input" placeholder="请输入内容" class="input-with-select" @keyup.enter.native="debouncedGetList">
        <el-select slot="prepend" v-model="select" style="width:100px;">
          <el-option v-for="item in items" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <i slot="suffix" class="el-input__icon el-icon-circle-close" @click="close()" />
      <!-- <el-button slot="append" icon="el-icon-circle-close" @click="handleSearch(false)"></el-button> -->
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    items: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
    visiable: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showSearch: this.visiable,
      input: '',
      select: this.items[0].value
    }
  },
  created() {
    this.debouncedGetList = this._.debounce(this.handleSearch, 500)
  },
  methods: {
    close() {
      this.showSearch = true
      this.input = ''
      this.handleSearch()
    },
    handleSearch() {
      const Params = {
        select: this.select,
        value: this.input
      }
      this.$emit('change', Params)
    }
  },
  debouncedGetList() {
    this._.debounce(this.handleSearch, 500)
  }
}
</script>
<style scoped>
.el-input__icon {
  font-size: 24px;
  color: #1890ff;
  cursor: pointer;
}
</style>
