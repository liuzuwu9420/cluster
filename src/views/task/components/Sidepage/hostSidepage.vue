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
            <el-col :xs="24" :sm="24" :lg="16">
              <div class="left-head">
                <div class="left-head-name">
                  <span class="HostName">{{ sidepagedata.list.HOST_NAME }}</span>
                  <span><el-tag :type="statusMap[sidepagedata.list.STATUS].type">{{ sidepagedata.list.STATUS | STATUS }}</el-tag></span>
                </div>
              </div>
              <div class="left-body">
                <div class="left-head-title">
                  <i class="el-icon-notebook-1" />
                  <span class="head-title">概览</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">JL/U:</div>
                  <span class="right-content">{{ sidepagedata.list.JL }}</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">MAX:</div>
                  <span class="right-content">{{ sidepagedata.list.MAX }}</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">RUN:</div>
                  <span class="right-content">{{ sidepagedata.list.RUN }}</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">NJOBS:</div>
                  <div class="right-content">{{ sidepagedata.list.NJOBS }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">RSV:</div>
                  <div class="right-content">{{ sidepagedata.list.RSV }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">SSUSP:</div>
                  <div class="right-content">{{ sidepagedata.list.SSUSP }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">USUSP:</div>
                  <div class="right-content">{{ sidepagedata.list.USUSP }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="作业" name="taskData">
        <div class="container el-scrollbar">
          <div class="hasten">
            <el-button type="primary" size="mini" @click="getHostTask">
              <i class="el-icon-refresh-right" /> 刷新
            </el-button>
            <div class="pagination">
              <pagination
                v-show="page.total>0"
                :total="page.total"
                :page.sync="page.currentPage"
                :limit.sync="page.pageSize"
                @pagination="getHostTask"
              />
            </div>
          </div>
          <div class="table-info el-scrollbar">
            <el-table
              v-loading="loading"
              :data="tasksData"
              element-loading-text="Loading"
              fit
              style="width: 100%; background-color: #e8f4ff;"
              row-class-name="table-row-class"
              height="100%"
            >
              <el-table-column label="ID" width="120">
                <template v-slot="{row}">
                  <el-tooltip class="item" effect="dark" content="跳转作业" placement="top">
                    <span class="jumpLink" @click="jumpJob(row)">{{ row.JobID }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column label="名称" width="160">
                <template v-slot="{row}">
                  <span>{{ row.JobName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="作业状态" width="140">
                <template v-slot="{row}">
                  <el-tag size="mini" :type="statusMap[row.JobStatus].type">
                    <i :class="statusMap[row.JobStatus].icon" />
                    {{ row.JobStatus | JobStatus }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="队列">
                <template v-slot="{row}">
                  <el-tooltip class="item" effect="dark" content="跳转队列" placement="top">
                    <span class="jumpLink" @click="jumpQueue(row)">{{ row.QueueName }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="提交用户">
                <template v-slot="{row}">
                  <el-tooltip class="item" effect="dark" content="跳转用户" placement="top">
                    <span class="jumpLink" @click="jumpUser(row)">{{ row.UserName }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="开始时间" show-overflow-tooltip>
                <template v-slot="{row}">
                  <span>{{ row.ExecuteTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="运行时长">
                <template v-slot="{row}">
                  <span>{{ row.RunTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交时间" show-overflow-tooltip>
                <template v-slot="{row}">
                  <span>{{ row.SubmitTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="等待时长">
                <template v-slot="{row}">
                  <span>{{ row.PendTime }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { GetLsfHostTask } from '../../../../api/task'
import { formatDate, formatDiff } from '../../../../utils/format'
import { mouseover, mouseout, mousemove } from '../../../../utils/hover'

import Pagination from '@/components/Pagination'

// import Tags from '@/components/Tags'
// import Dropdown from '@/components/Dropdown'
// import Search from '@/components/Search'

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
  },
  ok: {
    name: 'ok',
    type: 'success'
  },
  closed_Cu_excl: {
    name: 'closed_Cu_excl',
    type: 'danger'
  },
  unreach: {
    name: 'unreach',
    type: 'info'
  },
  closed: {
    name: 'closed',
    type: 'info'
  },
  unavail: {
    name: 'unavail',
    type: 'info'
  }
}
export default {
  name: 'HostSidepage',
  components: {
    Pagination
    // Dropdown,
    // Search
    // Tags
  },
  filters: {
    JobStatus(JobStatus) {
      return statusMap[JobStatus].name
    },
    STATUS(STATUS) {
      return statusMap[STATUS].name
    }
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          list: {},
          tabName: '',
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: 'BasicAttribute',
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      tasksData: []
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val) {
        if (val.sidepageShow) {
          this.getHostTask()
        }
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
    getHostTask() {
      const _this = this
      _this.loading = true
      const params = {
        page: {
          PageSize: _this.page.pageSize,
          PageNumber: _this.page.currentPage
        }
      }
      GetLsfHostTask(params, _this.sidepagedata.list.HOST_NAME)
        .then(res => {
          _this.tasksData = res.Inventory.ResultData.map(function(item, index) {
            item.SubmitTime = formatDate(item.SubmitTime, 'yyyy-MM-dd hh:mm:ss')
            if (item.ExecuteTime) {
              item.ExecuteTime = formatDate(item.ExecuteTime, 'yyyy-MM-dd hh:mm:ss')
              item.RunTime = formatDiff(item.ExecuteTime)
              item.PendTime = formatDiff(item.SubmitTime, item.ExecuteTime)
            } else {
              item.RunTime = ''
              item.PendTime = formatDiff(item.SubmitTime)
            }
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
          _this.taskData = []
          _this.loading = false
        })
    },
    // 跳转作业
    jumpJob(data) {
      const _this = this
      _this.$router.push({
        name: 'task.taskList',
        params: {
          select: 'JobID',
          value: data.JobID,
          Status: data.JobStatus
        }
      })
    },
    // 跳转队列
    jumpQueue(data) {
      const _this = this
      _this.$router.push({
        name: 'task.queueList',
        params: {
          select: 'name',
          value: data.QueueName
        }
      })
    },
    // 跳转用户
    jumpUser(data) {
      const _this = this
      _this.$router.push({
        name: 'role.user',
        params: {
          select: 'name',
          value: data.UserName
        }
      })
    },
    /*
			 *隐藏字体显示
			 * */
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
.tableInfo {
  left: 130px;
  position: absolute;
  top: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border-right: 1px solid #fff;
  z-index: 1500;
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
    padding: 0 10px;
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

  .el-table .jumpLink {
    cursor: pointer;
    color: #49b0f9;
  }
  .foot-table-users {
    width: 100%;
    height: 40px;
    padding: 5px 10px;
    text-align: center;
  }
}
</style>
