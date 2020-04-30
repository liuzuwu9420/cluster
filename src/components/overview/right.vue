<template>
  <div id="right">
    <card :content="nodeData" />
    <card :content="fsData" />
  </div>
</template>
<script>
import card from './components/card'
import { GetAllFs, GetUnusedFs, GetAllHosts, GetUnusedHosts } from '@/api/prometheus'
import { formatBytes } from '@/utils/format'

export default {
  name: 'Right',
  components: {
    card
  },
  data() {
    return {
      fsData: {},
      nodeData: {},
      config: {
        data: [],
        lineWidth: 10,
        activeTimeGap: 6000,
        animationFrame: 200,
        color: ['#27c9e7', '#1d4082'],
        digitalFlopToFixed: 2
      },
      fsAll: 0,
      fsUsed: 0,
      nodeAll: 0,
      nodeUsed: 0
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
      const fsConfig = JSON.parse(JSON.stringify(this.config))
      const nodeConfig = JSON.parse(JSON.stringify(this.config))
      this.getAllData().then(() => {
        fsConfig.data = [{ name: '已用', value: (this.fsUsed) }, { name: '未用', value: (this.fsAll - this.fsUsed) }]
        nodeConfig.data = [{ name: '已用', value: this.nodeUsed }, { name: '未用', value: this.nodeAll - this.nodeUsed }]
        this.fsData = {
          title: '硬盘用量',
          current: formatBytes(this.fsUsed),
          total: formatBytes(this.fsAll),
          unit: '',
          config: fsConfig
        }
        this.nodeData = {
          title: '集群节点用量',
          current: this.nodeUsed,
          total: this.nodeAll,
          unit: '个',
          config: nodeConfig
        }
      })
    },
    async getAllData() {
      this.fsAll = (await GetAllFs()).data.result[0].value[1]
      this.fsUsed = this.fsAll - (await GetUnusedFs()).data.result[0].value[1]
      this.nodeAll = (await GetAllHosts()).data.result[0].value[1]
      this.nodeUsed = this.nodeAll - (await GetUnusedHosts()).data.result[0].value[1]
    }
  }
}
</script>
<style lang="scss" scoped>
  #right{
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    font-size: 30px;
    text-shadow: 0 0 10px rgba(255,255,255,.5);
    .card{
      .title{
        justify-content: flex-end;
      }
    }
  }
</style>
