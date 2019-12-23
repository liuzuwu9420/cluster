<template>
  <div class="app-container" @click="closeSidepage($event)">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right" /> 刷新
          </el-button>
          <search :items="selected.items" @change="searchChanged" />
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
        <div class="table-info el-scrollbar">
          <el-table
            ref="tableSidepage"
            v-loading="loading"
            :data="hosts"
            element-loading-text="Loading"
            fit
            highlight-current-row
            style="width: 100%; cursor: pointer;"
            height="100%"
            @row-click="showSidepage"
          >
            <el-table-column label="节点名" width="120">
              <template v-slot="{row}">
                <span>{{ row.HOST_NAME }}</span>
              </template>
            </el-table-column>
            <el-table-column label="节点状态">
              <template v-slot="{row}">
                <el-tag :type="statusMap[row.STATUS].type">
                  {{ row.STATUS | STATUS }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="RUN">
              <template v-slot="{row}">
                <span>{{ row.RUN }}</span>
              </template>
            </el-table-column>
            <el-table-column label="NJOBS">
              <template v-slot="{row}">
                <span>{{ row.NJOBS }}</span>
              </template>
            </el-table-column>
            <el-table-column label="JL/U">
              <template v-slot="{row}">
                <span>{{ row.JL }}</span>
              </template>
            </el-table-column>
            <el-table-column label="MAX">
              <template v-slot="{row}">
                <span>{{ row.MAX }}</span>
              </template>
            </el-table-column>
            <el-table-column label="RSV">
              <template v-slot="{row}">
                <span>{{ row.RSV }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SSUSP">
              <template v-slot="{row}">
                <span>{{ row.SSUSP }}</span>
              </template>
            </el-table-column>
            <el-table-column label="USUSP">
              <template v-slot="{row}">
                <span>{{ row.USUSP }}</span>
              </template>
            </el-table-column>
          </el-table>
          <sidepage ref="SidepageName" :sidepagedata.sync="sidepagedata" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  GetLsfHostList,
  GetLsfHostName
} from '@/api/task'

import Pagination from '@/components/Pagination'
import Search from '@/components/Search'

import Sidepage from './components/Sidepage/hostSidepage'

const statusMap = {
  ok: {
    name: 'ok',
    type: 'success'
  },
  closed_Cu_excl: {
    name: 'closed_Cu_excl',
    type: 'danger'
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
    Sidepage
  },
  filters: {
    STATUS(STATUS) {
      return statusMap[STATUS].name
    }
  },
  data() {
    return {
      statusMap: statusMap,
      // 查询数据
      selected: {
        items: [
          {
            value: 'name',
            label: '名称'
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
      }
    }
  },
  created() {
    if (this.$route.params.select) {
      this.searchChanged(this.$route.params)
    } else {
      this.getList()
    }
  },
  methods: {
    getList() {
      const _this = this
      _this.loading = true
      const params = {
        page: {
          PageNumber: _this.page.currentPage, // 当前页数
          PageSize: _this.page.pageSize // 每一页显示条数
        }
      }
      GetLsfHostList(params)
        .then(res => {
          _this.hosts = res.Inventory.ResultData.map(item => {
            item.JL = item['JL/U']
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
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
        _this.loading = true
        GetLsfHostName(data.value)
          .then(res => {
            _this.hosts = []
            _this.hosts.push(res.Inventory)
            _this.page.total = _this.hosts.length
            _this.loading = false
          })
          .catch(res => {
            console.log(res)
            _this.loading = false
          })
      }
    },

    // 显示Sidepage
    showSidepage(row, column, event) {
      const _this = this
      const FixedCli = this.$refs.tableSidepage.$refs.rightFixedWrapper
      if (!FixedCli || !FixedCli.contains(event.target)) {
        _this.$refs.tableSidepage.setCurrentRow(row)
        _this.sidepagedata.list = row
        _this.sidepagedata.sidepageShow = true
      }
    },

    // 点击其它区域边页隐藏
    closeSidepage(event) {
      if (this.$refs.tableSidepage && this.$refs.SidepageName) {
        const currentCli1 = this.$refs.tableSidepage.$refs.bodyWrapper.firstChild
        const currentCli2 = this.$refs.SidepageName.$el
        if (currentCli1 && currentCli2) {
          if (!currentCli1.contains(event.target) && !currentCli2.contains(event.target)) { // 点击到了id为sellineName以外的区域，隐藏下拉框
            this.sidepagedata.sidepageShow = false
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.hasten {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 5px 10px;
}
/*.hasten .el-form-item__content {
		width: 300px;
	}*/

.hasten .el-button {
  height: 36px;
  line-height: 0;
  float: left;
  margin-right: 10px;
  margin-left: 0px;
}

.hasten .headBut {
  margin-right: 10px;
  margin-left: 0px;
  float: left;
}

.pagination {
  float: right;
}

.table-info {
  height: calc(100vh - 140px);
  overflow: auto;
}

.table-expand {
  font-size: 0;
}

.table-expand label {
  width: 90px;
  color: #99a9bf;
}

.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 30%;
}

.JobInfoSidepage {
  color: #3c73b9;
  cursor: pointer;
}

.JobInfoSidepage:hover {
  color: #1890ff;
  text-decoration:underline;
}
</style>
