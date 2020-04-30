<template>
  <div id="left">
    <card :content="cpuData" />
    <card :content="memData" />
  </div>
</template>
<script>
import card from './components/card'
import { GetAllMem, GetUnusedMem, GetAllCpu, GetUsedCpu } from '@/api/prometheus'
import { formatBytes } from '@/utils/format'

export default {
  name: 'Left',
  components: {
    card
  },
  data() {
    return {
      cpuData: {},
      memData: {},
      config: {
        data: [],
        lineWidth: 10,
        activeTimeGap: 5000,
        animationFrame: 200,
        color: ['#27c9e7', '#1d4082'],
        digitalFlopToFixed: 2
      },
      cpuAll: 0,
      cpuUsed: 0,
      memAll: 0,
      memUsed: 0
    }
  },
  mounted() {
    this.setData()
    clearInterval(timer)
    const timer = setInterval(() => {
      this.setData()
    }, 10000)
  },
  methods: {
    setData() {
      const cpuConfig = JSON.parse(JSON.stringify(this.config))
      const memConfig = JSON.parse(JSON.stringify(this.config))
      this.getAllData().then(() => {
        cpuConfig.data = [{ name: '已用', value: this.cpuUsed }, { name: '未用', value: this.cpuAll - this.cpuUsed }]
        memConfig.data = [{ name: '已用', value: this.memUsed }, { name: '未用', value: this.memAll - this.memUsed }]
        this.cpuData = {
          title: 'CPU核占用数',
          current: this.cpuUsed,
          total: this.cpuAll,
          unit: '核',
          config: cpuConfig
        }
        this.memData = {
          title: '内存用量',
          current: formatBytes(this.memUsed),
          total: formatBytes(this.memAll),
          unit: '',
          config: memConfig
        }
      })
    },
    async getAllData() {
      this.cpuAll = parseInt((await GetAllCpu()).data.result[0].value[1])
      this.cpuUsed = parseInt((await GetUsedCpu()).data.result[0].value[1])
      this.memAll = (await GetAllMem()).data.result[0].value[1]
      this.memUsed = this.memAll - (await GetUnusedMem()).data.result[0].value[1]
    }
  }

}
</script>
<style lang="scss" scoped>
  #left{
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    font-size: 30px;
    text-shadow: 0 0 10px rgba(255,255,255,.5);
  }
</style>
