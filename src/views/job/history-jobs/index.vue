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
              <el-button type="text" @click="showSidepage(row)">{{ row.job_id }}</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column slot="jobStatus" label="作业状态" align="center" width="130">
          <template v-slot="{row}">
            <el-tag size="mini" :type="statusObj(row).type">
              <i :class="statusObj(row).icon" />
              {{ statusObj(row).name }}
            </el-tag>
          </template>
        </el-table-column>
      </Table>
      <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Table from '@/components/Table'
import { getEsDataBySql } from '@/api/elasticsearch'
import { formatDate, formatDiff } from '@/utils/format'
import { debounce } from '@/utils/index'
import Sidepage from './Sidepage/index'
import SidepageMixin from '@/mixin/toggleSidepage'
import optionMixin from '@/mixin/options'

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
  name: 'TaskList',
  components: {
    Table,
    Pagination,
    Search,
    Sidepage
  },
  mixins: [SidepageMixin, optionMixin],
  data() {
    return {
      statusMap: statusMap,
      dateTime: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
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
        { slot: 'jobStatus' },
        { prop: 'queue_name', label: '队列名' },
        { prop: 'user_name', label: '提交用户' },
        { prop: 'submission_host_name', label: '提交主机' },
        { prop: 'submit_time', label: '提交时间', sortable: 'custom' },
        { prop: 'end_time', label: '结束时间', sortable: 'custom' },
        { prop: 'total_time', label: '运行时长' },
        { prop: 'cost', label: '费用' }
      ],
      sidepagedata: {
        list: {},
        sidepageShow: false
      },
      taskData: [],
      loading: false,
      query: {},
      sort: { prop: 'end_time', order: 'DESC' }
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'name'
    ])
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
      if (this.name === 'root' || this.name === 'admin') {
        if (this.query.value) {
          queryString = this.query.select === 'job_id' ? ` and ${this.query.select}=${this.query.value}` : ` and ${this.query.select}='${this.query.value}'`
        }
        this.selected.items = [
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
        queryString = ` and user_name='${this.name}'`
        this.selected.items = [
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
        if (this.query.value) {
          queryString = queryString + (this.query.select === 'job_id' ? ` and ${this.query.select}=${this.query.value}` : ` and ${this.query.select}='${this.query.value}'`)
        }
      }
      const sortString = this.sort.prop ? ` ORDER BY ${this.sort.prop} ${this.sort.order}` : ''
      data = {
        'query': `SELECT * FROM lsf-acct-raw  WHERE 
        start_time> '${this.dateTime[0].toISOString()}' and end_time< '${this.dateTime[1].toISOString()}'
        ${queryString}
        ${sortString}
        limit ${(this.page.currentPage - 1) * this.page.pageSize},${this.page.pageSize}`
      }
      const res = await getEsDataBySql(data)
      const resData = res.hits
      this.taskData = resData.hits.map((item) => {
        const source = item._source
        source.submit_time = formatDate(source.submit_time)
        source.end_time = formatDate(source.end_time)
        source.total_time = formatDiff(source.submit_time, source.end_time)
        return source
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

  }
}
</script>
<style scoped lang="scss">
.datePicker{
  margin-right: 10px;
}
</style>
