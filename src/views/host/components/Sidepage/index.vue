<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="container el-scrollbar">
          <el-row class="pane-part">
            <el-col :xs="24" :sm="24" :lg="10">
              <div class="left-head">
                <div class="left-head-name">
                  <span class="headName">{{ sidepagedata.devices.HostName }}</span>
                  <span style="margin-right: 4px">
                    <el-tag size="mini" :type="statusMap[sidepagedata.devices.Status].type">{{ sidepagedata.devices.Status | Status }}
                    </el-tag>
                  </span>
                  <span>
                    <el-tag size="mini" :type="powerSupplyMap[sidepagedata.devices.xcat.status].type">{{ sidepagedata.devices.xcat.status | powerSupply }}
                    </el-tag>
                  </span>
                  <div>
                    <span class="hosts-tags">设备标签</span>
                    <span v-for="item in sidepagedata.devices.Tags" :key="item.UUID"><el-tag>{{ item.LabelKey }}:{{ item.LabelValue }}</el-tag></span>
                    <div class="edit-Tag">
                      <el-button type="text" size="small" @click="editTagVisible = true">编辑标签</el-button>
                      <editTags :host-u-u-i-d="sidepagedata.devices.UUID" :show="editTagVisible" :tags="sidepagedata.devices.Tags" @editTagsClosed="editTagClosed" />
                    </div>
                  </div>
                </div>
                <div class="left-body">
                  <div class="left-head-title">
                    <i class="el-icon-notebook-1" /> <span class="head-title">概览</span>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">BMC IP:</div>
                    <span class="right-content">
                      <Clipboard v-show="sidepagedata.devices.xcat.bmc" :text="sidepagedata.devices.xcat.bmc">{{ sidepagedata.devices.xcat.bmc }}</Clipboard>
                    </span>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">OS IP:</div>
                    <span class="right-content">
                      <Clipboard :text="sidepagedata.devices.HostIP">{{ sidepagedata.devices.HostIP }}</Clipboard>
                    </span>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">IB IP:</div>
                    <span class="right-content">
                      <Clipboard v-show="sidepagedata.devices.xcat.bmc" :text="sidepagedata.devices.xcat.ib">{{ sidepagedata.devices.xcat.ib }}</Clipboard>
                    </span>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">功率:</div>
                    <div class="right-content">{{ sidepagedata.devices.xcat.Power }}</div>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">平台:</div>
                    <div class="right-content">{{ sidepagedata.devices.ansible_system }}</div>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">CPU信息:</div>
                    <div v-if="sidepagedata.devices.facter_processors" class="right-content" @mouseover="over($event)" @mouseout="out($event)" @mousemove="move($event)">{{ sidepagedata.devices.facter_processors.models[0] }}</div>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">操作系统:</div>
                    <div class="right-content">{{ sidepagedata.devices.ansible_distribution }}</div>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">系统版本:</div>
                    <div class="right-content">{{ sidepagedata.devices.ansible_distribution_version }}</div>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">产品名:</div>
                    <div class="right-content">{{ sidepagedata.devices.ansible_product_name }}</div>
                  </div>
                  <div class="detail-row">
                    <div class="left-title">系统供应商:</div>
                    <div class="right-content">{{ sidepagedata.devices.ansible_system_vendor }}</div>
                  </div>
                </div>
              </div></el-col>
            <el-col :xs="24" :sm="24" :lg="14">
              <div class="right-body">
                <div class="right-head-title">
                  <i class="el-icon-notebook-2" /><span class="head-title">配置信息</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">CPU核数:</div>
                  <span class="right-content">{{ sidepagedata.devices.ansible_processor_vcpus }}核</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">内存:</div>
                  <div
                    class="right-content"
                  >{{ (sidepagedata.devices.ansible_memtotal_mb / 1024).toFixed(2) }}GB</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">指令集架构:</div>
                  <span class="right-content">{{ sidepagedata.devices.ansible_architecture }}</span>
                </div>
                <div class="right-head-title">
                  <i class="el-icon-notebook-2" /><span class="head-title">更多信息</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">UUID:</div>
                  <span class="right-content">
                    <Clipboard :text="sidepagedata.devices.UUID">{{ sidepagedata.devices.UUID }}</Clipboard>
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="监控数据" name="MonitoringData">
        <div v-if="NodeShow" class="container el-scrollbar">
          <iframe :src="NodeSrc" width="100%" height="98.9%" frameborder="0" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </table-sidepage>
</template>
<script>
import { getAddressIP } from '@/utils/address'
import editTags from '@/components/Tags/editTags'
import { mouseover, mouseout, mousemove } from '@/utils/hover'
import Clipboard from '@/components/Clipboard'
import TableSidepage from '@/components/TableSidepage'

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
  name: 'HostSidepage',
  components: {
    editTags,
    Clipboard,
    TableSidepage
  },
  filters: {
    Status(Status) {
      return statusMap[Status].name
    },
    powerSupply(powerSupply) {
      return powerSupplyMap[powerSupply].name
    }
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          devices: {},
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      statusMap: statusMap,
      powerSupplyMap: powerSupplyMap,
      activeName: 'BasicAttribute',
      NodeSrc: '',
      NodeShow: false,
      editTagVisible: false
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val, oldVal) {
        if (this.activeName === 'MonitoringData') {
          this.NodeShow = true
          this.iframeTime(val.devices.HostIP)
        } else {
          this.NodeShow = false
        }
      },
      deep: true
    }
  },
  methods: {
    editTagClosed(tags) {
      this.editTagVisible = false
      this.sidepagedata.devices.Tags = tags
    },
    handleClick(tabs) {
      const _this = this
      _this.NodeClassShow = false
      if (tabs.name === 'MonitoringData') {
        _this.NodeShow = true
        _this.iframeTime(_this.sidepagedata.devices.HostIP)
      }
    },
    iframeTime(IP) {
      const _this = this
      const timeInterval = '1h'
      const httpUrl = `http://${_this.getGrafanaAddress()}/d/9CWBz0bik/prometheus-node-exporterjian-kong-zhan-shi-kan-ban?orgId=1&var-node=${IP}:9100&var-maxmount=%2F&from=now-${timeInterval}&to=now&kiosk`
      _this.NodeSrc = httpUrl
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
<style lang="scss">
  .tableInfo{
    .el-tabs__header {
      background-color: #eff9ff;
      .el-tabs__nav-scroll{
        margin-left: 50px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .el-tab-pane {
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
    font-size: 16px;
  }
  .pane-part {
    padding-left: 60px;
  }
  .left-head {
    margin-top: 20px;
    line-height: 20px;
    font-size: 0;
    color: #1a2736;
    .headName {
      font-size: 24px;
      line-height: 26px;
      height: 26px;
      padding: 0 0 0 1px;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .left-head-name {
      margin-bottom: 5px;
    }
    .hosts-tags {
      font-size: 16px;
      margin-right: 10px;
    }
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
</style>
