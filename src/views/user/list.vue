<template>
  <div class="app-container" @click="closeSidepage($event)">
    <div class="head">
      <div class="head-buttons">
        <el-button :disabled="roleDisabled || userDisabled" type="primary" size="small" class="head-button">
          <i class="el-icon-plus" />
        </el-button>
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
          @pagination="getList"
        />
      </div>
    </div>
    <div class="table-info">
      <Table ref="table" :data="usersData" :col-configs="colConfigs" :loading="loading">
        <el-table-column slot="username" label="用户" width="200px" align="center">
          <template v-slot="{row}">
            <el-button type="text" @click="showSidepage(row)">{{ row.username }}</el-button>
          </template>
        </el-table-column>
        <el-table-column slot="operate" label="操作" align="center">
          <template v-slot="{row}">
            <el-button
              v-if="!row.edit"
              :disabled="roleDisabled || userDisabled"
              type="primary"
              size="mini"
              @click="row.edit=!row.edit"
            >编辑</el-button>
            <el-button-group v-else>
              <el-button
                type="success"
                size="mini"
                @click="confirmEdit(row)"
              >确认</el-button>
              <el-button
                type="info"
                size="mini"
                @click="cancelEdit(row)"
              >取消</el-button>
            </el-button-group>
            <el-popover
              v-model="row.deleteVisible"
              placement="top"
              trigger="click"
              width="160"
            >
              <p>确定删除配置吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="row.deleteVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteConfig(row)">确定</el-button>
              </div>
              <el-button slot="reference" :disabled="roleDisabled || userDisabled" type="danger" size="mini">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </Table>
      <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetUserList } from '@/api/role'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Table from '@/components/Table'
import Sidepage from './Sidepage/userSidepage'
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
            value: 'user_name',
            label: '用户'
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
      usersData: [],
      loading: false,
      // Sidepage
      sidepagedata: {
        users: {
          userGroup: []
        },
        sidepageShow: false
      },
      colConfigs: [
        { slot: 'username' },
        { prop: 'userID', label: '用户ID' },
        { prop: 'groupID', label: '用户组ID' },
        { prop: 'groupName', label: '用户组' },
        { slot: 'operate', label: '操作' }
      ],
      userDisabled: true
    }
  },
  computed: {
    ...mapGetters([
      'roleDisabled'
    ])
  },
  created() {
    if (this.$route.params.select) {
      this.getList(this.$route.params)
    } else {
      this.getList()
    }
  },
  methods: {
    getList(query) {
      const _this = this
      _this.loading = true
      const params = {
        page_number: _this.page.currentPage, // 当前页数
        page_size: _this.page.pageSize // 每一页显示条数
      }
      if (query && query.select === 'user_name') {
        params.user_name = query.value
      }
      GetUserList(params)
        .then(res => {
          _this.usersData = res.RECORDS
          _this.page.total = res.USERS
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
          _this.loading = false
        })
    },

    // 搜索
    searchChanged(data) {
      const _this = this
      if (data.value === '') {
        _this.getList()
      } else {
        _this.getList(data)
      }
    }

  }
}
</script>

<style scoped lang="scss">
.head-button {
  margin-right: 10px;
  margin-left: 0;
}
</style>
