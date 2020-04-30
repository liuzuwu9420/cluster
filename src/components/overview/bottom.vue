<template>
  <div id="bottom">
    <div v-for="(item,index) in configs" :key="index" class="top">
      <div class="title-bg title-bottom title">{{ item.title }}<span>TOP5</span></div>
      <dv-scroll-ranking-board :config="item.config" />
    </div>
  </div>
</template>
<script>
import { GetQueueRunJobs, GetQueuePendJobs, GetHostRunJobs } from '@/api/prometheus'

export default {
  name: 'Bottom',
  data() {
    return {
      configs: [
        {
          title: '队列运行作业量',
          config: {}
        },
        {
          title: '队列等待作业量',
          config: {}
        },
        {
          title: '节点运行作业量',
          config: {}
        }]
    }
  },
  mounted() {
    this.setData()
    clearInterval(timer)
    const timer = setInterval(() => {
      this.setData()
    }, 5000)
  },
  methods: {
    setData() {
      this.getData().then((data) => {
        for (let i = 0; i < this.configs.length; i++) {
          this.configs[i].config = { data: data[i] }
        }
        this.$nextTick(() => {
          for (let i = 0; i < this.configs.length; i++) {
            this.configs[i].config.data.map((item, index) => {
              this.$el.querySelectorAll(`.top:nth-of-type(${i + 1}) .ranking-value`)[index].innerHTML = `${item.value} 项作业`
            })
          }
        })
      })
    },
    async getData() {
      const queueRunJobs = await this.get(GetQueueRunJobs, 'queue_name')
      const queuePendJobs = await this.get(GetQueuePendJobs, 'queue_name')
      const hostJobs = await this.get(GetHostRunJobs, 'host_name')
      return [queueRunJobs, queuePendJobs, hostJobs]
    },
    async get(api, propName) {
      const res = await api()
      if (res.status !== 'success') { return }
      const data = res.data.result.map(item => {
        const obj = {}
        obj.name = item.metric[propName]
        obj.value = item.value[1]
        return obj
      }).slice(0, 5)
      return data
    }
  }
}
</script>
<style lang="scss">
  #bottom .top .dv-scroll-ranking-board {
    .row-item{
      .ranking-info>.rank{
        color: rgb(55, 162, 218);
      }
      .ranking-column>.inside-column{
        background-color: rgb(55, 162, 218);
      }
    }
  }
</style>
<style lang="scss" scoped>
  #bottom{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    .top{
      width: 30%;
      height: 100%;
      .title-bottom{
        font-size: 20px;
        display: flex;
        height: 36px;
        align-items: center;
        span{
          margin-left: auto;
          position: relative;
          &::before{
            position: absolute;
            left: -50px;
            top: -5px;
            content: '';
            width: 0;
            height: 0;
            border: 12px solid transparent;
            border-bottom-color: rgb(81, 194, 254);
          }
        }
      }
      .dv-scroll-ranking-board{
        width: 100%;
        height: calc(100% - 36px);
        margin-top: 10px;
      }
    }
  }
</style>
