<template>
  <el-row v-loading="loading" :gutter="10" class="panel-group">
    <el-col :xs="24" :sm="24" :lg="7" class="card-panel-col">
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
              <el-tooltip class="item" effect="light" :content="`${progress.boot}`" placement="top">
                <div
                  v-show="node.boot !== 0"
                  class="bar"
                  style="background: rgb(69, 187, 121); border-left: none;"
                  :style="{width:progress.boot}"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="light" :content="`${progress.shutdown}`" placement="top">
                <div
                  v-show="node.shutdown !== 0"
                  class="bar"
                  style="background: rgb(236, 89, 96); border-left: 1px solid rgb(255, 255, 255);"
                  :style="{width:progress.shutdown}"
                />
              </el-tooltip>
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
        <div class="card-panel">
          <div class="bar-ratio">
            <div class="title">作业</div>
            <div class="data-line data-line-height">
              <div class="total task-total">
                <count-to :start-val="taskNum.totalOld" :end-val="taskNum.total" :duration="1000" />
              </div>
              <div class="data-list data-content">
                <div class="item">
                  <div style="flex: 1 1 auto;">
                    <div
                      class="point"
                      style="background: rgb(0, 127, 223); border-color: rgb(0, 127, 223);"
                    />
                  </div>
                  <div class="state-name" style="padding-left: 0px;">RUN</div>
                  <div class="state-num">{{ taskNum.run }}</div>
                </div>
                <div class="item">
                  <div style="flex: 1 1 auto;">
                    <div
                      class="point"
                      style="background: rgb(255, 180, 18); border-color: rgb(255, 180, 18);"
                    />
                  </div>
                  <div class="state-name" style="padding-left: 0px;">PEND</div>
                  <div class="state-num">{{ taskNum.pend }}</div>
                </div>
                <!-- <div class="item">
                  <div style="flex: 1 1 auto;">
                    <div
                      class="point"
                      style="background: rgb(236, 89, 96); border-color: rgb(236, 89, 96);"
                    />
                  </div>
                  <div class="state-name" style="padding-left: 0px;">FINISH</div>
                  <div class="state-num">{{ taskNum.finish }}</div>
                </div> -->
              </div>
            </div>
            <div class="data-bar" style="display: flex;">
              <el-tooltip class="item" effect="light" :content="`RUN: ${progress.run}`" placement="top">
                <div
                  v-show="taskNum.run !== 0"
                  class="bar"
                  style="background: rgb(0, 127, 223); border-left: none;"
                  :style="{width:progress.run}"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="light" :content="`PEND: ${progress.pend}`" placement="top">
                <div
                  v-show="taskNum.pend !== 0"
                  class="bar"
                  style="background: rgb(255, 180, 18); border-left: 1px solid rgb(255, 255, 255);"
                  :style="{width:progress.pend}"
                />
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="light" :content="`FINISH: ${progress.finish}`" placement="top">
                <div
                  v-show="taskNum.finish !== 0"
                  class="bar"
                  style="background: rgb(236, 89, 96); border-left: 1px solid rgb(255, 255, 255);"
                  :style="{width:progress.finish}"
                />
              </el-tooltip> -->
            </div>
            <div class="data-state">
              <div v-show="taskNum.run !== 0" class="state-body" :style="{flex: progress.flexRun}">
                <div class="state" style="color: rgb(0, 127, 223);">RUN</div>
              </div>
              <div
                v-show="taskNum.pend !== 0"
                class="state-body"
                :style="{flex: progress.flexPend}"
              >
                <div class="state" style="color: rgb(255, 180, 18);">PEND</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="24" :sm="24" :lg="17">
      <el-row>
        <el-col :xs="8" :sm="8" :lg="8" class="sta-padding">
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
                      <div class="item-center">{{ CPU.used }} CORE</div>
                    </div>
                    <div class="item">
                      <div class="item-left">总量</div>
                      <div class="item-center">{{ CPU.all }} CORE</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="8" :sm="8" :lg="8" class="sta-padding sto-padding">
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
        </el-col>
        <el-col :xs="8" :sm="8" :lg="8" class="sto-padding">
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
      <el-card class="box-card">
        <div class="card-panel">
          <div class="bar-ratio">
            <div class="chart">
              <line-chart :id="chartID" :lists.sync="tasks" :title="tasksTitle" :legend="legend" :x-axis="xAxis" :y-axis="yAxis" />
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import lineChart from '@/components/Chart/lineChart'

