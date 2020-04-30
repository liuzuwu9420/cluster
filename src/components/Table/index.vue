<template>
  <el-table
    ref="el-table"
    v-loading="loading"
    :data="data"
    fit
    element-loading-text="Loading"
    highlight-current-row
    height="100%"
    @sort-change="sortChange"
  >
    <template v-for="(colConfig,index) in colConfigs">
      <slot v-if="colConfig.slot" :name="colConfig.slot" />
      <component
        :is="colConfig.component"
        v-else-if="colConfig.component"
        :key="index"
        :col-config="colConfig"
      />
      <el-table-column v-else :key="index" v-bind="colConfig" align="center" />
    </template>
  </el-table>
</template>
<script>
export default {
  name: 'Table',
  props: {
    'colConfigs': {
      type: Array,
      default() { return [] }
    },
    'data': {
      type: Array,
      default() { return [] }
    },
    'loading': Boolean,
    'sortChange': {
      type: Function,
      default() { return {} }
    }
  }
}
</script>

