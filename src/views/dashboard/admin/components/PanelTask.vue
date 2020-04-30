<template>
  <el-row v-loading="loading" :gutter="10" class="panel-group">
    <el-col :xs="24" :sm="24" :lg="12">
      <el-card shadow="hover" class="cardMGB">
        <div class="card-panel">
          <div class="bar-ratio">
            <div class="title">
              <span>作业运行时间</span>
              <span class="more">TOP20</span>
              <i class="el-icon-caret-top more i-font" />
            </div>
            <div class="logArea el-scrollbar">
              <div
                v-for="(item,index) in taskRunTOPList"
                :key="index"
                class="task-info"
                @click="handleSetLineChartData('RUN')"
              >
                <div>
                  <span class="task-index-font">No.{{ index+1 }}</span>
                  <span>
                    ID:
                    <span class="task-font">{{ item.JOBID }}</span>
                  </span>
                  <span>
                    用户:
                    <span class="task-font">{{ item.USER }}</span>
                  </span>
                  <span class="time task-font">{{ item.time }}</span>
                  <span>
                    <el-progress :percentage="item.progress" :show-text="false" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="12">
      <el-card shadow="hover" class="cardMGB">
        <div class="card-panel">
          <div class="bar-ratio">
            <div class="title">
              <span>作业等待时间</span>
              <span class="more">TOP20</span>
              <i class="el-icon-caret-top more i-font" />
            </div>
            <div class="logArea el-scrollbar">
              <div
                v-for="(item,index) in taskPendTOPList"
                :key="index"
                class="task-info"
                @click="handleSetLineChartData('PEND')"
              >
                <div>
                  <span class="task-index-font">No.{{ index+1 }}</span>
                  <span>
                    ID:
                    <span class="task-font">{{ item.JOBID }}</span>
                  </span>
                  <span>
                    用户:
                    <span class="task-font">{{ item.USER }}</span>
                  </span>
                  <span class="time task-font">{{ item.time }}</span>
                  <span>
                    <el-progress :percentage="item.progress" :show-text="false" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { GetTaskTOPList } from '@/api/task'

import { formatDiff } from '@/utils/format'

export default {
  data() {
    return {
      // 计时器
      setTime: null,
      // 作业
      taskRunTOPList: [],
      taskPendTOPList: [],
      loading: false
    }
  },
  created() {
    this.loading = true
    this.getList().then(() => {
      this.loading = false
    })
    this.start()
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    async getList() {
      const _this = this
      _this.taskRunTOPList = await _this.getTask('run')
      _this.taskPendTOPList = await _this.getTask('pend')
    },
    getTask(status) {
      const _this = this
      const params = {
        status: status
      }
      const decimals = 20
      return new Promise((resolve, reject) => {
        GetTaskTOPList(params, decimals)
          .then(res => {
            let Arr = []
            let langTime = 0
            const data = JSON.parse(res.stdout)
            Arr = data.map(function(item, index) {
              if (status === 'pend') {
                if (index === 0) {
                  langTime = item.PEND_TIME
                }
                item.progress = _this._.floor((item.PEND_TIME / langTime) * 100)
                item.time = formatDiff(null, null, item.PEND_TIME)
              } else if (status === 'run') {
                if (index === 0) {
                  langTime = item.RUN_TIME
                }
                item.progress = _this._.floor((item.RUN_TIME / langTime) * 100)
                item.time = formatDiff(null, null, item.RUN_TIME)
              }
              return item
            })
            resolve(Arr)
          }).catch(res => {
            reject(res)
          })
      })
    },
    handleSetLineChartData(status) {
      this.$router.push({
        name: 'Job list',
        params: {
          Status: status
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
      }, 30000)
    },

    stop() {
      const _this = this
      clearInterval(_this.setTime)
      _this.setTime = null
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .cardMGB {
    margin-bottom: 10px;
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
          font-size: 16px;
        }

        .more {
          float: right;
        }
        .i-font {
          font-size: 26px;
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
    }
    .logArea {
      overflow: auto;
      height: 85%;
      padding: 0 20px 10px;
    }
    .task-head {
      text-align: center;
      color: #000;
      border-bottom: 1px solid #e2e2e2;
      padding-bottom: 4px;
    }
    .task-info {
      cursor: pointer;
      margin: 5px 9px;
      background-color: #fdfdfd;
      padding: 6px 0;
      font-size: 16px;
      .task-font {
        font-size: 19px;
        margin-right: 10px;
        color: #000;
      }
      .task-index-font {
        font-size: 19px;
        margin-right: 10px;
        color: #37a2da;
      }
      .time {
        color: #000;
        float: right;
      }
      .el-progress {
        margin-top: 4px;
      }
    }
  }
}
</style>
