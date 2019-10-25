<template>
  <div class="dashboard-editor-container">
    <panel-card @handleSetLineChartData="handleSetLineChartData" />
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
  </div>
</template>

<script>
import PanelCard from './components/PanelCard'
import PanelGroup from './components/PanelGroup'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelCard,
    PanelGroup
  },
  data() {
    return {

    }
  },
  methods: {
    handleSetLineChartData(type) {
      console.log(type)
    }
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
