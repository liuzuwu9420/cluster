<template>
  <div class="card">
    <div class="title">{{ content.title }}</div>
    <div class="chart">
      <dv-active-ring-chart :config="content.config" />
    </div>
    <div class="count">{{ content.current }} / {{ content.total }} {{ content.unit }}</div>
  </div>
</template>
<script>
export default {
  name: 'Card',
  props: {
    content: {
      type: Object,
      default() {
        return { title: '', current: 0, total: 0, unit: '', config: {}}
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
  .card{
    width: 100%;
    height: 50%;
    display: flex;
    flex-flow: row wrap;
    .title{
      width: 100%;
      display: flex;
      align-self: center;
      font-size: 30px;
      margin-left: 10%;
    }
    .chart{
      width: 50%;
      height: calc(100% - 20px);
      margin-right: -30px;
      .dv-active-ring-chart{
        width: 100%;
        height: 100%;
      }
    }
    .count{
      display: flex;
      align-items: center;
    }
  }
</style>

