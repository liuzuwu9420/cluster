<template>
  <el-row :gutter="10" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <el-row>
          <el-col :span="9">
            <div class="card-panel-icon-wrapper icon-cpu">
              <div class="card-panel-text">CPU</div>
              <i class="el-icon-cpu card-panel-icon" />
            </div>
          </el-col>
          <el-col :span="15">
            <el-row class="card-panel-description">
              <el-col :span="8">
                <div class="card-iframe">
                  <iframe :src="CPUUseSrc" width="100%" height="100%" frameborder="0" />
                </div>
              </el-col>
              <el-col :span="2">
                <div class="segmentationCPU">/</div>
              </el-col>
              <el-col :span="10">
                <div class="card-iframe">
                  <iframe :src="CPUAllSrc" width="100%" height="100%" frameborder="0" />
                </div>
              </el-col>
              <el-col :span="4">
                <div class="nuclear">核</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <el-row>
          <el-col :span="9">
            <div class="card-panel-icon-wrapper icon-coin">
              <div class="card-panel-text">内存</div>
              <i class="el-icon-coin card-panel-icon" />
            </div>
          </el-col>
          <el-col :span="15">
            <el-row class="card-panel-description">
              <el-col :span="11">
                <div class="card-iframe">
                  <iframe :src="RAMUseSrc" width="100%" height="100%" frameborder="0" />
                </div>
              </el-col>
              <el-col :span="2">
                <div class="segmentationRAM">/</div>
              </el-col>
              <el-col :span="11">
                <div class="card-iframe">
                  <iframe :src="RAMAllSrc" width="100%" height="100%" frameborder="0" />
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('RUN')">
        <div class="card-panel-icon-wrapper icon-loading">
          <div class="card-panel-text">运行作业</div>
          <i class="el-icon-refresh card-panel-icon card-task-icon" />
        </div>
        <div class="card-panel-task-description">
          <count-to
            :start-val="runTaskOld"
            :end-val="runTask"
            :duration="1000"
            class="card-panel-runnum"
          />
          <span class="segmentationRun">/</span>
          <count-to :start-val="TotalOld" :end-val="Total" :duration="1200" class="card-panel-all" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('PEND')">
        <div class="card-panel-icon-wrapper icon-time">
          <div class="card-panel-text">等待作业</div>
          <i class="el-icon-time card-panel-icon card-task-icon" />
        </div>
        <div class="card-panel-task-description">
          <count-to
            :start-val="pendTaskOld"
            :end-val="pendTask"
            :duration="1200"
            class="card-panel-waitnum"
          />
          <span class="segmentationPend">/</span>
          <count-to :start-val="TotalOld" :end-val="Total" :duration="1400" class="card-panel-all" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { GetTaskNum } from '@/api/monitor'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      // 计时器
      setTime: null,
      // 引入grafana
      CPUAllSrc: '',
      CPUUseSrc: '',
      RAMAllSrc: '',
      RAMUseSrc: '',
      // 作业
      runTask: 0,
      pendTask: 0,
      Total: 0,
      runTaskOld: 0,
      pendTaskOld: 0,
      TotalOld: 0
    }
  },
  created() {
    this.iframeTime()
    this.getList()
    this.start()
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    getList() {
      const _this = this
      _this.runTaskOld = _this.runTask
      _this.pendTaskOld = _this.pendTask
      _this.TotalOld = _this.Total
      GetTaskNum()
        .then(body => {
          _this.runTask = body.Inventory.Run
          _this.pendTask = body.Inventory.Pend
          _this.Total = body.Inventory.Total
        })
        .catch(res => {
          console.log(res)
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
      }, 1000)
    },

    stop() {
      const _this = this
      clearInterval(_this.setTime)
      _this.setTime = null
    },

    handleSetLineChartData(Status) {
      this.$router.push({
        name: 'monitor.taskList',
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
      const CPUAllId = '&panelId=12'
      const CPUUseId = '&panelId=14'
      const RAMAllId = '&panelId=16'
      const RAMUseId = '&panelId=18'
      _this.CPUAllSrc = httpUrl + timeInterval + CPUAllId
      _this.CPUUseSrc = httpUrl + timeInterval + CPUUseId
      _this.RAMAllSrc = httpUrl + timeInterval + RAMAllId
      _this.RAMUseSrc = httpUrl + timeInterval + RAMUseId
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 16px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-cpu {
        background: #40c9c6;
      }

      .icon-coin {
        background: #36a3f7;
      }

      .icon-loading {
        background: #f4516c;
      }

      .icon-time {
        background: #34bfa3;
      }
    }

    .icon-cpu {
      color: #40c9c6;
    }

    .icon-coin {
      color: #36a3f7;
    }

    .icon-loading {
      color: #f4516c;
    }

    .icon-time {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin-top: 10px;
      margin-left: 14px;
      padding: 10px;
      transition: all 0.38s ease-out;
      border-radius: 6px;

      .card-panel-text {
        text-align: center;
        line-height: 18px;
        font-size: 18px;
      }
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
      margin-top: 4px;
    }

    .card-task-icon {
      margin-left: 10px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin-left: 0px;

      .segmentationCPU {
        font-size: 35px;
        color: #40c9c6;
        margin-top: 55px;
      }

      .segmentationRAM {
        font-size: 40px;
        color: #36a3f7;
        margin-top: 50px;
      }

      .nuclear {
        margin-top: 68px;
        font-size: 16px;
        color: #40c9c6;
      }
    }

    .card-panel-task-description {
      width: 53.46%;
      text-align: center;
      margin-top: 50px;
      float: right;
      font-weight: bold;

      .card-panel-runnum {
        font-size: 30px;
        color: #f4516c;
      }

      .card-panel-waitnum {
        font-size: 30px;
        color: #34bfa3;
      }

      .segmentationRun {
        font-size: 35px;
        color: #f4516c;
      }

      .segmentationPend {
        font-size: 35px;
        color: #34bfa3;
      }

      .card-panel-all {
        font-size: 30px;
        color: #4994e9;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
