<template>
  <div class="headBut" v-if="showSearch">
    <el-button type="primary" icon="el-icon-search" @click="showSearch = false"></el-button>
  </div>
  <div class="headBut" v-else>
    <el-input placeholder="请输入内容" v-model="input" @keyup.native="handleSearch" class="input-with-select">
      <el-select v-model="select" slot="prepend">
        <el-option v-for="item in items" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <i slot="suffix" class="el-input__icon el-icon-circle-close" @click="showSearch = true"></i>
      <!-- <el-button slot="append" icon="el-icon-circle-close" @click="handleSearch(false)"></el-button> -->
    </el-input>
  </div>
</template>

<script>
export default {
  name: "Search",
  props: {
    items: {
      required: true,
      type: Array,
      default: []
    }
  },
  data() {
    return {
      showSearch: true,
      input: "",
      select: this.items[0].value
    };
  },
  watch: {
    select() {
      console.log(this.select);
    }
  },
  methods: {
    handleSearch() {
      let Params = {
        select: this.select,
        value: this.input
      };
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
