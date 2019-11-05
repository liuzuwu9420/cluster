<template>
  <div v-if="sidepagedata.sidepageShow" class="tableInfo">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="close">
        <span slot="label" @click="sidepagedata.sidepageShow=false">
          <i class="el-icon-close" />
        </span>
      </el-tab-pane>
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="container el-scrollbar">
          <el-row class="basic-container">
            <el-col :xs="24" :sm="24" :lg="10">
              <div class="left-head">
                <div>
                  <span class="HostName">{{ sidepagedata.devices.HostName }}</span>
                  <span><el-tag size="mini" :type="statusMap[sidepagedata.devices.Status].type">{{ sidepagedata.devices.Status | Status }}</el-tag></span>
                </div>
                <div>
                  <span><el-tag v-for="(tag, index) in sidepagedata.devices.Tags" :key="index">{{ tag }}</el-tag></span>
                </div>
              </div>
              <div class="left-body">
                <div class="left-head-title">
                  <i class="el-icon-notebook-1" /> <span class="head-title">概览</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">IP:</div>
                  <span class="right-content">{{ sidepagedata.devices.HostIP }}</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">平台:</div>
                  <div class="right-content">{{ sidepagedata.devices.ansible_system }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">CPU信息:</div>
                  <div class="right-content">{{ sidepagedata.devices.facter_processors.models[0] }}</div>
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
            </el-col>
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
                <div class="right-head-title">
                  <i class="el-icon-notebook-2" /><span class="head-title">更多信息</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">UUID:</div>
                  <span class="right-content">{{ sidepagedata.devices.UUID }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="监控数据" name="MonitoringData">
        <div class="container el-scrollbar">
          <iframe :src="NodeSrc" width="100%" height="100%" frameborder="0" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="运行作业" name="RunTask">运行作业</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
const statusMap = {
  OFF: {
    name: '不正常',
    type: 'danger'
  },
  ON: {
    name: '正常',
    type: 'success'
  },
  UNKNOW: {
    name: '未知',
    type: 'info'
  }
}
export default {
  name: 'Sidepage',
  filters: {
    Status(Status) {
      return statusMap[Status].name
    }
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          devices: {},
          sidepageShow: true
        }
      }
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: 'BasicAttribute',
      NodeSrc: ''
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val, oldVal) {
        this.iframeTime(val.devices.HostIP)
      },
      deep: true
    }
  },
  methods: {
    handleClick(tabs) {
      const _this = this
      if (tabs.name === 'close') {
        _this.sidepagedata.sidepageShow = false
        _this.activeName = 'first'
      } else if (tabs.name === 'MonitoringData') {
        _this.iframeTime(_this.sidepagedata.devices.HostIP)
      }
    },
    iframeTime(IP) {
      const _this = this
      const timeInterval = '1h'
      const httpUrl = `http://16.16.18.61:3000/d/9CWBz0bik/prometheus-node-exporterjian-kong-zhan-shi-kan-ban?orgId=1&var-node=${IP}:9100&var-maxmount=%2F&from=now-${timeInterval}&to=now&kiosk`
      _this.NodeSrc = httpUrl
    }
  }
}
</script>
<style lang="scss" scoped>
.tableInfo {
  left: 170px;
  position: absolute;
  top: 0;
  top: 0;
  bottom: 0;
  right: 0;
  height: 820px;
  border-right: 1px solid #fff;
  z-index: 3000;
  background: #fff;
  .el-tabs {
    background-color: #eff9ff;
  }
  .container {
    width: 100%;
    height: 765px;
    overflow: auto;
    font-size: 16px;
    background-color: #e8f4ff;
  }
  .basic-container {
    padding-left: 60px;
  }
  .left-head {
    margin-top: 20px;
    line-height: 20px;
    font-size: 0;
    color: #1a2736;
    .HostName {
      font-size: 24px;
      line-height: 26px;
      height: 26px;
      padding: 0 0 0 1px;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  }
  .left-title {
    width: 140px;
    color: #5e6978;
    float: left;
  }
  .left-content {
    color: #1a2736;
  }
}
</style>
