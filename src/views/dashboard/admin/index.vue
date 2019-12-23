<template>
  <div class="dashboard-editor-container">
    <panel-card />
    <panel-group />
    <panel-queue />
  </div>
</template>

<script>
import PanelCard from './components/PanelCard'
import PanelGroup from './components/PanelGroup'
import PanelQueue from './components/PanelQueue'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelCard,
    PanelGroup,
    PanelQueue
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
