<template>
  <div id="center">
    <div class="flop">
      <div class="title">作业总数</div>
      <flopNumber :number="number" />
    </div>
    <div class="flip">
      <div class="item-chart">
        <div class="bg">
          <svg-icon icon-class="table" />
        </div>
        <div class="front">
          <dv-charts :option="option" />
        </div>
        <div class="back">
          <dv-charts :option="option" />
        </div>
      </div>
      <div class="item-list">
        <ul>
          <li v-for="(item,index) in list" :key="index" :style="`color: ${item.color}`">
            {{ item.name }} : {{ item.value }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import flopNumber from './components/flopNumber'
import { GetRunJobs, GetPendJobs, GetTotalJobs } from '@/api/prometheus'
export default {
  name: 'Center',
  components: {
    flopNumber
  },
  data() {
    return {
      number: 0,
      option: {},
      list: [],
      color: ['#37a2da', '#9fe6b8']
    }
  },
  mounted() {
    this.updateData()
    clearInterval(timer)
    const timer = setInterval(this.updateData, 5000)
  },
  methods: {
    updateData() {
      this.getData()
    },
    setOption() {
      this.option = {
        series: [
          {
            type: 'pie',
            data: this.list,
            radius: ['70%', '80%'],
            outsideLabel: { show: false }
          }
        ],
        color: this.color
      }
    },
    async getData() {
      const run = parseInt((await GetRunJobs()).data.result[0].value[1])
      const pend = parseInt((await GetPendJobs()).data.result[0].value[1])
      const total = parseInt((await GetTotalJobs()).data.result[0].value[1])
      this.list = [
        { name: '运行中', value: run, color: this.color[0] },
        { name: '等待中', value: pend, color: this.color[1] }]
      this.number = total
      this.option = {
        series: [
          {
            type: 'pie',
            data: this.list,
            radius: ['70%', '80%'],
            outsideLabel: { show: false }
          }
        ],
        color: this.color
      }
    }
  }
}
</script>
<style>
  .title{
    font-size: 60px;
    font-weight: lighter;
    text-shadow: 0 0 20px rgba(255,255,255,.6);
    color: rgb(70, 170, 225);
  }
</style>
<style lang="scss" scoped>
  @keyframes flip {
    from {transform: rotateY(0deg);}
    37.5% {transform: rotateY(0deg);}
    50% {transform: rotateY(-180deg);}
    87.5% {transform: rotateY(-180deg);}
    100% {transform: rotateY(-360deg);}
  }
  #center{
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    .flop{
      height: 40%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-evenly;
      align-items: center;
    }
    .flip{
      display: flex;
      justify-content: center;
      width: 100%;
      height: 50%;
      perspective: 600px;
      transform-style:preserve-3d;
      .item-chart{
        width: 40%;
        position: relative;
        transition:0.6s 3s;
        transform-style:preserve-3d;
        animation: flip 8s 0s infinite;
        .bg{
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 90px;
          color: rgb(29, 64, 130);
        }
        .front,.back{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backface-visibility:hidden;
        }
        .front{z-index: 2;}
        .back{transform:rotateY(-180deg)}
      }
      .item-list{
        ul{
          height: 100%;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-evenly;
          margin:0;
          padding: 0;
          list-style: none;
          font-size: 30px;
          align-items: center;
        }
      }
    }
  }

</style>
