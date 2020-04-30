<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { StackedColumn } from '@antv/g2plot'
export default {
  props: {
    lists: {
      type: Array,
      default() {
        return []
      }
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'columnChart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    lists: {
      handler: function(val, oldVal) {
        const _this = this
        if (_this.chart) {
          _this.chart.changeData(val)
          /* _this.chart.updateConfig({
            data: val
          })
          _this.chart.render() */
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const _this = this
      _this.chart = new StackedColumn(document.getElementById(_this.id), {
        title: {
          visible: true,
          text: '队列'
        },
        padding: 'auto',
        width: '100%',
        height: '100%',
        forceFit: true,
        animation: false,
        data: _this.lists,
        color: ['#007fdf', '#ffb412'],
        xField: 'name',
        yField: 'value',
        xAxis: {
          title: {
            visible: false
          }
        },
        yAxis: {
          title: {
            visible: false
          },
          label: {
            // 数值格式化为千分位
            formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
          }
        },
        legend: {
          position: 'top-center'
        },
        stackField: 'status',
        label: {
          visible: true,
          position: 'middle'
        }
      })
      _this.chart.render()
    }
  }
}
</script>
