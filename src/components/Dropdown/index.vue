<template>
  <el-dropdown @command="handleDropdownCommand">
    <el-button type="primary">
      {{ selected.value }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :key="key" v-for="(val,key) in items" v-text="val" :command="key"></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "Dropdown",
  props: {
    selected: {
      required: true,
      type: Object,
      default: {
        key: "",
        value: ""
      }
    },
    items: {
      required: true,
      type: Object,
      default: {}
    }
  },
  methods: {
    handleDropdownCommand(command) {
      if (command != this.selected.key) {
        this.selected.key = command;
        this.selected.value = this.items[command];
        this.$emit("change", this.selected);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dropdown {
  float: left;
  margin-right: 10px;
}
</style>
