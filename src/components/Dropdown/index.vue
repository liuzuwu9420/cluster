<template>
  <el-dropdown @command="handleDropdownCommand">
    <el-button type="primary">
      {{ selected.value }}
      <i class="el-icon-arrow-down el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(val,key) in items" :key="key" :command="key" v-text="val" />
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    selected: {
      required: true,
      type: Object,
      default() {
        return { key: '', value: '' }
      }
    },
    items: {
      required: true,
      type: Object,
      default() { return {} }
    }
  },
  methods: {
    handleDropdownCommand(command) {
      if (command !== this.selected.key) {
        this.selected.key = command
        this.selected.value = this.items[command]
        this.$emit('change', this.selected)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dropdown {
  float: left;
  margin-right: 10px;
}
</style>
