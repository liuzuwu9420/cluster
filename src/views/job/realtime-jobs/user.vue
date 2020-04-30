<template>
  <div class="app-container" @click="closeSidepage($event)">
    <div class="head">
      <div class="head-buttons">
        <el-button type="primary" size="small" class="head-button" @click="getList">
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
          @pagination="getList()"
        />
      </div>
    </div>
    <div class="table-info ">
      <Table ref="table" :data="users" :col-configs="colConfigs" :loading="loading">
        <el-table-column slot="user" label="用户" width="200px" align="center">
          <template v-slot="{row}">
            <span>
              <el-button type="text" @click="showSidepage(row)">{{ row['USER/GROUP'] }}</el-button>
            </span>
          </template>
        </el-table-column>
      </Table>
      <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" />
    </div>
  </div>
</template>

<script>
import { GetLsfUsersTask } from '@/api/task'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Table from '@/components/Table'
import Sidepage from './Sidepage/userTaskSidepage'
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
      selected: { items: [{ value: 'name', label: '用户名' }] },
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      users: [],
      loading: false,
      // Sidepage
      sidepagedata: {
        list: {},
        sidepageShow: false,
        TaskShow: false
      },
      colConfigs: [
        { slot: 'user' },
        { prop: 'JL/U', label: 'JL/U' },
        { prop: 'MAX', label: 'MAX' },
        { prop: 'NJOBS', label: 'NJOBS' },
        { prop: 'PEND', label: 'PEND' },
        { prop: 'RUN', label: 'RUN' },
        { prop: 'SSUSP', label: 'SSUSP' },
        { prop: 'USUSP', label: 'USUSP' },
        { prop: 'RSV', label: 'RSV' }
      ]
    }
  },
  computed: {
    /* activeUser() {
      if (!this.users[0]) { return }
      const user = JSON.parse(JSON.stringify(this.users[0]))
      delete user['USER/GROUP']
      return user
    } */
  },
  mounted() {
    if (this.$route.params.select) {
      this.searchChanged(this.$route.params)
    } else {
      this.getList()
    }
  },
  methods: {
    getList(query) {
      const _this = this
      _this.loading = true
      const params = {
        page_size: _this.page.pageSize,
        page_number: _this.page.currentPage
      }
      if (query) {
        params.user_name = query
      }
      GetLsfUsersTask(params)
        .then(res => {
          _this.users = []
          res.RECORDS.map(function(item, index) {
            item.MAX = _this.changeStrJL(item.MAX)
            item['JL/P'] = _this.changeStrJL(item['JL/P'])
            _this.users.push(item)
          })
          _this.page.total = res.USERS
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
          _this.loading = false
        })
    },

    // 将字符为空转换为'-'
    changeStrJL(data) {
      if (data) {
        return data
      }
      data = '-'
      return data
    },

    // 搜索
    searchChanged(data) {
      const _this = this
      _this.page.currentPage = 1
      if (data.value === '') {
        _this.getList()
      } else {
        _this.getList(data.value)
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
