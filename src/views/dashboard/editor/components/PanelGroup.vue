<template>
  <el-row :gutter="10" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
      <el-card shadow="hover" class="cardMGB box-card">
        <div class="card-panel">
          <div class="bar-ratio system-time">
            <div class="title">Hello {{ name }} !</div>
            <div class="content">
              <div class="item">系统时间</div>
              <!-- <div
                class="item time"
                style="text-align: right; padding-right: 30px;"
              > -->
              <el-tooltip class="item time" effect="dark" placement="bottom">
                <div slot="content">{{ time }}</div>
                <el-button type="text">{{ time }}</el-button>
              </el-tooltip>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
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
                </div>-->
              </div>
            </div>
            <div class="data-bar" style="display: flex;">
              <el-tooltip
                class="item"
                effect="light"
                :content="`RUN: ${progress.run}`"
                placement="top"
              >
                <div
                  v-show="taskNum.run !== 0"
                  class="bar"
                  style="background: rgb(0, 127, 223); border-left: none;"
                  :style="{width:progress.run}"
                />
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="light"
                :content="`PEND: ${progress.pend}`"
                placement="top"
              >
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
              </el-tooltip>-->
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

    <el-col :xs="24" :sm="24" :lg="12">
      <el-card class="box-card">
        <div class="card-panel">
          <div class="bar-ratio">
            <div class="chart">
              <line-chart
                :id="chartID"
                :lists.sync="tasks"
                :title="tasksTitle"
                :legend="legend"
                :x-axis="xAxis"
                :y-axis="yAxis"
              />
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import CountTo from 'vue-count-to'
import lineChart from '@/components/Chart/lineChart'
import { formatDate } from '@/utils/format'
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
      time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
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
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
    this.start()
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    async getList() {
      const _this = this
      _this.taskNum.totalOld = _this.taskNum.total
      const paramsTaskRun = { query: `lsf_user_rjobs{user_name='${_this.name}'}[5m]` }
      const paramsTaskPend = { query: `lsf_user_pjobs{user_name='${_this.name}'}[5m]` }
      const paramsTaskRunNum = { query: `lsf_user_rjobs{user_name='${_this.name}'}` }
      const paramsTaskPendNum = { query: `lsf_user_pjobs{user_name='${_this.name}'}` }
      const paramsTaskTotal = { query: `lsf_user_jobs_total{user_name='${_this.name}'}` }

      const TaskRunNum = await _this.getPrometheus(paramsTaskRunNum)
      const TaskPendNum = await _this.getPrometheus(paramsTaskPendNum)
      const TaskTotal = await _this.getPrometheus(paramsTaskTotal)

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
      &.system-time {
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDkwcHgiIGhlaWdodD0iNTAwcHgiIHZpZXdCb3g9IjAgMCA0OTAgNTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0OC4yICg0NzMyNykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+R3JvdXAgMTQgQ29weTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNTQuNzczNzY1OCUiIHkxPSIwJSIgeDI9IjU0Ljc3Mzc2NTglIiB5Mj0iNzAuMTM5MjY2MyUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzQyOUVGRiIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNzVCOEZGIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iODQuMTI5MjMxOCUiIHkxPSIwJSIgeDI9Ijc2LjgzNjc1MTMlIiB5Mj0iNTguMDYzODgzNyUiIGlkPSJsaW5lYXJHcmFkaWVudC0yIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0RGRjFGRiIgc3RvcC1vcGFjaXR5PSIwLjIiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRkZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNTAlIiB5MT0iMCUiIHgyPSI1MCUiIHkyPSIxMDAlIiBpZD0ibGluZWFyR3JhZGllbnQtMyI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGRkZGRkYiIHN0b3Atb3BhY2l0eT0iMC4yIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGRkZGRkYiIHN0b3Atb3BhY2l0eT0iMCIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLnp4HmnInkupEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJ2bV9iZyI+CiAgICAgICAgICAgIDxyZWN0IGlkPSJNYXNrLUNvcHkiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMSkiIHg9IjAiIHk9IjAiIHdpZHRoPSI0OTAiIGhlaWdodD0iNTAwIiByeD0iNCI+PC9yZWN0PgogICAgICAgICAgICA8cGF0aCBkPSJNMCwxNTEuNTQzNzIzIEMzNi4wMDI5ODM5LDE2NS41Nzk2NzggODMuOTEwMzczMywxNzYuMzgxNTEgMTQzLjcyMjE2OCwxODMuOTQ5MjE5IEMyMzMuNDM5ODYsMTk1LjMwMDc4MSAzMzguNzU3MTYxLDEzNS41MDc4NTQgMzk1LjgwMDIxMiwxMjYuMTQwNjI1IEM0MzMuODI4OTEyLDExOS44OTU4MDUgNDY1LjIyODg0MSwxMTguNTQ0MjU3IDQ5MCwxMjIuMDg1OTc5IEw0OTAsNTAwIEwwLDUwMCBMMCwxNTEuNTQzNzIzIFoiIGlkPSJQYXRoLTQtQ29weSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0yKSI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNMCwxMjEuNTQzNzIzIEMyOS43NzQxNDE0LDEwMi4zOTM3NDcgNjguNzgyMDIzMiw5Ni4wMTA0MjE4IDExNy4wMjM2NDUsMTAyLjM5Mzc0NyBDMTg5LjM4NjA3OSwxMTEuOTY4NzM1IDI3OC4wMDI1NDYsMTU5LjM3NjA2NyAzNjQuODA0MDksMTU2Ljk3MTYxOSBDNDIyLjY3MTc4NiwxNTUuMzY4NjU0IDQ2NC40MDM3NTYsMTQ3LjA3MzQ0MSA0OTAsMTMyLjA4NTk3OSBMNDkwLDQ5NiBDNDkwLDQ5OC4yMDkxMzkgNDg4LjIwOTEzOSw1MDAgNDg2LDUwMCBMNCw1MDAgQzEuNzkwODYxLDUwMCAyLjcwNTQxNWUtMTYsNDk4LjIwOTEzOSAwLDQ5NiBMMCwxMjEuNTQzNzIzIFoiIGlkPSJQYXRoLTQtQ29weS0yIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTMpIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLDE0OS41NzA3MDMgQzM4Ljc4NzA3NzksMTMxLjc2MTkxOCA4Mi4zMDE0Mjc5LDEyNi4xMDcyNSAxMzAuNTQzMDUsMTMyLjYwNjcgQzIwMi45MDU0ODMsMTQyLjM1NTg3NCAyNzguMDAyNTQ2LDE3MC43ODIwMjYgMzY0LjgwNDA5LDE2OC4zMzM4MzcgQzQyMi42NzE3ODYsMTY2LjcwMTcxMSA0NjQuNDAzNzU2LDE1Ny4yMzc0IDQ5MCwxMzkuOTQwOTA2IEw0OTAsNDk2IEM0OTAsNDk4LjIwOTEzOSA0ODguMjA5MTM5LDUwMCA0ODYsNTAwIEw0LDUwMCBDMS43OTA4NjEsNTAwIDMuMTY2NDI5NDllLTE0LDQ5OC4yMDkxMzkgMCw0OTYgTDAsMTQ5LjU3MDcwMyBaIiBpZD0iUGF0aC00IiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
        background-size: cover;
        .title {
          padding: 30px 0 0 30px;
          font-size: 40px;
          color: #fff;
          letter-spacing: 0;
          margin-bottom: 104px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .title {
        font-size: 20px;
        color: #1a2736;
        margin-left: 30px;
        padding: 20px 20px 10px 0;
        .title-top {
          font-size: 16px
        }
      }
      .content {
        width: 100%;
        display: -ms-flexbox;
        display: flex;
      }
      .item {
        -ms-flex: 1;
        flex: 1;
        font-size: 16px;
        color: #5e6978;
        letter-spacing: 0;
        padding-left: 30px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .time {
        padding: 0 10px 0 0;
        -ms-flex: 2;
        flex: 2;
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
@media (max-width: 1680px) {
  .title {
    font-size: 28px;
  }
  .item.time {
    -ms-flex: 2;
    flex: 2;
  }
}
</style>
