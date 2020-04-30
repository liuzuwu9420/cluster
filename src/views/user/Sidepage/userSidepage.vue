<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName" :before-leave="beforeLeave">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="pane-part">
          <el-col :xs="24" :sm="24" :lg="18">
            <div class="left-head">
              <div class="left-head-name">
                <span class="headName">{{ sidepagedata.users.username }}</span>
              </div>
            </div>
            <div class="left-body">
              <div class="left-head-title">
                <i class="el-icon-notebook-1" />
                <span class="head-title">概览</span>
              </div>
              <div class="detail-row">
                <div class="left-title">用户ID:</div>
                <div class="right-content">{{ sidepagedata.users.userID }}</div>
              </div>
              <div class="detail-row">
                <div class="left-title">用户组ID:</div>
                <div class="right-content">{{ sidepagedata.users.groupID }}</div>
              </div>
              <div class="detail-row">
                <div class="left-title">用户组:</div>
                <div class="right-content">{{ sidepagedata.users.groupName }}</div>
              </div>
            </div>
          </el-col>
        </div>
      </el-tab-pane>
      <el-tab-pane label="作业" name="taskData">
        <div class="container el-scrollbar">
          <div class="head">
            <div class="head-buttons">
              <el-tooltip class="item" effect="dark" content="作业" placement="top">
                <dropdown
                  :selected="dropdown.selected"
                  :items="dropdown.items"
                  @change="dropdownChanged"
                />
              </el-tooltip>
            </div>
            <search :items="selected.items" @change="searchChanged" />
            <div class="pagination">
              <pagination
                v-show="page.total>0"
                :total="page.total"
                :page.sync="page.currentPage"
                :limit.sync="page.pageSize"
                @pagination="getList"
              />
            </div>
          </div>
          <div class="table-info el-scrollbar">
            <Table
              ref="table"
              :data="taskData"
              :col-configs="colConfigs"
              :loading="loading"
            >
              <el-table-column slot="JOBID" label="ID" align="center" width="150">
                <template v-slot="{row}">
                  <span>
                    <el-button type="text" @click="showSidepage(row)">{{ row.JOBID }}</el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column slot="STAT" label="作业状态" align="center" width="130">
                <template v-slot="{row}">
                  <el-tag size="mini" :type="statusObj(row).type">
                    <i :class="statusObj(row).icon" />
                    {{ statusObj(row).name }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column slot="SUBMIT_TIME" label="提交时间" align="center">
                <template v-slot="{row}">
                  <span>{{ row.SUBMIT_TIME }}</span>
                </template>
              </el-table-column>
            </Table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </table-sidepage>
</template>
<script>
import { GetTaskList } from '@/api/task'
import { formatDate } from '@/utils/format'
import { mouseover, mouseout, mousemove } from '@/utils/hover'
import TableSidepage from '@/components/TableSidepage'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Dropdown from '@/components/Dropdown'

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
  name: 'UserSidepage',
  components: {
    TableSidepage,
    Table,
    Pagination,
    Dropdown,
    Search
  },
  filters: {
    JobStatus(JobStatus) {
      return statusMap[JobStatus].name
    }
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          users: {
            userGroup: []
          },
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: 'BasicAttribute',
      loading: false,
      taskData: [],
      // 下拉选择数据
      dropdown: {
        selected: {
          key: 'run',
          value: 'run'
        },
        items: {
          run: 'run',
          pend: 'pend'
        }
      },
      // 查询数据
      selected: {
        items: [
          {
            value: 'jobID',
            label: 'jobID'
          }
        ]
      },
      colConfigs: [
        { slot: 'JOBID' },
        { slot: 'STAT' },
        { slot: 'SUBMIT_TIME' },
        { prop: 'QUEUE', label: '队列名' },
        { prop: 'FROM_HOST', label: '提交主机' },
        { prop: 'EXEC_HOST', label: '执行主机' }
      ],
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 1
      }
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val, oldVal) {
        if (this.activeName === 'taskData') {
          this.getList()
        }
      },
      deep: true
    }
  },
  methods: {
    beforeLeave(tab) {
      const _this = this
      if (tab === 'taskData') {
        _this.getList()
      }
    },
    // 下拉选择发生改变触发事件
    dropdownChanged(data) {
      this.getList()
    },
    async getList(query) {
      const _this = this
      _this.loading = true
      const params = {
        username: _this.sidepagedata.users.username,
        job_status: _this.dropdown.selected.value,
        page_size: _this.page.pageSize,
        page_number: _this.page.currentPage
      }
      if (query && query.select === 'jobID') {
        params.job_id = query.value
      }
      try {
        const res = await GetTaskList(params)
        this.taskData = res.RECORDS.map(function(item, index) {
          if (item.SUBMIT_TIME) {
            item.SUBMIT_TIME = formatDate(item.SUBMIT_TIME, 'MM-dd hh:mm:ss')
          }
          return item
        })
        _this.page.total = res.JOBS
        _this.loading = false
      } catch (res) {
        console.log(res)
        _this.taskData = []
        _this.loading = false
      }
    },

    // 搜索
    searchChanged(data) {
      const _this = this
      if (data.value === '') {
        _this.getList()
      } else {
        _this.getList(data)
      }
    },
    // 跳转作业
    getJobID(data) {
      const _this = this
      let status = ''
      if (data.JobStatus === 'RUN' || data.JobStatus === 'PEND') {
        status = data.JobStatus
      } else {
        status = 'FINISH'
      }
      _this.$router.push({
        name: 'Job list',
        params: {
          select: 'JobID',
          value: data.JobID,
          Status: status
        }
      })
    },

    statusObj(row) {
      if (row.STAT) {
        return statusMap[row.STAT]
      } else {
        return {
          name: 'Unknown',
          type: 'info',
          icon: 'el-icon-circle-close'
        }
      }
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
    padding-left: 10px;
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

  .table-info-choose-uses {
    height: calc(100vh - 294px);
    overflow: auto;
  }
  .el-table .userLink {
    cursor: pointer;
    color: #49b0f9;
  }
  .foot-table-users {
    width: 100%;
    height: 40px;
    padding: 5px 10px;
    text-align: center;
  }

</style>
