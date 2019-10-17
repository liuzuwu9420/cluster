<template>
  <el-input placeholder="请输入内容" v-model="input" @keyup="handleSearch" class="input-with-select">
    <el-select v-model="select" slot="prepend">
      <el-option
      v-for="item in items"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
    </el-select>
    <i slot="suffix" class="el-input__icon el-icon-circle-close" @click="handleSearch(false)"></i>
    <!-- <el-button slot="append" icon="el-icon-circle-close" @click="handleSearch(false)"></el-button> -->
  </el-input>
</template>

<script>
export default {
  name: "Search",
  props: {
    items: {
      required: true,
      type: Array,
      default: []
    },
    showSearch: {
      required: true,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      input: "",
      select: this.items[0].value
    }
  },
  watch: {
    select() {
      console.log(this.select)
    }
  },
  methods: {
    handleSearch(bool) {
      let Params = {
        select: this.select,
        value: this.input,
        showSearch: bool
      }
      this.$emit("change", Params);
    }
  }
};
</script>
<style scoped>
  .el-input__icon {
    font-size: 26px;
    color: #1890ff;
    cursor: pointer;
  }
</style>
