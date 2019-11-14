<template>
  <div v-if="sidepagedata.sidepageShow" class="tableInfo tableInfoEvents">
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
                <div class="left-head-name">
                  <span class="HostName">{{ sidepagedata.jobs.JobName }}</span>
                </div>
              </div>
              <div class="left-body">
                <div class="left-head-title">
                  <i class="el-icon-notebook-1" /> <span class="head-title">概览</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">ID:</div>
                  <span class="right-content">{{ sidepagedata.jobs.JobID }}</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">UUID:</div>
                  <div class="right-content">{{ sidepagedata.jobs.UUID }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">用户名:</div>
                  <div class="right-content">{{ sidepagedata.jobs.UserName }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">费用:</div>
                  <div class="right-content">{{ sidepagedata.jobs.TotalCost }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">运行时长:</div>
                  <div class="right-content">{{ sidepagedata.jobs.time }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">队列名:</div>
                  <div class="right-content">{{ sidepagedata.jobs.QueueName }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">项目名:</div>
                  <div class="right-content">{{ sidepagedata.jobs.ProjectName }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">作业组:</div>
                  <div class="right-content">{{ sidepagedata.jobs.JobGroup }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">作业提交主机:</div>
                  <div class="right-content">{{ sidepagedata.jobs.SubmissionHostName }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">作业提交时间:</div>
                  <div class="right-content">{{ sidepagedata.jobs.SubmitTime }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">作业开始执行时间:</div>
                  <div class="right-content">{{ sidepagedata.jobs.ExecuteTime }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">作业结束时间:</div>
                  <div class="right-content">{{ sidepagedata.jobs.EndTime }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">描述:</div>
                  <div class="right-content">{{ sidepagedata.jobs.JobDescription }}</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="14">
              <div class="right-body">
                <div class="right-head-title">
                  <i class="el-icon-notebook-2" /><span class="head-title">历史信息</span>
                </div>
                <div style="height: 300px; max-height: 690px; padding-top: 20px;">
                  <el-steps direction="vertical" :active="activeEvents">
                    <el-step
                      v-for="(item, index) in events"
                      :key="index"
                      :title="item.CurrentStatus"
                      :description="item.description"
                      :icon="item.Icon"
                    />
                  </el-steps>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { GetJobIDEvents } from '../../../../api/monitor'
import { formatDate } from '../../../../utils/format'
import Tags from '@/components/Tags'

const statusMap = {
  RUN: {
    name: 'RUN',
    type: 'success',
    icon: 'el-icon-loading'
  },
  PEND: {
    name: 'PEND',
    type: 'warning',
    icon: 'el-icon-video-play'
  },
  DONE: {
    name: 'DONE',
    type: 'info',
    icon: 'el-icon-circle-check'
  },
  'DONE+PDONE': {
    name: 'DONE+PDONE',
    type: 'info',
    icon: 'el-icon-circle-check'
  },
  'DONE+PERR': {
    name: 'DONE+PERR',
    type: 'info',
    icon: 'el-icon-circle-check'
  },
  EXIT: {
    name: 'EXIT',
    type: 'danger',
    icon: 'el-icon-circle-close'
  }
}
export default {
  name: 'EvnetsSidepage',
  components: {
    Tags
  },
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
          jobs: {},
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: 'BasicAttribute',
      events: [],
      activeEvents: 0
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val) {
        if (val.sidepageShow) {
          this.getEvents()
        }

        [...document.querySelectorAll('.el-steps .el-step__icon div')].forEach((el, index, arr) => {
          console.log(el, arr.length - index) // 3,2,1
          el.innerHTML = arr.length - index
        })
      },
      deep: true
    }
  },
  methods: {
    handleClick(tabs) {
      const _this = this
      if (tabs.name === 'close') {
        _this.sidepagedata.sidepageShow = false
        _this.activeName = 'BasicAttribute'
      }
    },
    getEvents() {
      const _this = this
      GetJobIDEvents(_this.sidepagedata.jobs.JobID)
        .then(res => {
          _this.events = res.Inventory.map(item => {
            item.ChangeTime = formatDate(item.ChangeTime, 'yyyy-MM-dd hh:mm:ss')
            item.description = item.ChangeTime + ' ' + item.ChangeReason
            if (item.CurrentStatus === 'PEND') {
              _this.$set(item, 'Icon', 'el-icon-video-play')
            } else if (item.CurrentStatus === 'RUN') {
              _this.$set(item, 'Icon', 'el-icon-refresh')
            } else if (item.CurrentStatus === 'EXIT') {
              _this.$set(item, 'Icon', 'el-icon-circle-close')
            } else if (item.CurrentStatus === 'DONE') {
              _this.$set(item, 'Icon', 'el-icon-circle-check')
            } else if (item.CurrentStatus === 'DONE+PDONE') {
              _this.$set(item, 'Icon', 'el-icon-success')
            } else {
              _this.$set(item, 'Icon', 'el-icon-remove')
            }
            return item
          })
          _this.activeEvents = _this.events.length
        }).catch(res => {
          console.log(res)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.tableInfoEvents {
  left: 170px;
  position: absolute;
  top: 0;
  top: 0;
  bottom: 0;
  right: 0;
  max-height: 805px;
  border-right: 1px solid #fff;
  z-index: 3000;
  background: #fff;
  .el-tabs {
    background-color: #eff9ff;
  }
  .el-tab-pane {
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
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
    overflow: auto;
  }
}
</style>
