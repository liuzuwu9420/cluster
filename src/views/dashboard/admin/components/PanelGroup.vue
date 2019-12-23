<template>
  <el-row :gutter="10" class="panel-group">
    <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
      <el-card shadow="hover" class="cardMGB">
        <div class="card-panel card-panel-center">
          <div class="bar-ratio">
            <div class="title">节点</div>
            <div class="data-line">
              <div class="total">
                <count-to :start-val="node.totalOld" :end-val="node.total" :duration="1000" />
              </div>
              <div class="data-list">
                <div class="item">
                  <div style="flex: 1 1 auto;">
                    <div
                      class="point"
                      style="background: rgb(69, 187, 121); border-color: rgb(69, 187, 121);"
                    />
                  </div>
                  <div class="state-name" style="padding-left: 0px;">开机</div>
                  <div class="state-num">{{ node.boot }}</div>
                </div>
                <div class="item">
                  <div style="flex: 1 1 auto;">
                    <div
                      class="point"
                      style="background: rgb(236, 89, 96); border-color: rgb(236, 89, 96);"
                    />
                  </div>
                  <div class="state-name" style="padding-left: 0px;">关机</div>
                  <div class="state-num">{{ node.shutdown }}</div>
                </div>
              </div>
            </div>
            <div class="data-bar" style="display: flex;">
              <div
                v-show="node.boot !== 0"
                class="bar"
                style="background: rgb(69, 187, 121); border-left: none;"
                :style="{width:progress.boot}"
              />
              <div
                v-show="node.shutdown !== 0"
                class="bar"
                style="background: rgb(236, 89, 96); border-left: 1px solid rgb(255, 255, 255);"
                :style="{width:progress.shutdown}"
              />
            </div>
            <div class="data-state">
              <div v-show="node.boot !== 0" class="state-body" style="flex: 100 1 0%;">
                <div class="state" style="color: rgb(69, 187, 121);">开机</div>
              </div>
              <div v-show="node.shutdown !== 0" class="state-body" style="flex: 0 1 0%;">
                <div class="state" style="color: rgb(236, 89, 96);">关机</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="cardMGB box-card">
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
    </el-col>

    <el-col :xs="16" :sm="16" :lg="12">
      <el-row>
        <el-col :xs="12" :sm="12" :lg="12" class="center-padding">
          <el-card shadow="hover" class="cardMGB">
            <div class="card-panel card-panel-center">
              <div class="bar-ratio">
                <div class="title">CPU</div>
                <el-row class="data-body">
                  <el-col :xs="12" :sm="12" :lg="12">
                    <div
                      class="circle-chart"
                      style="-webkit-tap-highlight-color: transparent; user-select: none;"
                    >
                      <el-progress type="circle" :width="100" :percentage="CPU.ratio" />
                    </div>
                  </el-col>
                  <el-col :xs="12" :sm="12" :lg="12">
                    <div class="item-middle item">
                      <div class="item-left">已用</div>
                      <div class="item-center">{{ CPU.used }} core</div>
                    </div>
                    <div class="item">
                      <div class="item-left">总量</div>
                      <div class="item-center">{{ CPU.all }} core</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12" class="sto-padding">
          <el-card shadow="hover" class="cardMGB">
            <div class="card-panel card-panel-center">
              <div class="bar-ratio">
                <div class="title">内存</div>
                <el-row class="data-body">
                  <el-col :xs="12" :sm="12" :lg="12">
                    <div
                      class="circle-chart"
                      style="-webkit-tap-highlight-color: transparent; user-select: none;"
                    >
                      <el-progress type="circle" :width="100" :percentage="RAM.ratio" />
                    </div>
                  </el-col>
                  <el-col :xs="12" :sm="12" :lg="12">
                    <div class="item-middle item">
                      <div class="item-left">已用</div>
                      <div class="item-center">{{ RAM.used }}</div>
                    </div>
                    <div class="item">
                      <div class="item-left">总量</div>
                      <div class="item-center">{{ RAM.all }}</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="hover" class="cardMGB">
        <div class="card-panel">
          <div class="bar-ratio">
            <div class="chart">
              <line-chart :lists.sync="tasks" :title="tasksTitle" :legend="legend" :y-axis="yAxis" />
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="6">
      <el-card shadow="hover" class="cardMGB">
        <div class="card-panel card-panel-center">
          <div class="bar-ratio">
            <div class="title">存储</div>
            <el-row class="data-body">
              <el-col :xs="12" :sm="12" :lg="12">
                <div
                  class="circle-chart"
                  style="-webkit-tap-highlight-color: transparent; user-select: none;"
                >
                  <el-progress type="circle" :width="100" :percentage="Storage.ratio" />
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :lg="12">
                <div class="item-middle item">
                  <div class="item-left">已用</div>
                  <div class="item-center">{{ Storage.used }}</div>
                </div>
                <div class="item">
                  <div class="item-left">总量</div>
                  <div class="item-center">{{ Storage.all }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
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
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import lineChart from '@/components/Chart/lineChart'

import {
  GetTaskNum,
  GetPendTaskTOPList,
  GetRunTaskTOPList
} from '@/api/task'
import { formatDate, formatDiff, formatBytes } from '@/utils/format'
import { GetPrometheus } from '@/api/prometheus'

export default {
  components: {
    CountTo,
    lineChart
  },
  data() {
    return {
      // 计时器
      setTime: null,
      // 节点
      node: {
        total: 0,
        totalOld: 0,
        boot: 0,
        shutdown: 0
      },
      // CPU
      CPU: {
        ratio: 0,
        used: 0,
        all: 0
      },
      // 内存
      RAM: {
        ratio: 0,
        used: 0,
        all: 0
      },
      // 存储
      Storage: {
        ratio: 0,
        used: 0,
        all: 0
      },
      // 屏幕宽度
      screenWidth: document.documentElement.clientWidth,
      // 进度条
      progress: {
        boot: '0',
        shutdown: '0'
      },
      // 作业
      tasks: [
        {
          time: '00:00:00',
          name: 'RUN',
          value: 0
        },
        {
          time: '00:00:00',
          name: 'PEND',
          value: 0
        }],
      tasksTitle: {
        visible: true,
        text: '作业'
      },
      yAxis: {
        visible: true,
        label: {
          // 数值格式化为千分位
          formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
        }
      },
      legend: {
        visible: true,
        position: 'top-right'
      },
      pendTOPList: [],
      runTOPList: []
    }
  },
  created() {
    this.getList()
    this.getPend()
    this.getRun()
    this.start()
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    async getList() {
      const _this = this
      _this.node.totalOld = _this.node.total
      const paramsNodeTotal = { query: 'cluster:node:sum' }
      const paramsNodeBoot = { query: 'cluster:node_up:sum' }
      const paramsRAMUsed = { query: 'cluster:memory_total_size_bytes:sum-cluster:memory_available_size_bytes:sum' }
      const paramsRAMAll = { query: 'cluster:memory_total_size_bytes:sum' }
      const paramsStorageUsed = { query: 'cluster:filesystem_total_size_bytes:sum-cluster:filesystem_available_size_bytes:sum' }
      const paramsStorageAll = { query: 'cluster:filesystem_total_size_bytes:sum' }
      const paramsTaskRun = { query: 'lsf_job_status_count{status="run"}[5m]' }
      const paramsTaskPend = { query: 'lsf_job_status_count{status="pend"}[5m]' }

      const NodeTotal = await _this.getPrometheus(paramsNodeTotal)
      const NodeBoot = await _this.getPrometheus(paramsNodeBoot)
      const RAMUsed = await _this.getPrometheus(paramsRAMUsed)
      const RAMAll = await _this.getPrometheus(paramsRAMAll)
      const RAMRatio = RAMUsed / RAMAll
      const StorageUsed = await _this.getPrometheus(paramsStorageUsed)
      const StorageAll = await _this.getPrometheus(paramsStorageAll)
      const StorageRatio = StorageUsed / StorageAll
      let TaskRun = await _this.getPrometheus(paramsTaskRun)
      let TaskPend = await _this.getPrometheus(paramsTaskPend)

      TaskRun = _this.handlePrometheus(TaskRun, 'RUN')
      TaskPend = _this.handlePrometheus(TaskPend, 'PEND')
      _this.tasks = TaskRun.concat(TaskPend)

      _this.node.total = +NodeTotal
      _this.node.boot = +NodeBoot
      _this.node.shutdown = _this.node.total - _this.node.boot
      _this.progress.boot = _this.toPercent(_this.node.boot / _this.node.total)
      _this.progress.shutdown = _this.toPercent(_this.node.shutdown / _this.node.total)

      _this.RAM.used = formatBytes(+RAMUsed, 2)
      _this.RAM.all = formatBytes(+RAMAll, 2)
      _this.RAM.ratio = _this._.ceil(RAMRatio * 100, 2)
      _this.Storage.used = formatBytes(+StorageUsed, 2)
      _this.Storage.all = formatBytes(+StorageAll, 2)
      _this.Storage.ratio = _this._.ceil(StorageRatio * 100, 2)

      GetTaskNum()
        .then(res => {
          _this.CPU.all = res.Inventory.LsfClusterCPUStatus.total
          _this.CPU.used = res.Inventory.LsfClusterCPUStatus.used
          _this.CPU.ratio = _this._.ceil(_this.CPU.used / _this.CPU.all * 100, 2)
        })
        .catch(res => {
          console.log(res)
        })
    },

    getPrometheus(params) {
      return new Promise((resolve) => {
        GetPrometheus(params)
          .then(res => {
            if (res.data.result.length !== 0) {
              if (res.data.result[0].value) {
                const value = res.data.result[0].value[1]
                resolve(value)
              } else if (res.data.result[0].values) {
                const values = res.data.result[0].values
                resolve(values)
              }
            } else {
              resolve(0)
            }
          })
          .catch(res => {
            console.log(res)
          })
      })
    },
    // 处理Prometheus传输的数据
    handlePrometheus(list, name) {
      if (list) {
        list = list.map(item => {
          item = Object.assign({}, item)
          item.time = formatDate(item[0] * 1000, 'yyyy-MM-dd hh:mm:ss')
          item.value = +item[1]
          item.name = name
          item.unit = ''
          return item
        })
      } else {
        list = []
      }
      return list
    },
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
        _this.getList()
        _this.getPend()
        _this.getRun()
      }, 30000)
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
    // 小数转百分数
    toPercent(point) {
      let percent = Number(point * 100).toFixed()
      percent += '%'
      return percent
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .cardMGB {
    margin-bottom: 10px;
  }
  .center-padding {
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
    .bar-ratio {
      width: 100%;
      height: 100%;
      background: #fff;
      box-shadow: 0 1px 6px 0 #eef5ff;
      border-radius: 4px;
      .title {
        font-size: 20px;
        color: #1a2736;
        padding-top: 26px;
        margin-left: 30px;
      }
      .data-line,
      .data-state {
        width: 100%;
        display: flex;
        padding: 0 30px;
      }
      .data-line {
        height: 80px;
        margin-top: 20px;
        .total {
          font-size: 60px;
          color: #1a2736;
          position: relative;
          flex: 3 3 auto;
        }
        .data-list {
          padding-top: 14px;
          flex: 1 1 auto;
          .item {
            display: flex;
            margin-bottom: 10px;
            align-items: baseline;
          }
          .point {
            width: 10px;
            height: 10px;
            border-radius: 5px;
            border: 1px solid #36b16c;
          }
          .state-name {
            color: #5e6978;
            flex: 3 1 auto;
          }
          .state-num {
            color: #1a2736;
            flex: 2 1 auto;
            text-align: right;
          }
        }
      }
      .data-bar {
        width: calc(100% - 60px);
        height: 6px;
        border-radius: 4px;
        margin-top: 20px;
        margin-left: 30px;
        overflow: hidden;
        .bar {
          height: 6px;
          display: inline-block;
          border-left: 1px solid #fff;
        }
      }
      .data-state {
        height: 20px;
        margin-top: 10px;
        font-size: 12px;
        white-space: nowrap;
        .state-body {
          display: inline-block;
        }
        .state {
          padding-right: 5px;
          display: inline-block;
          overflow: hidden;
        }
      }
      .chart {
        height: 100%;
        width: 100%;
      }
      .data-body {
        margin-top: 30px;
        height: 100%;
        width: 100%;
        .circle-chart {
          width: 100%;
          padding: 0 20px;
        }
        .item {
          width: 100%;
          display: -ms-flexbox;
          display: flex;
          margin-top: 10px;
          color: #5e6978;
          letter-spacing: 0;
          line-height: 20px;
        }
        .item-middle {
          border-bottom: 1px solid #eef3f7;
          padding-bottom: 10px;
        }
        .item-left {
          -ms-flex: 1 1 auto;
          flex: 1 1 auto;
          width: 0;
          text-align: left;
        }
        .item-center {
          -ms-flex: 2 1 auto;
          flex: 2 1 auto;
          width: 0;
          text-align: right;
          padding-right: 10px;
        }
      }
    }
  }
  .card-panel-center {
    height: 214px;
  }
  .card-panel-foot {
    height: 405px;
  }
    .box-card {
      height: 300px;
      margin-bottom: 10px;
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
