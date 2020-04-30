<template>
  <div class="metirc-data">
    <div v-loading="!CPULists[0]" class="metirc-data-item" style="flex: 7 7 auto; margin-left: 0px;">
      <div class="line-chart-header" style="margin-left: 30px; width: calc(100% - 30px);">
        <div class="title">CPU负载率</div>
        <div class="current-value">
          <count-to :start-val="CPU.ratioOld" :end-val="CPU.ratio" :decimals="2" :duration="1000" />
          <span>%</span>
        </div>
      </div>
      <div
        v-if="CPULists[0]"
        class="metric-chart"
        style="-webkit-tap-highlight-color: transparent; user-select: none; position: relative;"
      >
        <line-chart id="CPUChart" :lists.sync="CPULists" :color="color" />
      </div>
    </div>
    <div v-loading="!RAMLists[0]" class="metirc-data-item" style="flex: 7 7 auto; margin-left: 0px;">
      <div class="line-chart-header" style="margin-left: 30px; width: calc(100% - 30px);">
        <div class="title">内存负载率</div>
        <div class="current-value">
          <count-to :start-val="RAM.ratioOld" :end-val="RAM.ratio" :decimals="2" :duration="1000" />
          <span>%</span>
        </div>
      </div>
      <div
        v-if="RAMLists[0]"
        class="metric-chart"
        style="-webkit-tap-highlight-color: transparent; user-select: none; position: relative;"
      >
        <line-chart id="RAMChart" :lists.sync="RAMLists" :color="color" />
      </div>
    </div>
    <div v-loading="!NetLists[0]" class="metirc-data-item">
      <div class="line-chart-header" style="margin-left: 50px; width: calc(100% - 50px);">
        <div class="title">网络吞吐量</div>
        <div class="double-value">
          <div class="item">
            <div class="value">{{ Net.down }}</div>
            <div class="description">
              <span class="line" style="background: rgb(0, 127, 223);" />
              <span class="text">下载</span>
            </div>
          </div>
          <div class="item">
            <div class="value">{{ Net.up }}</div>
            <div class="description">
              <span class="line" style="background: rgb(82, 196, 255);" />
              <span class="text">上传</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="NetLists[0]"
        class="metric-chart"
        style="-webkit-tap-highlight-color: transparent; user-select: none; position: relative;"
      >
        <line-chart id="NetChart" :lists.sync="NetLists" :color="lineColor" />
      </div>
    </div>
    <div v-loading="!DiskLists[0]" class="metirc-data-item">
      <div class="line-chart-header" style="margin-left: 50px; width: calc(100% - 50px);">
        <div class="title">磁盘IO</div>
        <div class="double-value">
          <div class="item">
            <div class="value">{{ Disk.read }}</div>
            <div class="description">
              <span class="line" style="background: rgb(0, 127, 223);" />
              <span class="text">读取</span>
            </div>
          </div>
          <div class="item">
            <div class="value">{{ Disk.write }}</div>
            <div class="description">
              <span class="line" style="background: rgb(82, 196, 255);" />
              <span class="text">写入</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="DiskLists[0]"
        class="metric-chart"
        style="-webkit-tap-highlight-color: transparent; user-select: none; position: relative;"
      >
        <line-chart id="DiskChart" :lists.sync="DiskLists" :color="lineColor" />
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import lineChart from '@/components/Chart/lineChart'

import { GetPrometheus } from '@/api/prometheus'
import { formatBytes, formatDate } from '@/utils/format'

