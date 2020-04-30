<template>
  <div class="dashboard-editor-container">
    <panel-group />
    <panel-task />
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PanelTask from './components/PanelTask'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    PanelTask
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 16px;
  background-color: rgb(240, 242, 245);
  position: relative;
  /*.github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }*/
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
