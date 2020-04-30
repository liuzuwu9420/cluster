<template>
  <div class="app-container" @click="closeSidepage($event)">
    <div class="head">
      <div class="datePicker">
        <el-date-picker
          v-model="dateTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </div>
      <div class="head-buttons">
        <el-button type="primary" size="small" class="head-button" @click="resetPage">
          <i class="el-icon-refresh-right" />
        </el-button>
      </div>
      <export-excel
        :list.sync="ExportList.list"
        :filter-val="ExportList.filterVal"
        :t-header="ExportList.tHeader"
        :items="ExportList.items"
        :selected="ExportList.selected"
        class="head-button"
        @change="ExportChanged"
      />
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
    <div class="table-info">
      <Table ref="table" :data="taskData" :col-configs="colConfig" :loading="loading" :sort-change="sortChange">
        <el-table-column slot="alertname" align="center" width="150" label="名称" prop="alertname">
          <template v-slot="{row}">
            <span>
              <el-button type="text" @click="showSidepage(row)">{{ row.alertname }}</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          slot="severity"
          label="报警级别"
          align="center"
          width="100"
        >
          <template v-slot="{row}">
            <el-tag size="mini" :type="statusObj(row).type">{{ statusObj(row).name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column slot="summary" align="center" label="消息内容" prop="summary" show-overflow-tooltip>
          <template v-slot="{row}">
            <span>
              {{ row.summary }}
            </span>
          </template>
        </el-table-column>
      </Table>
      <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import ExportExcel from '@/components/ExportExcel'
import { getEsDataBySql } from '@/api/elasticsearch'
import { formatDate } from '@/utils/format'
import Sidepage from './Sidepage/list'
import SidepageMixin from '@/mixin/toggleSidepage'

const statusMap = {
  紧急: {
    name: '紧急',
    type: 'danger'
  },
  非常严重: {
    name: '非常严重',
    type: 'danger'
  },
  严重告警: {
    name: '严重告警',
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
  name: 'AlarmList',
  components: {
    Table,
    Pagination,
    Sidepage,
    ExportExcel
  },
  mixins: [SidepageMixin],
  data() {
    return {
      statusMap: statusMap,
      dateTime: [new Date(new Date().getTime() - 3600 * 1000 * 24), new Date()],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近1小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近6小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 12)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 导出报表数据
      ExportList: {
        selected: {
          key: 'current',
          value: '当前时间范围'
        },
        items: {
          current: '当前时间范围'
        },
        list: [],
        filterVal: [
          'alertname',
          'severity',
          'instance',
          'summary',
          'startsAt'
        ],
        tHeader: [
          '名称',
          '报警级别',
          '节点IP',
          '消息内容',
          '消息时间'
        ]
      },
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      colConfig: [
        { slot: 'alertname' },
        { slot: 'severity' },
        { prop: 'instance', label: '节点IP' },
        { slot: 'summary' },
        { prop: 'startsAt', label: '消息时间', sortable: 'custom' }
      ],
      sidepagedata: {
        list: {},
        sidepageShow: false
      },
      taskData: [],
      loading: false,
      billRules: {},
      query: {},
      sort: { prop: 'startsAt', order: 'DESC' }
    }
  },
  watch: {
    dateTime(val) {
      if (!val) {
        this.taskData = []
        return
      }
      if ((typeof val[0]) === 'string') {
        val[0] = new Date(val[0])
        val[1] = new Date(val[1])
      }
      this.resetPage()
    }
  },
  created() {
    this.debounceGetList = this._.debounce(this.getList, 300)
  },
  mounted() {
    this.getList()
  },
  methods: {
    statusObj(row) {
      if (row.severity) {
        return statusMap[row.severity]
      } else {
        return statusMap['未知']
      }
    },
    resetPage() {
      this.page.currentPage = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      let data = {}
      const sortString = this.sort.prop ? ` ORDER BY alerts.${this.sort.prop} ${this.sort.order}` : ''
      data = {
        'query': `SELECT * FROM prometheus-alert  WHERE 
        alerts.startsAt> '${this.dateTime[0].toISOString()}' and alerts.startsAt< '${this.dateTime[1].toISOString()}'
        ${sortString}
        limit ${(this.page.currentPage - 1) * this.page.pageSize},${this.page.pageSize}`
      }
      const res = await getEsDataBySql(data)
      this.taskData = this.freshAlarmData(res)
      this.page.total = res.hits.total.value
      this.loading = false
    },

    // 导出报表
    async ExportChanged(data) {
      const _this = this
      /* if (data.key === 'current') {
        _this.ExportList.list = _this.taskData
      } */
      let params = {}
      const sortString = this.sort.prop ? ` ORDER BY alerts.${this.sort.prop} ${this.sort.order}` : ''
      params = {
        'query': `SELECT * FROM prometheus-alert  WHERE 
        alerts.startsAt> '${this.dateTime[0].toISOString()}' and alerts.startsAt< '${this.dateTime[1].toISOString()}'
        ${sortString}
        limit 0,5000`
      }
      const res = await getEsDataBySql(params)
      _this.ExportList.list = _this.freshAlarmData(res)
    },

    freshAlarmData(res) {
      const arr = []
      const resData = res.hits.hits
      resData.map((item) => {
        item._source.alerts.map((alertItem) => {
          const obj = JSON.parse(JSON.stringify(alertItem.labels))
          obj.summary = alertItem.annotations.summary
          obj.description = alertItem.annotations.description ? alertItem.annotations.description : ''
          obj.startsAt = formatDate(alertItem.startsAt)
          obj.endsAt = formatDate(alertItem.endsAt)
          arr.push(obj)
        })
      })
      return arr
    },

    sortChange() {
      this.sort.prop = arguments[0].prop
      this.sort.order = arguments[0].order === 'descending' ? 'DESC' : 'ASC'
      this.debounceGetList()
    }

  }
}
</script>
<style scoped lang="scss">
.datePicker, .head-buttons{
  margin-right: 10px;
}
</style>
