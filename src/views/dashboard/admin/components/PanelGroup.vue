<template>
  <el-row :gutter="10" class="panel-group">
    <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
      <el-card shadow="hover" class="mgb20">
        <div class="card-panel">
          <iframe :src="CPUSrc" width="100%" height="100%" frameborder="0" />
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="card-panel card-panel-foot">
          <iframe :src="nodeSrc" width="100%" height="100%" frameborder="0" />
        </div>
      </el-card>
    </el-col>

    <el-col :xs="16" :sm="16" :lg="12">
      <el-row>
        <el-col :xs="12" :sm="12" :lg="12" class="RAM-padding">
          <el-card shadow="hover" class="mgb20">
            <div class="card-panel">
              <iframe :src="RAMSrc" width="100%" height="100%" frameborder="0" />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12" class="sto-padding">
          <el-card shadow="hover" class="mgb20">
            <div class="card-panel">
              <iframe :src="storageSrc" width="100%" height="100%" frameborder="0" />
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="hover">
        <div class="card-panel card-panel-foot">
          <iframe :src="netSrc" width="100%" height="100%" frameborder="0" />
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="6">
      <div class="logContainer">
        <el-card class="box-card-pend">
          <div slot="header" class="clearfix">
            <i class="el-icon-time" />
            <span>等待作业</span>
            <span class="more" @click="handleSetLineChartData('PEND')">更多</span>
          </div>
          <div class="logArea el-scrollbar">
            <div
              v-for="(item,index) in pendTOPList"
              :key="index"
              class="item"
              @click="handleSetLineChartData('PEND')"
            >
              <p class="timeArea">
                <span>{{ item.JobID }}</span>
              </p>
              <div class="logContent">
                <span class="title time">{{ item.time }}</span>
              </div>
              <el-divider />
            </div>
          </div>
        </el-card>
        <el-card class="box-card-run">
          <div slot="header" class="clearfix">
            <i class="el-icon-refresh" />
            <span>运行作业</span>
            <span class="more" @click="handleSetLineChartData('RUN')">更多</span>
          </div>
          <div class="logArea el-scrollbar">
            <div
              v-for="(item,index) in runTOPList"
              :key="index"
              class="item"
              @click="handleSetLineChartData('RUN')"
            >
              <p class="timeArea">
                <span>{{ item.JobID }}</span>
              </p>
              <div class="logContent">
                <span class="title time">{{ item.time }}</span>
              </div>
              <el-divider />
            </div>
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {
  GetPendTaskTOPList,
  GetRunTaskTOPList
} from '@/api/task'
import { formatDate, formatDiff } from '@/utils/format'
export default {
  data() {
    return {
      // 计时器
      setTime: null,
      // 引入grafana
      CPUSrc: '',
      RAMSrc: '',
      storageSrc: '',
      netSrc: '',
      nodeSrc: '',
      // 作业
      pendTOPList: [],
      runTOPList: []
    }
  },
  created() {
    this.iframeTime()
    this.getPend()
    this.getRun()
    this.start()
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    getPend() {
      const _this = this
      GetPendTaskTOPList()
        .then(res => {
          if (res.Inventory) {
            _this.pendTOPList = res.Inventory.map(item => {
              const SubmitTime = formatDate(item.SubmitTime, 'yyyy-MM-dd hh:mm:ss')
              item.time = formatDiff(SubmitTime)
              return item
            })
          } else {
            _this.pendTOPList = []
          }
        })
    },
    getRun() {
      const _this = this
      GetRunTaskTOPList()
        .then(res => {
          if (res.Inventory) {
            _this.runTOPList = res.Inventory.map(item => {
              const ExecuteTime = formatDate(item.ExecuteTime, 'yyyy-MM-dd hh:mm:ss')
              item.time = formatDiff(ExecuteTime)
              return item
            })
          } else {
            _this.runTOPList = []
          }
        })
    },

    // 定时获取作业
    start() {
      const _this = this
      if (_this.setTime != null) {
        clearInterval(_this.setTime)
        _this.setTime = null
      }
      _this.setTime = setInterval(function() {
        _this.getPend()
        _this.getRun()
      }, 1000)
    },

    stop() {
      const _this = this
      clearInterval(_this.setTime)
      _this.setTime = null
    },

    handleSetLineChartData(Status) {
      this.$router.push({
        name: 'task.taskList',
        params: {
          Status: Status
        }
      })
    },
    iframeTime() {
      const _this = this
      const httpUrl =
        'http://16.16.18.61:3000/d-solo/fafSLghZz/dashboard?orgId=1'
      const timeInterval = '&from=now-30m&to=now'
      const CPUId = '&panelId=2'
      const RAMId = '&panelId=6'
      const storageId = '&panelId=4'
      const nodeId = '&panelId=10'
      const netId = '&panelId=8'
      _this.netSrc = httpUrl + timeInterval + netId
      _this.CPUSrc = httpUrl + timeInterval + CPUId
      _this.RAMSrc = httpUrl + timeInterval + RAMId
      _this.storageSrc = httpUrl + timeInterval + storageId
      _this.nodeSrc = httpUrl + timeInterval + nodeId
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .mgb20 {
    margin-bottom: 10px;
  }
  .RAM-padding {
    padding-right: 5px;
  }
  .sto-padding {
    padding-left: 5px;
  }
  .card-panel {
    height: 300px;
    cursor: pointer;
    font-size: 16px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
  }
  .card-panel-foot {
    height: 405px;
  }
  .logContainer {
    background: #fff;
    box-sizing: border-box;
    height: 715px;
    max-height: 715px;
    overflow: hidden;
    border-radius: 6px;
    .box-card-pend {
      height: 300px;
      margin-bottom: 10px
    }
    .box-card-run {
      height: 405px;
    }
    .logArea {
      overflow: auto;
      height: 100%;
      padding: 10px 20px;
    }
    .item {
      cursor: pointer;
      .timeArea {
        margin: 2px;
      }
      .logContent {
        margin-bottom: 5px;
        text-align: right;
      }
      .title {
        font-size: 13px;
      }
      .time {
        color: #000;
      }
    }
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  .more {
    color: #87de75;
    cursor: pointer;
    float: right;
  }
}
</style>
