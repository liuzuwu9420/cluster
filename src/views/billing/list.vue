<template>
  <div class="app-container">
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
      <div class="search">
        <search :items="selected.items" :visiable="false" @change="searchChanged" />
      </div>
      <div class="pagination">
        <pagination
          v-show="page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="debounceGetList"
        />
      </div>
    </div>
    <div class="table-info">
      <Table ref="table" :data="taskData" :col-configs="colConfig" :loading="loading" :sort-change="sortChange">
        <el-table-column slot="jobId" align="center" width="150" sortable="custom" label="ID" prop="job_id">
          <template v-slot="{row}">
            <span>
              <el-button type="text">{{ row.job_id }}</el-button>
            </span>
          </template>
        </el-table-column>
      </Table>
      <!-- <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" /> -->
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Table from '@/components/Table'
import { getEsDataBySql } from '@/api/elasticsearch'
import { formatDate, formatDiff, formatFloat } from '@/utils/format'
import { debounce } from '@/utils/index'
// import Sidepage from './Sidepage/index'

const statusMap = {
  DONE: {
    name: 'DONE',
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
  name: 'BillList',
  components: {
    Table,
    Pagination,
    Search
    // Sidepage
  },
  data() {
    return {
      statusMap: statusMap,
      dateTime: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
      pickerOptions: {
        shortcuts: [
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
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3)
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
      selected: {
        items: [
          {
            value: 'job_id',
            label: '作业id'
          },
          {
            value: 'queue_name',
            label: '队列名'
          },
          {
            value: 'user_name',
            label: '用户名'
          }
        ]
      },
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      colConfig: [
        { slot: 'jobId' },
        { prop: 'queue_name', label: '队列名' },
        { prop: 'user_name', label: '用户名' },
        { prop: 'run_duration', label: '运行时长' },
        { prop: 'start_time', label: '开始时间' },
        { prop: 'end_time', label: '结束时间' },
        { prop: 'job_cost', label: '费用(元)', sortable: 'custom' }
      ],
      //   sidepagedata: {
      //     list: {},
      //     sidepageShow: false
      //   },
      taskData: [],
      loading: false,
      //   billRules: {},
      query: {},
      sort: { prop: 'job_id', order: 'DESC' }
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
  mounted() {
    this.getList()
  },
  methods: {
    resetPage() {
      this.page.currentPage = 1
      this.getList()
    },
    debounceGetList() {
      debounce(this.getList, 300)()
    },
    async getList() {
      this.loading = true
      let data = ``
      let queryString = ''
      if (this.query.value) {
        queryString = this.query.select === 'job_id' ? `and ${this.query.select}=${this.query.value}` : `and ${this.query.select}='${this.query.value}'`
      }
      const sortString = this.sort.prop ? ` ORDER BY ${this.sort.prop} ${this.sort.order}` : ''
      data = {
        'query': `SELECT * FROM lsf-acct-cost
        WHERE start_time> '${this.dateTime[0].toISOString()}' and end_time< '${this.dateTime[1].toISOString()}'
        ${queryString}
        ${sortString}
        limit ${(this.page.currentPage - 1) * this.page.pageSize},${this.page.pageSize}`
      }
      const res = await getEsDataBySql(data)
      const resData = res.hits
      this.taskData = resData.hits.map((item) => {
        item._source.job_cost = formatFloat(item._source.job_cost)
        item._source.run_duration = formatDiff(null, null, item._source.run_duration)
        item._source.end_time = formatDate(item._source.end_time)
        item._source.start_time = formatDate(item._source.start_time)
        return item._source
      })
      this.page.total = resData.total.value
      this.loading = false
    },

    searchChanged(obj) {
      if (obj.select === 'job_id') {
        obj.value = parseInt(obj.value)
      }
      this.query = obj
      this.resetPage()
    },
    sortChange() {
      this.sort.prop = arguments[0].prop
      this.sort.order = arguments[0].order === 'descending' ? 'DESC' : 'ASC'
      this.debounceGetList()
    },

    statusObj(row) {
      if (row.job_status) {
        return statusMap[row.job_status]
      } else {
        return {
          name: 'Unknown',
          type: 'info',
          icon: 'el-icon-circle-close'
        }
      }
    }

    // 显示Sidepage
    // showSidepage(row) {
    //   this.$refs.table.$refs['el-table'].setCurrentRow(row)
    //   this.sidepagedata.list = row
    //   this.sidepagedata.sidepageShow = true
    //   this.$nextTick(() => {
    //     const currentColEl = this.$refs.table.$el.querySelector('.el-table__row>td:first-child')
    //     const sidepageEl = this.$refs.Sidepage.$el
    //     this.$nextTick(() => {
    //       sidepageEl.style.left = `${currentColEl.offsetWidth - 0.5}px`
    //     })
    //   })
    // },

    // // 点击其它区域边页隐藏
    // closeSidepage(event) {
    //   if (this.$refs.table) {
    //     const elTableEl = this.$refs.table.$refs['el-table'].$el
    //     const elTable = this.$refs.table.$refs['el-table']
    //     if (this.$refs.Sidepage) {
    //       const sidepageEl = this.$refs.Sidepage.$el
    //       if (!elTableEl.contains(event.target) && !sidepageEl.contains(event.target)) {
    //         this.sidepagedata.sidepageShow = false
    //         elTable.setCurrentRow()
    //       }
    //     } else {
    //       if (!elTableEl.contains(event.target) && elTableEl.querySelector('.current-row')) {
    //         elTable.setCurrentRow()
    //       }
    //     }
    //   }
    // }
  }
}
</script>
<style scoped lang="scss">
.datePicker{
  margin-right: 10px;
}
</style>
