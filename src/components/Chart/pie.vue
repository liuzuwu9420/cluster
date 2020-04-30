<template>
  <div :id="id" />
</template>

<script>
import { Pie } from '@antv/g2plot'
import { deepMerge, deepClone } from '@/utils/index'

export default {
  name: 'Pie',
  props: {
    id: {
      type: String,
      default: 'pie'
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
        radius: 0.8,
        data: [],
        meta: {},
        angleField: 'value',
        colorField: 'name',
        label: {
          visible: true,
          type: 'spider'
        }
      },
      mergedConfig: null,
      chart: null
    }
  },
  watch: {
    config(v) {
      this.mergeConfig()
      this.chart.updateConfig(v)
      this.chart.render()
      // g2plot饼图数据更新不触发label更新
      // https://github.com/antvis/G2Plot/issues/906
    //   this.chart.changeData(v.data)
    //   this.chart.repaint()
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
      this.chart = new Pie(document.getElementById(this.id), this.mergedConfig)
      this.chart.render()
    },
    mergeConfig() {
      const { defaultConfig, config } = this
      this.mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {})
    }
  }
}
</script>
