<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { Area } from '@antv/g2plot'
import { formatDate } from '@/utils/format'
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
      default: 'chart'
    },
    title: {
      type: Object,
      default() {
        return {
          visible: false,
          text: ''
        }
      }
    },
    xAxis: {
      type: Object,
      default() {
        return {
          visible: true,
          type: 'dateTime',
          tickCount: 5,
          tickLine: false,
          label: {
            formatter: (val) => formatDate(val, 'hh:mm')
          }
        }
      }
    },
    yAxis: {
      type: Object,
      default() {
        return {
          visible: true,
          grid: {
            visible: false
          },
          label: {
            visible: false,
            // 数值格式化为千分位
            formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
          }
        }
      }
    },
    color: {
      type: Array,
      default() {
        return ['#007fdf', '#ffb412']
      }
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    legend: {
      type: Object,
      default() {
        return {
          visible: false,
          position: 'top-right'
        }
      }
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
      _this.chart = new Area(document.getElementById(_this.id), {
        title: {
          visible: _this.title.visible,
          text: _this.title.text
        },
        padding: 'auto',
        color: _this.color,
        // width: '100%',
        // height: '100%',
        forceFit: true,
        data: _this.lists,
        xField: 'date',
        yField: 'value',
        xAxis: _this.xAxis,
        yAxis: _this.yAxis,
        legend: _this.legend,
        smooth: true,
        stackField: 'name',
        tooltip: {
          visible: true,
          shared: true,
          showCrosshairs: true,
          fields: ['date', 'value', 'name', 'unit'],
          formatter: (date, value, name, unit) => {
            return {
              name: name,
              value: value + ' ' + unit
            }
          }
        },
        areaStyle: {
          fillOpacity: 0.05
        },
        responsive: true
      })
      _this.chart.render()
    }
  }
}
</script>