import { formatDate, formatBytes } from '@/utils/format'
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
      // 进度条
      progress: {
        boot: '0%',
        shutdown: '0%',
        pend: '0%',
        run: '0%',
        finish: '0%',
        flexRun: '100 1 0%',
        flexPend: '0 1 0%',
        flexFinish: '0 1 0%'
      },
      // 作业
      taskNum: {
        total: 0,
        totalOld: 0,
        finish: 0,
        pend: 0,
        run: 0
      },
      tasks: [
        {
          time: '00:00',
          date: '0000-00-00 00:00:00',
          name: 'RUN',
          value: 0
        },
        {
          time: '00:00',
          date: '0000-00-00 00:00:00',
          name: 'PEND',
          value: 0
        }],
      chartID: 'lineChart',
      tasksTitle: {
        visible: true,
        text: '作业状态'
      },
      xAxis: {
        visible: true,
        type: 'dateTime',
        tickCount: 6,
        tickLine: false,
        label: {
          formatter: (val) => formatDate(val, 'hh:mm')
        }
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
      loading: false
    }
  },
  created() {
    this.loading = true
    this.getList().then(() => { this.loading = false })
    this.start()
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    async getList() {
      const _this = this
      _this.node.totalOld = _this.node.total
      _this.taskNum.totalOld = _this.taskNum.total
      const paramsNodeTotal = { query: 'cluster:node:sum' }
      const paramsNodeBoot = { query: 'cluster:node_up:sum' }
      const paramsCPUAll = { query: 'sum(lsf_host_max)' }
      const paramsCPUUsed = { query: 'sum(lsf_host_njobs)' }
      const paramsRAMUsed = { query: 'cluster:memory_total_size_bytes:sum-cluster:memory_available_size_bytes:sum' }
      const paramsRAMAll = { query: 'cluster:memory_total_size_bytes:sum' }
      const paramsStorageUsed = { query: 'cluster:filesystem_total_size_bytes:sum-cluster:filesystem_available_size_bytes:sum' }
      const paramsStorageAll = { query: 'cluster:filesystem_total_size_bytes:sum' }
      const paramsTaskRun = { query: 'lsf_job_rjobs[5m]' }
      const paramsTaskPend = { query: 'lsf_job_pjobs[5m]' }
      const paramsTaskRunNum = { query: 'lsf_job_rjobs' }
      const paramsTaskPendNum = { query: 'lsf_job_pjobs' }
      const paramsTaskTotal = { query: 'lsf_jobs_total' }

      const NodeTotal = await _this.getPrometheus(paramsNodeTotal)
      const NodeBoot = await _this.getPrometheus(paramsNodeBoot)
      const CPUUsed = await _this.getPrometheus(paramsCPUUsed)
      const CPUAll = await _this.getPrometheus(paramsCPUAll)
      let CPURatio = 0
      if (CPUAll === 0) {
        CPURatio = 0
      } else {
        CPURatio = CPUUsed / CPUAll
      }
      const RAMUsed = await _this.getPrometheus(paramsRAMUsed)
      const RAMAll = await _this.getPrometheus(paramsRAMAll)
      let RAMRatio = 0
      if (RAMAll === 0) {
        RAMRatio = 0
      } else {
        RAMRatio = RAMUsed / RAMAll
      }
      const StorageUsed = await _this.getPrometheus(paramsStorageUsed)
      const StorageAll = await _this.getPrometheus(paramsStorageAll)
      let StorageRatio = 0
      if (StorageAll === 0) {
        StorageRatio = 0
      } else {
        StorageRatio = StorageUsed / StorageAll
      }

      const TaskRunNum = await _this.getPrometheus(paramsTaskRunNum)
      const TaskPendNum = await _this.getPrometheus(paramsTaskPendNum)
      const TaskTotal = await _this.getPrometheus(paramsTaskTotal)

      _this.node.total = +NodeTotal
      _this.node.boot = +NodeBoot
      _this.node.shutdown = _this.node.total - _this.node.boot
      _this.progress.boot = _this.toPercent(_this.node.boot / _this.node.total)
      _this.progress.shutdown = _this.toPercent(_this.node.shutdown / _this.node.total)

      _this.CPU.used = CPUUsed
      _this.CPU.all = CPUAll
      _this.CPU.ratio = _this._.ceil(CPURatio * 100, 2)
      _this.RAM.used = formatBytes(+RAMUsed, 2)
      _this.RAM.all = formatBytes(+RAMAll, 2)
      _this.RAM.ratio = _this._.ceil(RAMRatio * 100, 2)
      _this.Storage.used = formatBytes(+StorageUsed, 2)
      _this.Storage.all = formatBytes(+StorageAll, 2)
      _this.Storage.ratio = _this._.ceil(StorageRatio * 100, 2)

      _this.taskNum.pend = +TaskPendNum
      _this.taskNum.run = +TaskRunNum
      _this.taskNum.total = +TaskTotal
      const flexRun = _this.taskNum.run + _this.taskNum.pend ? _this.taskNum.run / (_this.taskNum.run + _this.taskNum.pend) : 0
      const flexPend = _this.taskNum.run + _this.taskNum.pend ? _this.taskNum.pend / (_this.taskNum.run + _this.taskNum.pend) : 0
      _this.progress.run = _this.toPercent(flexRun)
      _this.progress.pend = _this.toPercent(flexPend)
      /* _this.progress.flexRun = `${flexRun * 100} 1 0%`
      _this.progress.flexPend = `${flexPend * 100} 1 0%` */

      let TaskRun = await _this.getPrometheus(paramsTaskRun)
      let TaskPend = await _this.getPrometheus(paramsTaskPend)
      TaskRun = _this.handlePrometheus(TaskRun, 'RUN')
      TaskPend = _this.handlePrometheus(TaskPend, 'PEND')
      _this.tasks = TaskRun.concat(TaskPend)
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
    /**
      * 处理Prometheus传输的数据
      * @param {Array} list
      * @param {String} name
      * @returns {Array}
      */
    handlePrometheus(list, name) {
      const _this = this
      if (list) {
        list = list.map(item => {
          item = Object.assign({}, item)
          item.time = item[0]
          item.date = formatDate(item[0] * 1000, 'yyyy-MM-dd hh:mm:ss')
          item.value = _this._.ceil(item[1], 0)
          item.unit = ''
          item.name = name
          return item
        })
      } else {
        list = []
      }
      return list
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
      }, 30000)
    },

    stop() {
      const _this = this
      clearInterval(_this.setTime)
      _this.setTime = null
    },

    // 小数转百分数
    toPercent(point) {
      let percent = Number(point * 100).toFixed(2)
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
  .sta-padding {
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
        margin-left: 30px;
        padding: 20px 20px 10px 0;
        .title-top {
          font-size: 16px
        }
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
          flex: 5 3 auto;
        }
        .task-total {
          font-size: 40px;
          padding-top: 25px;
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
        .data-content {
          padding-top: 24px;
        }
      }
      .data-line-height {
        height: 120px;
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
    height: 85%;
    padding: 10px 20px;
  }
  .task-head {
    text-align: center;
    color: #000;
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 4px;
  }
  .task-info {
    cursor: pointer;
    margin: 9px;
    background-color: #fdfdfd;
    padding: 6px 0;
    font-size: 16px;
    .task-font {
      font-size: 18px;
    }
    .time {
      color: #000;
      text-align: right;
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
}
</style>
