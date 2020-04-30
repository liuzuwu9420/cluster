<template>
  <div :id="id" />
</template>

<script>
import { Column } from '@antv/g2plot'
import { deepMerge, deepClone } from '@/utils/index'

export default {
  name: 'Cloumn',
  props: {
    id: {
      type: String,
      default: 'column'
    },
    config: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      defaultConfig: {
        title: {
          visible: true,
          text: '标题'
        },
        padding: 'auto',
        forceFit: true,
        animation: false,
        data: [],
        meta: {},
        colorField: 'type',
        color: ['#76a1f7', '#77dcb4', '#f2cb67'],
        xField: 'name',
        yField: 'value',
        legend: {
          position: 'top-center'
        },
        label: {
          visible: true,
          position: 'top',
          style: {
            fill: '#0D0E68',
            fontSize: 12,
            fontWeight: 600,
            opacity: 0.6
          }
        },
        columnStyle: {
          fill: '#76a1f7'
        }
      },
      mergedConfig: null,
      chart: null
    }
  },
  watch: {
    config(v) {
      // this.mergeConfig()
      // this.chart.updateConfig()
      this.chart.changeData(v.data)
    },
    deep: true
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { mergeConfig, initChart } = this
      mergeConfig()
      initChart()
    },
    initChart() {
      this.chart = new Column(document.getElementById(this.id), this.mergedConfig)
      this.chart.render()
    },
    mergeConfig() {
      const { defaultConfig, config } = this
      this.mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {})
    }
  }
}
</script>
