<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { Area } from '@antv/g2plot'
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
    yAxis: {
      type: Object,
      default() {
        return {
          visible: false,
          label: {
            // 数值格式化为千分位
            formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
          }
        }
      }
    },
    color: {
      type: Array,
      default() {
        return ['#007fdf', '#52c4ff']
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
          _this.chart.updateConfig({
            data: val
          })
          _this.chart.render()
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
        width: '100%',
        height: '100%',
        forceFit: true,
        data: _this.lists,
        tooltip: {
          htmlContent: (title, items) => {
            if (_this.color.length && items) {
              let lis = ''
              for (let i = 0; i < _this.color.length; i++) {
                lis += `<li data-index="${i}">
                      <span
                        style="background-color:${_this.color[i]};width:8px;height:8px;border-radius:50%;             display:inline-block;margin-right:8px;"
                      ></span>
                      ${items[i].name}: ${items[i].value} ${items[0].point._origin.unit}
                    </li>`
              }
              return `
                <div class="g2-tooltip">
                  <div class="g2-tooltip-title" style="margin:10px 0;">${items[0].point._origin.time}</div>
                  <ul class="g2-tooltip-list">
                    ${lis}
                  </ul>
                </div>`
            } else {
              return `
                <div class="g2-tooltip">
                  <div class="g2-tooltip-title" style="margin:10px 0;"></div>
                  <ul class="g2-tooltip-list">
                    <li></li>
                  </ul>
                </div>`
            }
          }
        },
        xField: 'time',
        yField: 'value',
        xAxis: {
          type: 'time',
          tickCount: 6,
          tickLine: false
        },
        yAxis: _this.yAxis,
        legend: _this.legend,
        smooth: true,
        stackField: 'name',
        areaStyle: {
          opacity: 0.05
        },
        responsive: true
      })
      _this.chart.render()
    }
  }
}
</script>
