<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="pane-part">
          <el-col :xs="24" :sm="24" :lg="16">
            <div class="left-head">
              <div class="left-head-name">
                <span class="headName">{{ sidepagedata.list['USER/GROUP'] }}</span>
              </div>
            </div>
            <div class="left-body">
              <div class="left-head-title">
                <i class="el-icon-notebook-1" />
                <span class="head-title">概览</span>
              </div>
              <div v-for="(value,key) in activeList" :key="key" class="detail-row">
                <div class="left-title">{{ key }} :</div>
                <span class="right-content">{{ value }}</span>
              </div>
            </div>
          </el-col>
        </div>
      </el-tab-pane>
      <el-tab-pane label="作业" name="taskData">
        <div class="pane-part">
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
                @pagination="getUserTask"
              />
            </div>
          </div>
          <div class="table-info">
            <Table ref="table" :data="tasksData" :col-configs="colConfigs" :loading="loading">
              <el-table-column slot="JOBID" label="作业ID" align="center">
                <template v-slot="{row}">
                  <el-tooltip class="item" effect="dark" content="跳转作业" placement="top">
                    <span class="userLink" @click="getJobID(row)">{{ row.JOBID }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column slot="STAT" label="状态" align="center">
                <template v-slot="{row}">
                  <el-tag size="mini" :type="statusMap[row.STAT].type">
                    <i :class="statusMap[row.STAT].icon" />
                    {{ row.STAT | STAT }}
                  </el-tag>
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

import Pagination from '@/components/Pagination'
import Dropdown from '@/components/Dropdown'
import Search from '@/components/Search'
import TableSidepage from '@/components/TableSidepage'
import Table from '@/components/Table'

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
  name: 'UserTaskSidepage',
  components: {
    Pagination,
    Dropdown,
    Search,
    TableSidepage,
    Table
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
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      tasksData: [],
      showList: [
        { prop: 'PRIO', label: 'PRIO' },
        { prop: 'STATUS', label: 'STATUS' },
        { prop: 'MAX', label: 'MAX' },
        { prop: 'JL/U', label: 'JL/U' },
        { prop: 'JL/P', label: 'JL/P' },
        { prop: 'JL/H', label: 'JL/H' },
        { prop: 'NJOBS', label: 'NJOBS' },
        { prop: 'PEND', label: 'PEND' },
        { prop: 'RUN', label: 'RUN' },
        { prop: 'SUSP', label: 'SUSP' }
      ],
      colConfigs: [
        { slot: 'JOBID' },
        { prop: 'JOB_NAME', label: '作业名称' },
        { slot: 'STAT' },
        { prop: 'SUBMIT_TIME', label: '提交时间' },
        { prop: 'USER', label: '用户名' }
      ]
    }
  },
  computed: {
    activeList() {
      if (!this.sidepagedata.list) { return }
      const activeList = JSON.parse(JSON.stringify(this.sidepagedata.list))
      delete activeList['USER/GROUP']
      return activeList
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val) {
        if (val.sidepageShow) {
          this.getUserTask()
        }
      },
      deep: true
    }
  },
  methods: {
    handleClick(tabs) {
      const _this = this
      if (tabs.name === 'taskData') {
        _this.getUserTask()
      }
    },
    // 下拉选择发生改变触发事件
    dropdownChanged(data) {
      const _this = this
      _this.getUserTask()
      /* if (data.key === 'RUN') {
      } else if (data.key === 'PEND') {
        _this.getUserTask()
      } */
    },
    getUserTask(query) {
      const _this = this
      _this.loading = true
      const params = {
        username: _this.sidepagedata.list['USER/GROUP'],
        page_size: _this.page.pageSize,
        page_number: _this.page.currentPage,
        job_status: _this.dropdown.selected.value
      }
      if (query) {
        params.job_id = query.value
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
      const _this = this
      _this.page.currentPage = 1
      if (data.select === 'jobID') {
        if (data.value === '') {
          _this.getUserTask()
        } else {
          _this.getUserTask(data)
        }
      }
    },
    // 跳转作业
    getJobID(data) {
      const _this = this
      _this.$router.push({
        name: 'Job list',
        params: {
          select: 'jobID',
          value: data.JOBID,
          Status: _this.dropdown.selected.value
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
          value: data
        }
      })
    },
    // 跳转用户
    jumpUser(data) {
      const _this = this
      _this.$router.push({
        name: 'Job of user',
        params: {
          select: 'name',
          value: data
        }
      })
    },
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
