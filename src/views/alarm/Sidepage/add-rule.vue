<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" :style-object="styleObject" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName">
      <el-tab-pane label="报警规则" name="alarmRuleData">
        <div class="container el-scrollbar">
          <div class="table-info el-scrollbar">
            <el-table
              v-loading="loading"
              :data="alarmRulesData"
              element-loading-text="Loading"
              fit
              style="width: 100%"
              height="100%"
              highlight-current-row
              @cell-click="handleCurrentChange"
            >
              <el-table-column label="报警条目">
                <template v-slot="{row}">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </table-sidepage>
</template>
<script>
import TableSidepage from '@/components/TableSidepage'

export default {
  name: 'AddAlarmSidepage',
  components: {
    TableSidepage
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      activeName: 'alarmRuleData',
      styleObject: {
        left: '321px'
      },
      loading: false,
      alarmRulesData: [
        {
          name: '主机状态',
          expr: 'up'
        },
        {
          name: 'CPU使用率',
          expr: '100-(avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) by(instance)* 100)'
        },
        {
          name: '磁盘容量',
          expr: '100-(node_filesystem_free_bytes{fstype=~"ext4|xfs"}/node_filesystem_size_bytes {fstype=~"ext4|xfs"}*100)'
        }
      ]
    }
  },
  methods: {
    handleCurrentChange(row) {
      this.$emit('handle-billing-rule-data', row)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-tabs {
    background-color: #eff9ff;
  }
  .el-tab-pane {
    height: 100%;
  }
  .container {
    width: 100%;
    height: calc(100% - 44px);
    overflow: auto;
    font-size: 16px;
    background-color: #ffffff;
  }
  .pane-part {
    padding-left: 60px;
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
    width: 110px;
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
  .right-content-usergroup {
    overflow: auto;
  }
  .GroupLink {
    cursor: pointer;
    color: #49b0f9;
  }
  .hasten {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    padding: 5px 10px;
    .el-button {
      height: 36px;
      line-height: 0;
      float: left;
      margin-right: 0px;
      margin-left: 0px;
    }
    .headBut {
      margin-right: 0px;
      margin-left: 10px;
      float: left;
    }
  }

  .pagination {
    float: right;
  }

  .table-info {
    height: calc(100vh - 234px);
    overflow: auto;
  }
</style>
