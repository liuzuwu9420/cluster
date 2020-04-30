<template>
  <div class="app-container" @click="closeSidepage($event)">
    <div class="head">
      <div class="head-radio">
        <el-radio-group v-model="statusRadio">
          <el-radio-button label="run">运行中</el-radio-button>
          <el-radio-button label="pend">等待中</el-radio-button>
          <el-radio-button label="others">其他</el-radio-button>
        </el-radio-group>
      </div>
      <div class="head-buttons">
        <el-button type="primary" size="small" class="head-button" @click="getList()">
          <i class="el-icon-refresh-right" />
        </el-button>
        <export-excel
          :list.sync="ExportList.list"
          :filter-val="ExportList.filterVal"
          :t-header="ExportList.tHeader"
          :items="ExportList.items"
          :selected="ExportList.selected"
          class="head-button"
          @change="ExportChanged"
        />
        <search class="head-button" :items="selected.items" @change="searchChanged" />
      </div>
      <div class="pagination">
        <pagination
          v-show="page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="getList()"
        />
      </div>
    </div>
    <div class="table-info">
      <Table
        ref="table"
        :data="taskData"
        :col-configs="colConfigs"
        :loading="loading"
        :sort-change="sortChange"
      >
        <el-table-column slot="JOBID" label="ID" sortable="custom" align="center" width="150">
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
      <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetTaskList } from '@/api/task'
import { formatDate } from '@/utils/format'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import ExportExcel from '@/components/ExportExcel'
import Table from '@/components/Table'
import Sidepage from './Sidepage/taskSidepage'
import SidepageMixin from '@/mixin/toggleSidepage'

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
  UNKWN: {
    name: 'UNKWN',
    type: 'info',
    icon: 'el-icon-question'
  }
}
export default {
  name: 'TaskList',
  components: {
    Table,
    Pagination,
    Search,
    Sidepage,
    ExportExcel
  },
  mixins: [SidepageMixin],
  data() {
    return {
      statusRadio: 'run',
      statusMap: statusMap,
      // 导出报表数据
      ExportList: {
        selected: {
          key: 'current',
          value: '当前页'
        },
        items: {
          current: '当前页'
        },
        list: [],
        filterVal: [
          'JOBID',
          'UUID',
          'STAT',
          'UserName',
          'TotalCost',
          'time',
          'QueueName',
          'ProjectName',
          'JobGroup',
          'SubmissionHostName',
          'SUBMIT_TIME',
          'ExecuteTime',
          'EndTime',
          'JobDescription'
        ],
        tHeader: [
          'Id',
          'UUID',
          '作业状态',
          '用户名',
          '费用',
          '运行时长',
          '队列名',
          '项目名',
          '作业组',
          '作业提交主机',
          '作业提交时间',
          '作业开始执行时间',
          '作业结束时间',
          '描述'
        ]
      },
      // 计时器
      setTime: null,
      // 查询数据
      selected: {
        items: [
          {
            value: 'job_id',
            label: '作业ID'
          },
          {
            value: 'username',
            label: '用户名'
          },
          {
            value: 'queue_name',
            label: '队列名'
          },
          {
            value: 'host_name',
            label: '执行主机'
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
      colConfigs: [
        { slot: 'JOBID' },
        { slot: 'STAT' },
        { slot: 'SUBMIT_TIME' },
        { prop: 'QUEUE', label: '队列名' },
        { prop: 'USER', label: '提交用户' },
        { prop: 'FROM_HOST', label: '提交主机' },
        { prop: 'EXEC_HOST', label: '执行主机' }
      ],
      taskData: [],
      loading: false,
      sidepagedata: {
        list: {},
        sidepageShow: false
      },
      query: '',
      sort: true
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'name'
    ])
  },
  watch: {
    statusRadio() {
      this.getList()
    },
    dateTime(v) {
      if (!v) {
        return
      }
      this.getList()
    }
  },
  beforeDestroy() {
    this.stop()
  },
  mounted() {
    if (this.$route.params.select) {
      this.getList(this.$route.params)
    } else {
      this.getList()
    }
    this.getList()
    this.start(50000)
  },
  methods: {
    async getList() {
      const _this = this
      _this.loading = true
      _this.taskData = []
      let username
      if (_this.name === 'root' || _this.name === 'admin') {
        username = 'all'
        _this.selected.items = [
          {
            value: 'job_id',
            label: '作业ID'
          },
          {
            value: 'username',
            label: '用户名'
          },
          {
            value: 'queue_name',
            label: '队列名'
          },
          {
            value: 'host_name',
            label: '执行主机'
          }
        ]
      } else {
        username = _this.name
        _this.selected.items = [
          {
            value: 'job_id',
            label: '作业ID'
          },
          {
            value: 'queue_name',
            label: '队列名'
          },
          {
            value: 'host_name',
            label: '执行主机'
          }
        ]
      }
      const params = {
        username: username,
        page_size: _this.page.pageSize,
        page_number: _this.page.currentPage,
        job_status: this.statusRadio,
        reverse: this.sort
      }

      if (this.query && this.query.value !== '') {
        params[this.query.select] = this.query.value
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
        _this.ExportList.list = _this.taskData
        _this.loading = false
      } catch (e) {
        _this.loading = false
        console.log(e)
      }
    },

    sortChange() {
      this.sort = !this.sort
      this.getList()
    },
    searchChanged(obj) {
      this.page.currentPage = 1
      this.query = obj
      this.getList()
    },

    start(time) {
      const _this = this
      clearInterval(_this.setTime)
      _this.setTime = setInterval(function() {
        _this.getList()
      }, time)
    },

    stop() {
      const _this = this
      clearInterval(_this.setTime)
      _this.setTime = null
    },

    // 导出报表
    ExportChanged(data) {
      const _this = this
      if (data.key === 'current') {
        _this.ExportList.list = _this.taskData
      }
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
    }
  }
}
</script>
<style lang="scss" scoped>
.head-button {
  margin-right: 10px;
}
.datePicker {
  margin-right: 10px;
}
.head-radio {
  margin-right: 10px;
}
</style>

