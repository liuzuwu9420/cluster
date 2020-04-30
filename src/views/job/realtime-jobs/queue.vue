<template>
  <div id="queueList" class="app-container" @click="closeSidepage($event)">
    <div class="head">
      <div class="head-buttons">
        <el-button type="primary" size="small" class="head-button" @click="getList">
          <i class="el-icon-refresh-right" />
        </el-button>
        <search :items="selected.items" class="head-button" @change="searchChanged" />
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
      <Table ref="table" :data="queues" :col-configs="colConfigs" :loading="loading">
        <el-table-column slot="queueName" label="队列" align="center" width="200">
          <template slot-scope="{ row }">
            <span><el-button type="text" @click="showSidepage(row)">{{ row.QUEUE_NAME }}</el-button></span>
          </template>
        </el-table-column>
      </Table>
      <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" @refresh="getList()" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetLsfQueueList } from '@/api/task'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Table from '@/components/Table'
import Sidepage from './Sidepage/queueSidepage'
import SidepageMixin from '@/mixin/toggleSidepage'

export default {
  components: {
    Pagination,
    Search,
    Sidepage,
    Table
  },
  mixins: [SidepageMixin],
  data() {
    return {
      // 查询数据
      selected: {
        items: [
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
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      queues: [],
      hosts: [],
      loading: false,
      // Sidepage
      sidepagedata: {
        list: {},
        sidepageShow: false,
        TaskShow: false
      },
      colConfigs: [
        { slot: 'queueName' },
        { prop: 'PRIO', label: 'PRIO' },
        { prop: 'STATUS', label: 'STATUS' },
        { prop: 'MAX', label: 'MAX' },
        { prop: 'JL/U', label: 'JL/U' },
        { prop: 'JL/P', label: 'JL/P' },
        { prop: 'JL/H', label: 'JL/H' },
        { prop: 'NJOBS', label: 'NJOBS' },
        { prop: 'PEND', label: 'PEND' },
        { prop: 'RUN', label: 'RUN' },
        { prop: 'SUSP', label: 'SUSP' },
        { slot: 'operate' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'name'
    ])
  },
  mounted() {
    if (this.$route.params.select) {
      this.searchChanged(this.$route.params)
    } else {
      this.getList()
    }
  },
  methods: {
    async getList(query) {
      this.loading = true
      this.queues = []
      const params = {
        page_size: this.page.pageSize,
        page_number: this.page.currentPage
      }
      if (this.name === 'root' || this.name === 'admin') {
        this.selected.items = [
          {
            value: 'queue_name',
            label: '队列名'
          },
          {
            value: 'user_name',
            label: '用户名'
          }
        ]
        if (query) {
          params[query.select] = query.value
        }
      } else {
        this.selected.items = [
          {
            value: 'queue_name',
            label: '队列名'
          }
        ]
        params.user_name = this.name
        if (query) {
          params.queue_name = query.value
        }
      }
      const res = await GetLsfQueueList(params)
      this.queues = res.RECORDS
      this.page.total = res.QUEUES
      this.loading = false
    },

    // 搜索
    searchChanged(data) {
      const _this = this
      _this.page.currentPage = 1
      if (data.value === '') {
        this.getList()
      } else {
        this.getList(data)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.head-button{
  margin-right: 10px;
}

</style>
