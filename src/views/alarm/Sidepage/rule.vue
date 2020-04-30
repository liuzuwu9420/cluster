<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <el-row class="pane-part">
          <el-col :xs="24" :sm="24" :lg="18">
            <div class="left-head">
              <div class="left-head-name">
                <span class="headName">{{ sidepagedata.rules.metadata.name }}</span>
              </div>
              <div class="left-body">
                <div class="left-head-title">
                  <i class="el-icon-notebook-1" />
                  <span class="head-title">概览</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">启用:</div>
                  <div class="right-content">
                    <el-switch
                      v-model="sidepagedata.rules.metadata.enabled"
                      :disabled="roleDisabled"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change="changeAlarmMatedata(sidepagedata.rules)"
                    />
                  </div>
                </div>
                <div class="detail-row">
                  <div class="left-title">报警级别:</div>
                  <severity-edit
                    :edit-container="sidepagedata.rules.data.severity"
                    @change="changeDataSeverity"
                  >
                    <el-select
                      v-show="!severityShow"
                      v-model="sidepagedata.rules.data.severity"
                      placeholder="请选择"
                      @change="changeAlarmData(sidepagedata.rules)"
                    >
                      <el-option label="紧急" value="紧急" />
                      <el-option label="严重" value="严重" />
                      <el-option label="提示" value="提示" />
                    </el-select>
                  </severity-edit>
                </div>
                <div class="detail-row">
                  <div class="left-title">报警条目:</div>
                  <span class="right-content">{{ sidepagedata.rules.data.alert }}</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">报警条件:</div>
                  <expr-edit
                    :edit-container="sidepagedata.rules.data.expr.condition + sidepagedata.rules.data.expr.value"
                    @change="changeDataExpr"
                  >
                    <el-input
                      v-show="!exprShow"
                      v-model="sidepagedata.rules.data.expr.value"
                      class="input-with-select"
                      @change="changeAlarmData(sidepagedata.rules)"
                    >
                      <el-select
                        slot="prepend"
                        v-model="sidepagedata.rules.data.expr.condition"
                        placeholder="请选择"
                      >
                        <el-option label=">" value=">" />
                        <el-option label=">=" value=">=" />
                        <el-option label="<" value="<" />
                        <el-option label="<=" value="<=" />
                        <el-option label="==" value="==" />
                      </el-select>
                    </el-input>
                  </expr-edit>
                </div>
                <div class="detail-row">
                  <div class="left-title">持续时间:</div>
                  <for-edit
                    :edit-container="sidepagedata.rules.data.for.value + sidepagedata.rules.data.for.condition"
                    @change="changeDataFor"
                  >
                    <el-input
                      v-show="!forShow"
                      v-model="sidepagedata.rules.data.for.value"
                      class="input-with-select"
                      @change="changeAlarmData(sidepagedata.rules)"
                    >
                      <el-select
                        slot="append"
                        v-model="sidepagedata.rules.data.for.condition"
                        placeholder="请选择"
                      >
                        <el-option label="分钟" value="m" />
                        <el-option label="秒" value="s" />
                        <el-option label="小时" value="h" />
                      </el-select>
                    </el-input>
                  </for-edit>
                </div>
                <!--  <div class="detail-row">
                    <div class="left-title">CPU信息:</div>
                    <div v-if="sidepagedata.devices.facter_processors" class="right-content" @mouseover="over($event)" @mouseout="out($event)" @mousemove="move($event)">{{ sidepagedata.devices.facter_processors.models[0] }}</div>
                  </div>-->
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- <el-tab-pane label="metadata" name="metadata">
        <div class="container el-scrollbar">
          <div class="head">
            <el-button type="primary" size="mini" @click="changeGroupsData('metadata')">
              <i class="el-icon-folder-checked" /> 保存
            </el-button>
            <el-button type="info" plain size="mini" @click="cancelGroupsData('metadata')">
              <i class="el-icon-refresh-left" /> 取消变更
            </el-button>
            <el-button type="danger" size="mini" @click="deleteGroupsData()">
              <i class="el-icon-delete" /> 删除
            </el-button>
          </div>

          <div class="table-info el-scrollbar">
            <ace-metadata :value="rule.metadataValue" @input="matedataInput" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="data" name="data">
        <div class="container el-scrollbar">
          <div class="head">
            <el-button type="primary" size="mini" @click="changeGroupsData('data')">
              <i class="el-icon-folder-checked" /> 保存
            </el-button>
            <el-button type="info" plain size="mini" @click="cancelGroupsData('data')">
              <i class="el-icon-refresh-left" /> 取消变更
            </el-button>
            <el-button type="danger" size="mini" @click="deleteGroupsData()">
              <i class="el-icon-delete" /> 删除
            </el-button>
          </div>
          <div class="table-info el-scrollbar">
            <ace-data :value="rule.Value" @input="dataInput" />
          </div>
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </table-sidepage>
</template>
<script>
import { mapGetters } from 'vuex'
import { changeConsulAlarm, deleteConsulAlarm } from '@/api/consul'

