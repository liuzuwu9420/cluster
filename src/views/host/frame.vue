<template>
  <div class="frame-container">
    <div class="aside">
      <span class="aside-title">机架</span>
      <cabinet>
        <box>
          <sheet
            v-for="(item, index) in devices"
            :key="index"
            :border-show="item.HostIP === device.HostIP ? true : false"
            :index="index"
            @click.native="chooseHost(item)"
          />
        </box>
      </cabinet>
    </div>
    <div class="tableInfo">
      <div class="host-title">
        <span class="headName">{{ device.HostName }}</span>
        <span style="margin-right: 4px">
          <el-tooltip class="item" effect="light" content="状态" placement="top">
            <el-tag size="mini" :type="statusMap[device.Status].type">{{ device.Status | Status }}</el-tag>
          </el-tooltip>
        </span>
        <!-- <span>
          <el-tooltip class="item" effect="light" content="电源" placement="top">
            <el-tag
              size="mini"
              :type="powerSupplyMap[device.xcat.status].type"
            >{{ device.xcat.status | powerSupply }}</el-tag>
          </el-tooltip>
        </span>-->
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- <el-tab-pane label="监控" name="MonitoringData">
          <div v-if="NodeShow" class="container el-scrollbar">
            <iframe :src="NodeSrc" width="100%" height="98.9%" frameborder="0" />
          </div>
        </el-tab-pane>-->
        <el-tab-pane label="监控" name="MonitoringData">
          <div class="container el-scrollbar">
            <el-row :gutter="20" class="chart-row">
              <el-col :xs="12" :sm="12" :lg="8">
                <el-card shadow="hover">
                  <div class="line-chart-header">
                    <div class="title">CPU</div>
                  </div>
                  <div class="metric-chart">
                    <line-chart id="frameCPUChart" :lists.sync="CPULists" :color="color" />
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="12" :sm="12" :lg="8">
                <el-card shadow="hover">
                  <div class="line-chart-header">
                    <div class="title">内存</div>
                  </div>
                  <div class="metric-chart">
                    <line-chart id="frameRAMChart" :lists.sync="RAMLists" :color="color" />
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="12" :sm="12" :lg="8">
                <el-card shadow="hover">
                  <div class="line-chart-header">
                    <div class="title">网络</div>
                  </div>
                  <div class="metric-chart">
                    <line-chart id="frameNetChart" :lists.sync="NetLists" />
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="chart-row">
              <el-col :xs="12" :sm="12" :lg="8">
                <el-card shadow="hover">
                  <!-- <div class="line-chart-header">
                    <div class="title">存储</div>
                  </div>
                  <div
                    class="metric-chart"
                  >
                    <el-progress
                      type="circle"
                      :stroke-width="14"
                      :width="156"
                      :percentage="Storage.ratio"
                      :format="format"
                    />
                  </div>-->
                  <div class="bar-ratio">
                    <div class="line-chart-header">存储</div>
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
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="信息" name="BasicAttribute">
          <div class="container el-scrollbar">
            <el-row class="basic-container">
              <el-col :xs="24" :sm="24" :lg="10">
                <div class="left-head">
                  <div class="left-body">
                    <div class="left-head-title">
                      <i class="el-icon-notebook-1" />
                      <span class="head-title">概览</span>
                    </div>
                    <div class="detail-row">
                      <div class="left-title">OS IP:</div>
                      <span class="right-content">
                        <Clipboard :text="device.HostIP">{{ device.HostIP }}</Clipboard>
                      </span>
                    </div>
                    <div class="detail-row">
                      <div class="left-title">平台:</div>
                      <div class="right-content">{{ device.ansible_system }}</div>
                    </div>
                    <!-- <div class="detail-row">
                      <div class="left-title">CPU信息:</div>
                      <div
                        v-if="device.facter_processors"
                        class="right-content"
                        @mouseover="over($event)"
                        @mouseout="out($event)"
                        @mousemove="move($event)"
                      >{{ device.facter_processors.models[0] }}</div>
                    </div>-->
                    <div class="detail-row">
                      <div class="left-title">操作系统:</div>
                      <div class="right-content">{{ device.ansible_distribution }}</div>
                    </div>
                    <div class="detail-row">
                      <div class="left-title">系统版本:</div>
                      <div class="right-content">{{ device.ansible_distribution_version }}</div>
                    </div>
                    <div class="detail-row">
                      <div class="left-title">产品名:</div>
                      <div class="right-content">{{ device.ansible_product_name }}</div>
                    </div>
                    <div class="detail-row">
                      <div class="left-title">系统供应商:</div>
                      <div class="right-content">{{ device.ansible_system_vendor }}</div>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="14">
                <div class="right-body">
                  <div class="right-head-title">
                    <i class="el-icon-notebook-2" />
                    <span class="head-title">配置信息</span>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">CPU核数:</div>
                    <span class="right-content">{{ device.ansible_processor_vcpus }}核</span>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">内存:</div>
                    <div
                      class="right-content"
                    >{{ (device.ansible_memtotal_mb / 1024).toFixed(2) }}GB</div>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">指令集架构:</div>
                    <span class="right-content">{{ device.ansible_architecture }}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { GetList, GetNodeInfo } from '@/api/device'
