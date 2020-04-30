<template>
  <div id="overview">
    <dv-full-screen-container>
      <div class="main-header">
        <div class="title title-bg">
          ClusterMom 监控系统
          <dv-decoration-3 />
        </div>
      </div>
      <dv-border-box-1 class="main-content">
        <div class="main-left">
          <mainLeft />
        </div>
        <div class="main-right">
          <mainRight />
        </div>
        <div class="main-center">
          <mainCenter />
        </div>
        <div class="main-bottom">
          <mainBottom />
        </div>
      </dv-border-box-1>
    </dv-full-screen-container>

  </div>
</template>
<script>
import mainCenter from './center'
import mainLeft from './left'
import mainRight from './right'
import mainBottom from './bottom'
export default {
  name: 'DataView',
  components: {
    mainCenter,
    mainLeft,
    mainRight,
    mainBottom
  },
  data() {
    return {
      isLoading: false
    }
  }
}
</script>
<style lang="scss">
  #overview {
    font-family: PingFangSC-Semibold, sans-serif;
    color: #ffffff;
    text-shadow: 0 0 6px rgba(0,0,0,.3);
    #dv-full-screen-container {
      background: rgb(13, 28, 55);
      background-size: 100% 100%;
      box-shadow: 0 0 3px blue;
      display: flex;
      flex-direction: column;
      .main-header {
        height: 50px;
        .title {
          font-size: 3vh;
          .dv-decoration-3{
            width:350px;
            height:50px;
            display: inline-block;
          }
        }
      }
      .main-content {
        height: calc(100% - 50px);
      .border-box-content{
        display: grid;
        grid-template-columns: 31% 1fr 31%;
        grid-template-rows: repeat(2,34%) 32%;
        grid-template-areas: 'a c b'
        'a c b'
        'd d d';
        padding: 25px;
        .main-left{
          grid-area: a;
        }
        .main-right{
          grid-area: b;
        }
        .main-center{
          grid-area: c;
        }
        .main-bottom{
          grid-area: d;
        }
      }
      }
    }
  }
  .title-bg{
    background: center/cover
    linear-gradient(to right, rgb(72, 163, 214) 3px, transparent 3px),
    linear-gradient(to right,rgba(13, 28, 55,0),rgba(13, 28, 55,1) 80%),
    repeating-linear-gradient(60deg,
                    rgb(11, 48, 89),
                    rgb(11, 48, 89) 25px,
                    transparent 25px,
                    transparent 50px)
  ;
    padding-left: 20px;
  }
</style>