// import AceMatedata from '@/components/Ace'
// import AceData from '@/components/Ace'
import TableSidepage from '@/components/TableSidepage'
import SeverityEdit from '@/components/Edit'
import ExprEdit from '@/components/Edit'
import ForEdit from '@/components/Edit'

export default {
  name: 'TasksSidepage',
  components: {
    // AceMatedata,
    // AceData,
    TableSidepage,
    SeverityEdit,
    ExprEdit,
    ForEdit
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          rules: {},
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      activeName: 'BasicAttribute',
      activeEvents: 0,
      rule: this.sidepagedata.rules,
      alarmRule: {
        metadata: {},
        data: ''
      },
      severityShow: true,
      exprShow: true,
      forShow: true
    }
  },
  computed: {
    ...mapGetters([
      'roleDisabled'
    ])
  },
  watch: {
    sidepagedata: {
      handler: function(val) {
        if (val.sidepageShow) {
          this.rule = this.sidepagedata.rules
        }
      },
      deep: true
    }
  },
  mounted() {
    this.rule = this.sidepagedata.rules
  },
  methods: {
    changeAlarmMatedata(row) {
      const _this = this
      const url = `${row.metadata.key}/metadata`
      if (row.data.alert === '主机状态') {
        row.metadata.desc = '主机状态'
      } else if (row.data.alert === 'CPU使用率') {
        row.metadata.desc = row.data.alert + row.data.expr.condition + row.data.expr.value
      } else if (row.data.alert === '磁盘容量') {
        row.metadata.desc = row.data.alert + row.data.expr.condition + row.data.expr.value
      }
      const params = `{
  "key": "${row.metadata.key}",
  "name": "${row.metadata.name}",
  "desc": "${row.metadata.desc}",
  "enabled": ${row.metadata.enabled}
}`
      changeConsulAlarm(url, params)
        .then(data => {
          if (data) {
            this.sidepagedata.sidepageShow = false
            _this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    changeAlarmData(row) {
      const _this = this
      _this.changeAlarmMatedata(row)
      const url = `${row.Key}`
      const params = `- name: ${row.data.name}
  rules:
  - alert: ${row.data.name}
    expr: ${row.data.expr.expr} ${row.data.expr.condition} ${row.data.expr.value}
    for: ${row.data.for.value}${row.data.for.condition}
    labels:
      severity: ${row.data.severity}
    annotations:
      summary: "{{$labels.instance}}:${row.data.summary}"`
      changeConsulAlarm(url, params)
        .then(data => {
          if (data) {
            this.sidepagedata.sidepageShow = false
            _this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    changeDataSeverity(data) {
      this.severityShow = data
    },
    changeDataExpr(data) {
      this.exprShow = data
    },
    changeDataFor(data) {
      this.forShow = data
    },
    matedataInput(value) {
      this.alarmRule.metadata = value
    },
    dataInput(value) {
      this.alarmRule.data = value
    },
    changeGroupsData(value) {
      const key = `${this.sidepagedata.rules.url}/${value}`
      const params = value === 'data' ? this.alarmRule.data : this.alarmRule.metadata
      changeConsulAlarm(key, params)
        .then(res => {
          if (res) {
            this.sidepagedata.sidepageShow = false
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '修改失败'
          })
        })
    },
    cancelGroupsData(value) {
      if (value === 'metadata') {
        this.rule.metadataValue = this.sidepagedata.rules.metadataValue
      } else if (value === 'data') {
        this.rule.Value = this.sidepagedata.rules.Value
      }
    },
    deleteGroupsData() {
      this.$confirm('此操作将删除该报警器, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const params = `${this.sidepagedata.rules.url}?recurse=true`
        await deleteConsulAlarm(params)
        this.sidepagedata.sidepageShow = false
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
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