export default {
  components: {
    CountTo,
    lineChart
  },
  data() {
    return {
      // 计时器
      setTime: null,
      // 监控数值
      CPU: {
        ratio: 0,
        ratioOld: 0
      },
      CPULists: [],
      RAM: {
        ratio: 0,
        ratioOld: 0
      },
      RAMLists: [],
      color: ['#007fdf'],
      Net: {
        up: '0B/s',
        down: '0B/s'
      },
      NetLists: [],
      Disk: {
        read: '0B/s',
        write: '0B/s'
      },
      DiskLists: [],
      lineColor: ['#007fdf', '#52c4ff']
    }
  },
  mounted() {
    this.getList()
    this.start()
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    async getList() {
      const _this = this
      _this.CPU.ratioOld = _this.CPU.ratio
      _this.RAM.ratioOld = _this.RAM.ratio

      const paramsCPURatio = { query: 'cluster:cpu_load5:ratio' }
      const paramsCPULists = { query: 'cluster:cpu_load5:ratio[5m]' }
      const paramsRAMRatio = { query: 'cluster:memory_available:ratio' }
      const paramsRAMLists = { query: 'cluster:memory_available:ratio[5m]' }
      const paramsNetUp = { query: 'cluster:network_transmit_iops' }
      const paramsNetDown = { query: 'cluster:network_receive_iops' }
      const paramsNetUpLists = { query: 'cluster:network_transmit_iops[5m]' }
      const paramsNetDownLists = { query: 'cluster:network_receive_iops[5m]' }
      const paramsDiskRead = { query: 'cluster:disk_reads_iops' }
      const paramsDiskWrite = { query: 'cluster:disk_writes_iops' }
      const paramsDiskReadLists = { query: 'cluster:disk_reads_iops[5m]' }
      const paramsDiskWriteLists = { query: 'cluster:disk_writes_iops[5m]' }

      const CPURatio = await _this.getPrometheus(paramsCPURatio)
      const CPUList = await _this.getPrometheus(paramsCPULists)
      const RAMRatio = await _this.getPrometheus(paramsRAMRatio)
      const RAMList = await _this.getPrometheus(paramsRAMLists, true)
      const NetUp = await _this.getPrometheus(paramsNetUp)
      const NetDown = await _this.getPrometheus(paramsNetDown)
      let NetUpList = await _this.getPrometheus(paramsNetUpLists)
      let NetDownList = await _this.getPrometheus(paramsNetDownLists)
      const DiskRead = await _this.getPrometheus(paramsDiskRead)
      const DiskWrite = await _this.getPrometheus(paramsDiskWrite)
      let DiskReadList = await _this.getPrometheus(paramsDiskReadLists)
      let DiskWriteList = await _this.getPrometheus(paramsDiskWriteLists)

      _this.CPU.ratio = CPURatio * 100
      _this.RAM.ratio = (1 - RAMRatio) * 100
      _this.Net.up = formatBytes(+NetUp, 2) + '/s'
      _this.Net.down = formatBytes(+NetDown, 2) + '/s'
      _this.Disk.read = formatBytes(+DiskRead, 2) + '/s'
      _this.Disk.write = formatBytes(+DiskWrite, 2) + '/s'

      NetUpList = _this.handlePrometheus(NetUpList, '上传', true)
      NetDownList = _this.handlePrometheus(NetDownList, '下载', true)
      DiskReadList = _this.handlePrometheus(DiskReadList, '读取', true)
      DiskWriteList = _this.handlePrometheus(DiskWriteList, '写入', true)
      _this.NetLists = NetUpList.concat(NetDownList)
      _this.DiskLists = DiskReadList.concat(DiskWriteList)

      _this.CPULists = _this.handlePrometheus(CPUList, '负载率')
      _this.RAMLists = _this.handlePrometheus(RAMList, '负载率')
    },

    getPrometheus(params, bool) {
      return new Promise((resolve) => {
        GetPrometheus(params)
          .then(res => {
            if (res.data.result.length !== 0) {
              if (res.data.result[0].value) {
                const value = res.data.result[0].value[1]
                resolve(value)
              } else if (res.data.result[0].values) {
                const values = res.data.result[0].values
                if (bool) {
                  values.map(item => {
                    item[1] = 1 - item[1]
                  })
                }
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
      * @param {Boolean} bytes
      * @returns {Array}
      */
    handlePrometheus(list, name, bytes) {
      const _this = this
      if (list) {
        list = list.map(item => {
          item = Object.assign({}, item)
          item.time = item[0]
          item.date = formatDate(item[0] * 1000, 'yyyy-MM-dd hh:mm:ss')
          if (bytes) {
            const valueArr = _this._.split(formatBytes(+item[1], 2), ' ', 2)
            item.value = +valueArr[0]
            item.unit = valueArr[1]
          } else {
            item.value = _this._.ceil(item[1] * 100, 2)
            item.unit = '%'
          }
          item.name = name
          return item
        })
      } else {
        list = []
      }
      return list
    },

    // 定时
    start() {
      const _this = this
      if (_this.setTime != null) {
        clearInterval(_this.setTime)
        _this.setTime = null
      }
      _this.setTime = setInterval(function() {
        _this.getList()
      }, 5000)
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
.metirc-data {
  display: -ms-flexbox;
  display: flex;
  height: 300px;
  width: 100%;
  background-color: #fff;
  margin-bottom: 10px;
  position: relative;
  .metirc-data-item {
    -ms-flex: 6 6 auto;
    flex: 6 6 auto;
    width: 0;
    .line-chart-header {
      width: calc(100% - 30px);
      padding: 26px 0 0;
      margin-bottom: 10px;
      top: -4px;
      position: relative;
      margin-left: 30px;
      .title {
        font-size: 16px;
        color: #1a2736;
        letter-spacing: 0;
      }
      .current-value {
        font-size: 32px;
        color: #1a2736;
        letter-spacing: 0;
        height: 60px;
        padding-top: 5px;
      }
      .double-value {
        height: 60px;
        display: -ms-flexbox;
        display: flex;
        padding-top: 4px;
        .item {
          -ms-flex: 1;
          flex: 1;
          padding-top: 5px;
        }
        .value {
          font-size: 20px;
          color: #1a2736;
          letter-spacing: 0;
        }
        .line {
          width: 20px;
          height: 3px;
          display: inline-block;
          margin-right: 10px;
          border-radius: 100px;
          position: relative;
          top: -2px;
        }
        .text {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #5e6978;
          letter-spacing: 0;
        }
      }
    }
    .metric-chart {
      height: 160px;
      left: -2px;
      margin: 0;
    }
  }
}
</style>
