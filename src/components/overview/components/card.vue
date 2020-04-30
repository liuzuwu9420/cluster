<template>
  <div class="card">
    <div class="title">{{ content.title }}</div>
    <div class="chart">
      <dv-active-ring-chart :config="content.config" />
    </div>
    <div class="count">
      <div class="count-text">
        <span class="title">已用</span>
        <span>{{ content.current }} {{ content.unit }}</span>
      </div>
      <dv-decoration-2 />
      <div class="count-text">
        <span class="title">总量</span>
        <span>{{ content.total }} {{ content.unit }}</span>
      </div>
    </div>
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
    >.title{
      width: 100%;
      display: flex;
      align-self: center;
      font-size: 30px;
      margin-left: 10%;
    }
    .chart{
      width: 50%;
      height: calc(100% - 20px);
      margin-right: -5%;
      margin-left: -5%;
      .dv-active-ring-chart{
        width: 100%;
        height: 100%;
      }
    }
    .count{
      display: flex;
      justify-content: center;
      flex-flow: column nowrap;
      width: 50%;
      .dv-decoration-2{
        width: 100%;
        height: 30px;
      }
      .count-text{
        >.title{
          font-size: 30px;
        }
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }
  }
</style>