import { getAddressIP } from '@/utils/address'
import { GetPrometheus, GetPrometheusInterval } from '@/api/prometheus'

import { mouseover, mouseout, mousemove } from '@/utils/hover'
import { formatBytes, formatDate } from '@/utils/format'

import Clipboard from '@/components/Clipboard'
import lineChart from '@/components/Chart/lineChart'

import cabinet from './components/frame/cabinet'
import box from './components/frame/box'
import sheet from './components/frame/sheet'

const statusMap = {
  OFF: {
    name: '不正常',
    type: 'danger'
  },
  ON: {
    name: '正常',
    type: 'success'
  },
  UNKNOWN: {
    name: '未知',
    type: 'info'
  }
}
const powerSupplyMap = {
  'powering-off': {
    name: '关机',
    type: 'danger'
  },
  booted: {
    name: '开机',
    type: 'success'
  },
  UNKNOWN: {
    name: '未知',
    type: 'info'
  }
}
export default {
  name: 'Frame',
  components: {
    Clipboard,
    lineChart,
    cabinet,
    box,
    sheet
  },
  filters: {
    Status(Status) {
      return statusMap[Status].name
    },
    powerSupply(powerSupply) {
      return powerSupplyMap[powerSupply].name
    }
  },
  data() {
    return {
      statusMap: statusMap,
      powerSupplyMap: powerSupplyMap,
      devices: [],
      device: {
        Status: 'ON',
        xcat: {
          status: 'booted'
        }
      },
      sheets: [
        {
          index: 0
        },
        {
          index: 1
        },
        {
          index: 2
        },
        {
          index: 3
        }
      ],
      activeName: 'MonitoringData',
      NodeSrc: '',
      CPULists: [],
      RAMLists: [],
      Storage: {
        used: 0,
        all: 0,
        ratio: 0
      },
      NetLists: [],
      color: ['#007fdf'],
      NodeShow: true,
      editTagVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    powerStatusObj(row) {
      if (row.xcat.status) {
        return powerSupplyMap[row.xcat.status]
      } else {
        return powerSupplyMap['UNKNOWN']
      }
    },
    statusObj(row) {
      if (row.Status) {
        return statusMap[row.Status]
      } else {
        return statusMap['UNKNOWN']
      }
    },
    format(percentage) {
      return this.Storage.all
    },
    async chooseHost(data) {
      const _this = this
      if (data) {
        _this.device = await _this.formatNodeInfo(data)
        _this.iframeTime(_this.device.HostIP)
      } else {
        setTimeout(function() {
          _this.devices.map((item, index) => {
            if (index === 0) {
              _this.device = item
            }
          })
          _this.iframeTime(_this.device.HostIP)
        }, 800)
      }
    },
    async getList() {
      const _this = this
      let hosts = {}
      _this.loading = true
      _this.devices = []
      try {
        const params = { 'page_size': 1, 'page_number': 100 }
        hosts = await GetList(params)
        if (!hosts.result_data) {
          _this.loading = false
          return
        }
        hosts.result_data.map(async function(item, index) {
          item = { 'HostName': item }
          const infoObj = await _this.formatNodeInfo(item)
          _this.devices.push(infoObj)
        })
        if (_this.$route.params.device) {
          _this.chooseHost(_this.$route.params.device)
        } else {
          _this.chooseHost()
        }
        _this.loading = false
      } catch (e) {
        console.log(e)
        _this.loading = false
      }
    },
    async formatNodeInfo(item) {
      const _this = this
      try {
        const data = await GetNodeInfo(item.HostName)
        if (data) {
          Object.assign(item, data)
          item.HostInfo = item.ansible_processor_vcpus + '核 / ' + (item.ansible_memtotal_mb / 1024).toFixed(2) + 'GB /   ' + item.ansible_architecture
          /* if (!item.facter_processors) {
            item.facter_processors = {
              'count': '',
              'models': [''],
              'physicalcount': ''
            }
          } */
          if (item.ansible_default_ipv4.address) {
            item.HostIP = item.ansible_default_ipv4.address
            item.Status = await _this.checkHostStatus(item.HostIP)
          }
          if (item.Status) {
            return item
          } else {
            item.Status = 'UNKNOWN'
            item.HostInfo = ''
            item.ansible_system_vendor = ''
            item.Tags = []
            return item
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    async checkHostStatus(ip) {
      const params = {
        query: `up{job="node",instance="${ip}:9100"}`
      }
      return new Promise((resolve) => {
        GetPrometheus(params)
          .then(res => {
            if (res.data.result.length !== 0) {
              if (res.data.result[0].value[1] === '0') {
                resolve('OFF')
              } else if (res.data.result[0].value[1] === '1') {
                resolve('ON')
              }
            } else {
              resolve('UNKNOWN')
            }
          })
          .catch(e => {
            console.log(e)
            resolve('UNKNOWN')
          })
      })
    },
    handleClick(tabs) {
      const _this = this
      if (tabs.name === 'MonitoringData') {
        _this.NodeShow = true
        _this.iframeTime(_this.device.HostIP)
      }
    },
    async iframeTime(IP) {
      const _this = this
      const startTime = _this._.floor((new Date().getTime() - 5 * 60 * 1000) / 1000)
      const endTime = _this._.floor(new Date().getTime() / 1000)

      const paramsCPULists = {
        query: `sum(node_load5{instance=~"${IP}.*"}) / sum(count(node_cpu_seconds_total{job="node",mode='system',instance=~"${IP}.*"}))`,
        start: startTime,
        end: endTime,
        step: 1
      }
      const paramsRAMLists = {
        query: `(sum(node_memory_MemTotal_bytes{job="node",instance=~"${IP}.*"})-sum(node_memory_MemAvailable_bytes{job="node",instance=~"${IP}.*"}))/sum(node_memory_MemTotal_bytes{job="node",instance=~"${IP}.*"})`,
        start: startTime,
        end: endTime,
        step: 1
      }
      const paramsNetUpLists = {
        query: `sum(irate(node_network_transmit_bytes_total{instance=~"${IP}.*",job="node",device!~"^(cali.+|tunl.+|dummy.+|kube.+|flannel.+|cni.+|docker.+|veth.+|lo.*)"}[5m]))`,
        start: startTime,
        end: endTime,
        step: 1
      }
      const paramsNetDownLists = {
        query: `sum(irate(node_network_receive_bytes_total{instance=~"${IP}.*",job="node",device!~"^(cali.+|tunl.+|dummy.+|kube.+|flannel.+|cni.+|docker.+|veth.+|lo.*)"}[5m]))`,
        start: startTime,
        end: endTime,
        step: 1
      }

      const paramsStorageUsed = { query: `sum(max(node_filesystem_size_bytes{device=~"/dev/.*", device!~"/dev/loop\\\\d+", instance=~"${IP}.*",job="node"}) by (device, instance)) - sum(max(node_filesystem_avail_bytes{instance=~"${IP}.*",device=~"/dev/.*", device!~"/dev/loop\\\\d+", job="node"}) by (device, instance))` }
      const paramsStorageAll = { query: `sum(max(node_filesystem_size_bytes{device=~"/dev/.*", device!~"/dev/loop\\\\d+", instance=~"${IP}.*",job="node"}) by (device, instance))` }

      const CPUList = await _this.getPrometheus(paramsCPULists)
      const RAMList = await _this.getPrometheus(paramsRAMLists)
      let NetUpList = await _this.getPrometheus(paramsNetUpLists)
      let NetDownList = await _this.getPrometheus(paramsNetDownLists)
      const StorageUsed = await _this.getPrometheus(paramsStorageUsed, true)
      const StorageAll = await _this.getPrometheus(paramsStorageAll, true)
      let StorageRatio = 0
      if (StorageAll === 0) {
        StorageRatio = 0
      } else {
        StorageRatio = StorageUsed / StorageAll
      }

      _this.CPULists = _this.handlePrometheus(CPUList, '负载率')
      _this.RAMLists = _this.handlePrometheus(RAMList, '负载率')
      _this.Storage.used = formatBytes(+StorageUsed, 2)
      _this.Storage.all = formatBytes(+StorageAll, 2)
      _this.Storage.ratio = _this._.ceil(StorageRatio * 100, 2)
      NetUpList = _this.handlePrometheus(NetUpList, '上传', true)
      NetDownList = _this.handlePrometheus(NetDownList, '下载', true)
      _this.NetLists = NetUpList.concat(NetDownList)
    },
    getPrometheus(params, bool) {
      return new Promise((resolve) => {
        if (bool) {
          GetPrometheus(params)
            .then(res => {
              if (res.data.result.length !== 0) {
                const value = res.data.result[0].value[1]
                resolve(value)
              } else {
                resolve(0)
              }
            })
            .catch(res => {
              console.log(res)
            })
        } else {
          GetPrometheusInterval(params)
            .then(res => {
              if (res.data.result.length !== 0) {
                const values = res.data.result[0].values
                resolve(values)
              } else {
                resolve(0)
              }
            })
            .catch(res => {
              console.log(res)
            })
        }
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

    getGrafanaAddress() {
      const grafanaAddress = getAddressIP('grafana.address')
      return grafanaAddress
    },
    /*
     *隐藏字体显示
     */
    over(e) {
      mouseover(e)
    },
    out(e) {
      mouseout(e)
    },
    move(e) {
      mousemove(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.frame-container {
  height: 100%;
  display: flex;
  padding: 10px;
  .aside {
    width: 250px;
    height: 100%;
    margin-bottom: 10px;
    .aside-title {
      display: block;
      margin: 10px 0;
      font-weight: 600;
    }
  }
  .tableInfo {
    flex: 1;
    margin-left: 15px;
    .host-title {
      margin: 10px 0;
    }
    .headName {
      font-weight: 600;
      font-size: 20px;
    }
    .el-tab-pane {
      height: 100%;
    }
    .container {
      width: 100%;
      height: 100%;
      overflow: auto;
      font-size: 16px;
      padding: 0 10px;
      .chart-row {
        margin: 10px 0;
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
      .line-chart-header {
        margin-left: 30px;
        margin-top: 10px;
      }
      .metric-chart {
        height: 160px;
        left: -2px;
        margin: 0;
        text-align: center;
      }
    }
    .basic-container {
      padding-left: 15px;
    }
    .left-head {
      margin-top: 20px;
      line-height: 20px;
      font-size: 0;
      color: #1a2736;
    }
    .left-body {
      margin-top: 30px;
      .left-head-title {
        border-bottom: 1px solid #5e6978;
        padding-bottom: 8px;
        color: #1a2736;
        font-size: 18px;
        margin-right: 60px;
        margin-bottom: 5px;
      }
    }
    .head-title {
      margin-left: 5px;
    }
    .right-head-title {
      border-bottom: 1px solid #5e6978;
      padding-bottom: 8px;
      color: #1a2736;
      font-size: 18px;
      margin-right: 60px;
      margin-bottom: 5px;
      margin-top: 40px;
    }
    .detail-row {
      padding-top: 20px;
      height: 40px;
      font-size: 14px;
      line-height: 24px;
      margin-right: 60px;
    }
    .left-title {
      width: 130px;
      color: #5e6978;
      float: left;
    }
    .left-content {
      color: #1a2736;
      overflow: auto;
    }
    .right-content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
