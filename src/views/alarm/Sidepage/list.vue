<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <el-row class="pane-part">
          <el-col>
            <div class="left-head">
              <div class="left-head-name">
                <span class="headName">{{ sidepagedata.list.alertname }}</span>
                <span>
                  <el-tag class="hosts-tags" :type="statusObj(sidepagedata.list).type">{{ statusObj(sidepagedata.list).name }}</el-tag>
                </span>
              </div>
            </div>
            <div class="left-body">
              <div class="left-head-title">
                <i class="el-icon-notebook-1" />
                <span class="head-title">概览</span>
              </div>
              <div class="detail-row">
                <div class="left-title">节点IP:</div>
                <span class="headName">{{ sidepagedata.list.instance }}</span>

              </div>
              <div class="detail-row">
                <div class="left-title">消息内容:</div>
                <div class="right-content">
                  <span>{{ sidepagedata.list.summary }}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="left-title">消息详情:</div>
                <div class="right-content">
                  <span>{{ sidepagedata.list.description }}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="left-title">消息时间:</div>
                <div class="right-content">{{ sidepagedata.list.startsAt }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </table-sidepage>
</template>
<script>
import TableSidepage from '@/components/TableSidepage'

const statusMap = {
  紧急: {
    name: '紧急',
    type: 'danger'
  },
  非常严重: {
    name: '非常严重',
    type: 'danger'
  },
  严重: {
    name: '严重',
    type: 'warning'
  },
  提示: {
    name: '提示',
    type: ''
  },
  未知: {
    name: '未知',
    type: 'info'
  }
}
export default {
  name: 'HistorySidepage',
  components: {
    TableSidepage
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          list: {},
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: 'BasicAttribute',
      loading: false
    }
  },
  methods: {
    statusObj(row) {
      if (row.severity) {
        return statusMap[row.severity]
      } else {
        return statusMap['未知']
      }
    }
  }
}
</script>
<style lang="scss">
  .tableInfo{
    .el-tabs__header {
      background-color: #eff9ff;
      .el-tabs__nav-scroll{
        margin-left: 60px;
      }
    }
  }
</style>
<style lang="scss" scoped>
.pane-part {
    padding: 0 10px;
    flex-grow:1;
    display: flex;
    flex-flow: column;
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
    margin-right: 5px;
    overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
  .jumpLink {
    cursor: pointer;
    color: #49b0f9;
  }
</style>
