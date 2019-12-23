<template>
  <div id="bottom">
    <div v-for="(item,index) in configs" :key="index" class="top">
      <div class="title-bg title-bottom title">{{ item.title }}<span>TOP5</span></div>
      <dv-scroll-ranking-board :config="item.config" />
    </div>
  </div>
</template>
<script>
import { GetRunTaskTOPList, GetPendTaskTOPList, GetQueueTOPList } from '@/api/task'
import { formatDiff } from '@/utils/format'

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
          title: '作业运行时间',
          config: {}
        },
        {
          title: '作业等待时间',
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
      this.getQueueTopJobs(GetQueueTOPList).then(value => {
        if (!value) { return }
        this.configs[0].config = value
      })
      this.getTopJobs(GetRunTaskTOPList).then(value => {
        if (!value) { return }
        this.configs[1].config = value
        this.$nextTick(() => {
          value.data.map((item, index) => {
            this.$el.querySelectorAll('.top:nth-of-type(2) .ranking-value')[index].innerHTML = formatDiff(item.startTime)
          })
        })
      })
      this.getTopJobs(GetPendTaskTOPList).then(value => {
        if (!value) { return }
        this.configs[2].config = value
        this.$nextTick(() => {
          value.data.map((item, index) => {
            this.$el.querySelectorAll('.top:nth-of-type(3) .ranking-value')[index].innerHTML = formatDiff(item.startTime)
          })
        })
      })
    },
    async getTopJobs(api) {
      const jobList = (await api()).Inventory
      if (!jobList || !jobList.length > 0) { return }
      let prop = 'ExecuteTime'
      if (api.toString().toLowerCase().indexOf('run') >= 0) {
        prop = 'ExecuteTime'
      } else if (api.toString().toLowerCase().indexOf('pend') >= 0) {
        prop = 'SubmitTime'
      }
      const config = { data: [] }
      jobList.forEach((item, index) => {
        if (item.ReqNumProcsMax !== 0) {
          config.data.push({ name: `作业ID： ${item.JobID} , 占用核数： ${item.ReqNumProcsMax} , 用户： ${item.UserName} `, value: this.getDiffTime(item[prop]), startTime: item[prop] })
        } else {
          config.data.push({ name: `作业ID： ${item.JobID} , 用户： ${item.UserName}`, value: this.getDiffTime(item[prop]), startTime: item[prop] })
        }
        return config
      })
      return config
    },
    getDiffTime(time) {
      const startTime = new Date(time)
      const endTime = new Date()
      return endTime.getTime() - startTime.getTime()
    },
    async getQueueTopJobs(api) {
      const list = (await api()).Inventory
      if (!list.length > 0) { return }
      const valueSorted = list.sort((a, b) => { return b[0] - a[0] })
      const config = { data: [] }
      valueSorted.map(item => {
        config.data.push({ name: Object.keys(item)[0], value: `${Object.values(item)[0]} 项作业` })
        return config
      })
      return config
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
