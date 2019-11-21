<template>
  <div class="headBut">
    <div v-show="showSearch" class="headBut">
      <el-button type="primary" icon="el-icon-search" @click="showSearch = false" />
    </div>
    <div v-show="!showSearch" class="headBut">
      <el-input v-model="input" placeholder="请输入内容" class="input-with-select">
        <el-select slot="prepend" v-model="select">
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
    }
  },
  data() {
    return {
      showSearch: true,
      input: '',
      select: this.items[0].value
    }
  },
  watch: {
    select() {
      this.debouncedGetList()
    },
    input() {
      this.debouncedGetList()
    }
  },
  created() {
    this.debouncedGetList = this._.debounce(this.handleSearch, 500)
  },
  methods: {
    close() {
      this.showSearch = true
      this.input = ''
    },
    handleSearch() {
      const Params = {
        select: this.select,
        value: this.input
      }
      this.$emit('change', Params)
    }
  }
}
</script>
<style scoped>
.el-input__icon {
  font-size: 26px;
  color: #1890ff;
  cursor: pointer;
}
</style>
