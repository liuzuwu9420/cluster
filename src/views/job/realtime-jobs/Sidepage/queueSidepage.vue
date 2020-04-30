<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="pane-part">
          <div class="left-head">
            <div class="left-head-name">
              <span class="headName">{{ sidepagedata.list.QUEUE_NAME }}</span>
            </div>
          </div>
          <div class="left-body">
            <div class="left-head-title">
              <i class="el-icon-notebook-1" />
              <span class="head-title">概览</span>
            </div>
            <div v-for="(item,index) in showList" :key="index" class="detail-row">
              <div class="left-title">{{ item.label }}</div>
              <span class="right-content">{{ sidepagedata.list[item.prop] }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="作业" name="jobs">
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
                @pagination="getQueueTask"
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
                    {{ row.STAT }}
                  </el-tag>
                </template>
              </el-table-column>
            </Table>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="主机" name="host">
        <div class="pane-part">
          <div class="table-info">
            <Table ref="host-table" :data="hostData" :col-configs="hostColConfigs" :loading="loading">
              <el-table-column slot="HOST_NAME" label="节点名" width="100" align="left">
                <template v-slot="{row}">
                  <span>
                    <el-button type="text" @click="jumpToHost(row)">{{ row.HOST_NAME }}</el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column slot="STATUS" label="节点状态" width="100">
                <template v-slot="{row}">
                  <el-tag :type="hostStatusMap[row.STATUS].type">
                    {{ row.STATUS }}
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
import { mapGetters } from 'vuex'
import { GetTaskList, GetLsfHostInQueue } from '@/api/task'
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
  }
}
const hostStatusMap = {
  ok: {
    name: 'ok',
    type: 'success'
  },
  closed_Cu_excl: {
    name: 'closed_Cu_excl',
    type: 'danger'
  },
  closed_Full: {
    name: 'closed_Full',
    type: 'info'
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
const configLabel = {
  QUEUE_NAME: '队列名',
  PRIORITY: '优先值',
  INTERACTIVE: '交互式',
  ENABLED: '启用',
  HOSTS: '主机/主机组',
  USERS: '用户/用户组',
  QJOB_LIMIT: '队列最大运行作业数',
  UJOB_LIMIT: '队列用户最大作业数',
  CPULIMIT: '队列最大运行时间',
  DESCRIPTION: '描述'
}
export default {
  name: 'QueueTaskSidepage',
  components: {
    Pagination,
    Dropdown,
    Search,
    TableSidepage,
    Table
  },
  filters: {
    isEmpty(val) {
      if (val === true) { return '启用' } else if (val === false) { return '未启用' } else { return val || '-' }
    },
    getConfigLabel(val) {
      if (configLabel[val]) {
        return configLabel[val]
      } else {
        return val
      }
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
          sidepageShow: false,
          TaskShow: true
        }
      }
    }
  },
  data() {
    return {
      statusMap,
      hostStatusMap,
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
      hosts: [],
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
      ],
      hostData: [],
      hostColConfigs: [
        { slot: 'HOST_NAME' },
        { slot: 'STATUS' },
        { prop: 'JL/U', label: 'JL/U' },
        { prop: 'MAX', label: 'MAX' },
        { prop: 'NJOBS', label: 'NJOBS' },
        { prop: 'RUN', label: 'RUN' },
        { prop: 'SSUSP', label: 'SSUSP' },
        { prop: 'USUSP', label: 'USUSP' },
        { prop: 'RSV', label: 'RSV' }
      ],
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'name'
    ])
  },
  watch: {
    sidepagedata: {
      handler: function(val) {
        if (val.sidepageShow) {
          this.getQueueTask()
          this.getQueueHost()
        }
      },
      deep: true
    }
  },
  methods: {
    handleClick(tabs) {
      if (tabs.name === 'jobs') {
        this.getQueueTask()
      } else if (tabs.name === 'host') {
        this.getQueueHost()
      }
    },
    // 下拉选择发生改变触发事件
    dropdownChanged(data) {
      this.getQueueTask()
    },
    getQueueTask() {
      this.loading = true
      const params = this.getParams()
      GetTaskList(params)
        .then(res => {
          this.tasksData = res.RECORDS.map(function(item, index) {
            item.SUBMIT_TIME = formatDate(item.SUBMIT_TIME, 'yyyy-MM-dd hh:mm:ss')
            return item
          })
          this.page.total = res.JOBS
          this.loading = false
        })
        .catch(res => {
          console.log(res)
          this.taskData = []
          this.loading = false
        })
    },

    getParams() {
      let username
      if (['root', 'admin'].indexOf(this.name) > 0) {
        username = 'all'
      } else {
        username = this.name
      }
      const params = {
        username: username,
        page_size: this.page.pageSize,
        page_number: this.page.currentPage,
        job_status: this.dropdown.selected.value,
        queue_name: this.sidepagedata.list.QUEUE_NAME
      }
      if (this.query) {
        params.job_id = this.query.value
      }
      return params
    },

    async getQueueHost() {
      this.loading = true
      const res = await GetLsfHostInQueue(this.sidepagedata.list.QUEUE_NAME)
      this.hostData = res.RECORDS
      this.loading = false
    },

    jumpToHost(row) {
      this.$router.push({
        name: 'Job of host',
        params: {
          select: 'host_name',
          value: row.HOST_NAME
        }
      })
    },

    // 搜索
    searchChanged(data) {
      this.page.currentPage = 1
      if (data.select === 'jobID') {
        if (data.value === '') {
          this.getQueueTask()
        } else {
          this.getQueueTask(data)
        }
      }
    },
    // 跳转作业
    getJobID(data) {
      this.$router.push({
        name: 'Job list',
        params: {
          select: 'jobID',
          value: data.JOBID,
          Status: this.dropdown.selected.value
        }
      })
    },
    // 跳转队列
    jumpQueue(data) {
      this.$router.push({
        name: 'Job of queue',
        params: {
          select: 'name',
          value: data
        }
      })
    },
    // 跳转用户
    jumpUser(data) {
      this.$router.push({
        name: 'Job of user',
        params: {
          select: 'name',
          value: data
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
  .pane-part {
    padding: 0 10px;
    flex-grow:1;
    display: flex;
    flex-flow: column;
  }
  .head{
    padding: 0 10px;
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
    font-size: 14px;
    line-height: 24px;
    margin-right: 60px;
    display: flex;
  }
  .left-title {
    width: 30%;
    color: #5e6978;
    margin-right: 5px;
    overflow: hidden;
		// text-overflow: ellipsis;
		// white-space: nowrap;
  }
  .left-content {
    color: #1a2736;
    overflow: auto;
  }
  .right-content {
    width: 70%;
  }
  .jumpLink {
    cursor: pointer;
    color: #49b0f9;
  }
</style>
