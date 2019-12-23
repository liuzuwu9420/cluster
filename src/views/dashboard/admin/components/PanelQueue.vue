<template>
  <el-row class="panel-group">
    <el-col>
      <el-card shadow="hover">
        <div class="card-panel">
          <div class="bar-ratio">
            <div class="chart">
              <column-chart :lists.sync="queues" />
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import columnChart from '@/components/Chart/columnChart'

import { formatDate } from '@/utils/format'
import { GetPrometheus } from '@/api/prometheus'

export default {
  components: {
    columnChart
  },
  data() {
    return {
      // 计时器
      setTime: null,
      // 队列
      queues: []
    }
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
      const paramsQueueRun = { query: 'lsf_job_queue_count{status="run"}' }
      const paramsQueuePend = { query: 'lsf_job_queue_count{status="pend"}' }

      const QueueRun = await _this.getPrometheus(paramsQueueRun, 'RUN')
      const QueuePend = await _this.getPrometheus(paramsQueuePend, 'PEND')
      _this.queues = QueueRun.concat(QueuePend)
    },

    getPrometheus(params, status) {
      return new Promise((resolve) => {
        GetPrometheus(params)
          .then(res => {
            if (res.data.result.length !== 0) {
              const values = []
              res.data.result.map(item => {
                const obj = {}
                obj.name = item.metric.name
                const value = Object.assign({}, item.value)
                obj.time = formatDate(value[0] * 1000, 'yyyy-MM-dd hh:mm:ss')
                obj.value = +value[1]
                obj.status = status
                values.push(obj)
              })
              resolve(values)
            } else {
              resolve([])
            }
          })
          .catch(res => {
            console.log(res)
          })
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
      .chart {
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>
