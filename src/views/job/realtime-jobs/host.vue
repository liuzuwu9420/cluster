<template>
  <div class="app-container" @click="closeSidepage($event)">
    <div class="head">
      <div class="head-buttons">
        <el-button size="small" class="head-button" type="primary" @click="getList">
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
          @pagination="getList"
        />
      </div>
    </div>
    <div class="table-info">
      <Table ref="table" :data="hosts" :col-configs="colConfigs" :loading="loading">
        <el-table-column slot="HOST_NAME" label="节点名" width="200" align="center">
          <template v-slot="{row}">
            <span>
              <el-button type="text" @click="showSidepage(row)">{{ row.HOST_NAME }}</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column slot="STATUS" label="节点状态" width="100">
          <template v-slot="{row}">
            <el-tag :type="statusMap[row.STATUS].type">
              {{ row.STATUS | STATUS }}
            </el-tag>
          </template>
        </el-table-column>
      </Table>
      <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" />
    </div>
  </div>
</template>

<script>
import { GetLsfHostList } from '@/api/task'
import ExportExcel from '@/components/ExportExcel'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Table from '@/components/Table'
import Sidepage from './Sidepage/hostSidepage'
import SidepageMixin from '@/mixin/toggleSidepage'

const statusMap = {
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
export default {
  components: {
    Pagination,
    Search,
    Sidepage,
    Table,
    ExportExcel
  },
  filters: {
    STATUS(STATUS) {
      return statusMap[STATUS].name
    }
  },
  mixins: [SidepageMixin],
  data() {
    return {
      statusMap: statusMap,
      // 查询数据
      selected: {
        items: [
          {
            value: 'name',
            label: '主机名'
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
      hosts: [],
      loading: false,
      // Sidepage
      sidepagedata: {
        list: {},
        sidepageShow: false,
        TaskShow: false
      },
      colConfigs: [
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
      ExportList: {
        selected: {
          key: 'current',
          value: '当前状态主机列表'
        },
        items: {
          current: '当前状态主机列表'
        },
        list: [],
        filterVal: [
          'HOST_NAME',
          'STATUS',
          'JL/U',
          'MAX',
          'NJOBS',
          'RUN',
          'SSUSP',
          'USUSP',
          'RSV'
        ],
        tHeader: [
          '主机名',
          '状态',
          'JL/U',
          'MAX',
          'NJOBS',
          'RUN',
          'SSUSP',
          'USUSP',
          'RSV'
        ]
      },
      query: ''
    }
  },
  mounted() {
    if (this.$route.params.select) {
      this.searchChanged(this.$route.params)
    } else {
      this.getList()
    }
  },
  methods: {
    async getList() {
      this.loading = true
      const params = {
        page_size: this.page.pageSize,
        page_number: this.page.currentPage
      }
      if (this.query) {
        params.host_name = this.query
      }
      const res = await GetLsfHostList(params)
      this.hosts = res.RECORDS
      this.page.total = res.HOSTS
      this.ExportList.list = (await GetLsfHostList({ page_size: 10000, page_number: 1 })).RECORDS
      this.loading = false
    },

    // 搜索
    searchChanged(data) {
      this.page.currentPage = 1
      if (data.value === '') {
        this.getList()
      } else {
        this.query = data.value
        this.getList()
      }
    },

    ExportChanged(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.head-button{
  margin-right: 10px;
}
</style>
