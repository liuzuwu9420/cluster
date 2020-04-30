<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <el-row class="pane-part">
          <el-col :xs="24" :sm="24" :lg="16">
            <div class="left-head">
              <div class="left-head-name">
                <span class="headName">{{ sidepagedata.list.HOST_NAME }}</span>
                <span><el-tag :type="statusMap[sidepagedata.list.STATUS].type">{{ sidepagedata.list.STATUS | STAT }}</el-tag></span>
              </div>
            </div>
            <div class="left-body">
              <div class="left-head-title">
                <i class="el-icon-notebook-1" />
                <span class="head-title">概览</span>
              </div>
              <div class="detail-row">
                <div class="left-title">JL/U:</div>
                <span class="right-content">{{ sidepagedata.list['JL/U'] }}</span>
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
      </el-tab-pane>
      <el-tab-pane label="作业" name="taskData">
        <div class="pane-part">
          <div class="head">
            <div class="head-buttons">
              <el-button type="primary" size="small" class="head-button" @click="getHostTask">
                <i class="el-icon-refresh-right" />
              </el-button>
              <search :items="selected.items" @change="searchChanged" />

            </div>
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
          <div class="table-info">
            <el-table
              v-loading="loading"
              :data="tasksData"
              element-loading-text="Loading"
              style="width: 100%;"
              height="100%"
            >
              <el-table-column label="ID" width="100">
                <template v-slot="{row}">
                  <el-tooltip class="item" effect="dark" content="跳转作业" placement="top">
                    <span class="jumpLink" @click="jumpJob(row)">{{ row.JOBID }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column label="执行主机" show-overflow-tooltip>
                <template v-slot="{row}">
                  <span>{{ row.EXEC_HOST }}</span>
                </template>
              </el-table-column>
              <el-table-column label="作业状态" width="140">
                <template v-slot="{row}">
                  <el-tag size="mini" :type="statusMap[row.STAT].type">
                    <i :class="statusMap[row.STAT].icon" />
                    {{ row.STAT | STAT }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="队列">
                <template v-slot="{row}">
                  <el-tooltip class="item" effect="dark" content="跳转队列" placement="top">
                    <span class="jumpLink" @click="jumpQueue(row)">{{ row.QUEUE }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="提交用户">
                <template v-slot="{row}">
                  <span>{{ row.USER }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交时间" show-overflow-tooltip>
                <template v-slot="{row}">
                  <span>{{ row.SUBMIT_TIME }}</span>
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
import { GetTaskList } from '@/api/task'
import { formatDate } from '@/utils/format'
import { mouseover, mouseout, mousemove } from '@/utils/hover'

import Pagination from '@/components/Pagination'
import TableSidepage from '@/components/TableSidepage'
import Search from '@/components/Search'

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
    Pagination,
    TableSidepage,
    Search
  },
  filters: {
    STAT(STAT) {
      return statusMap[STAT].name
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
      // 查询数据
      selected: {
        items: [
          {
            value: 'jobID',
            label: 'jobID'
          }
        ]
      },
      loading: false,
      tasksData: [],
      query: ''
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val) {
        console.log(val)
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
      if (tabs.name === 'taskData') {
        _this.getHostTask()
      }
    },
    getHostTask() {
      const _this = this
      _this.loading = true
      const params = {
        page_size: _this.page.pageSize,
        page_number: _this.page.currentPage,
        job_status: 'run',
        host_name: _this.sidepagedata.list.HOST_NAME
      }
      if (this.query) {
        params.job_id = this.query.value
      }
      GetTaskList(params)
        .then(res => {
          _this.tasksData = res.RECORDS.map(function(item, index) {
            item.SUBMIT_TIME = formatDate(item.SUBMIT_TIME, 'yyyy-MM-dd hh:mm:ss')
            return item
          })
          _this.page.total = res.JOBS
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
          _this.taskData = []
          _this.loading = false
        })
    },
    // 搜索
    searchChanged(data) {
      this.page.currentPage = 1
      if (data.select === 'jobID') {
        if (data.value === '') {
          this.getHostTask()
        } else {
          this.query = data
          this.getHostTask()
        }
      }
    },
    // 跳转作业
    jumpJob(data) {
      const _this = this
      _this.$router.push({
        name: 'Job list',
        params: {
          select: 'jobID',
          value: data.JOBID,
          Status: data.STAT.toLowerCase()
        }
      })
    },
    // 跳转队列
    jumpQueue(data) {
      const _this = this
      _this.$router.push({
        name: 'Job of queue',
        params: {
          select: 'name',
          value: data.QUEUE
        }
      })
    },
    // 跳转用户
    /* jumpUser(data) {
      const _this = this
      _this.$router.push({
        name: 'role.user',
        params: {
          select: 'name',
          value: data.USER
        }
      })
    }, */
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
.pane-part {
    padding: 0 10px;
    flex-grow:1;
    display: flex;
    flex-flow: column;
    .head-button{
      margin-right: 10px;
    }
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
