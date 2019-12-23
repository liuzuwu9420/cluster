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
            :data="queues"
            element-loading-text="Loading"
            fit
            highlight-current-row
            style="width: 100%; cursor: pointer;"
            height="100%"
            @row-click="showSidepage"
          >
            <el-table-column label="队列" width="120">
              <template v-slot="{row}">
                <span>{{ row.QUEUE_NAME }}</span>
              </template>
            </el-table-column>
            <el-table-column label="RUN">
              <template v-slot="{row}">
                <span>{{ row.RUN }}</span>
              </template>
            </el-table-column>
            <el-table-column label="PEND">
              <template v-slot="{row}">
                <span>{{ row.PEND }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SUSP">
              <template v-slot="{row}">
                <span>{{ row.SUSP }}</span>
              </template>
            </el-table-column>
            <el-table-column label="NJOBS">
              <template v-slot="{row}">
                <span>{{ row.NJOBS }}</span>
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
  GetCmdQueueList,
  GetCmdQueueName,
  GetConfQueueName
} from '@/api/task'

import Pagination from '@/components/Pagination'
import Search from '@/components/Search'

import Sidepage from './components/Sidepage'

export default {
  components: {
    Pagination,
    Search,
    Sidepage
  },
  data() {
    return {
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
      queues: [],
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
      GetCmdQueueList(params)
        .then(res => {
          _this.queues = []
          res.Inventory.ResultData.map(function(item, index) {
            GetConfQueueName(item.QUEUE_NAME)
              .then(data => {
                Object.getOwnPropertyNames(data.Inventory).forEach(function(key) {
                  const conf = {
                    label: key,
                    value: data.Inventory[key]
                  }
                  item.conf.push(conf)
                })
              })
            if (item.conf) {
              _this.queues.push(item)
            } else {
              item.conf = []
              _this.queues.push(item)
            }
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
        GetCmdQueueName(data.value)
          .then(res => {
            _this.queues = []
            GetConfQueueName(res.Inventory.QUEUE_NAME)
              .then(data => {
                Object.getOwnPropertyNames(data.Inventory).forEach(function(key) {
                  const conf = {
                    label: key,
                    value: data.Inventory[key]
                  }
                  res.Inventory.conf.push(conf)
                })
              })
            if (res.Inventory.conf) {
              _this.queues.push(res.Inventory)
            } else {
              res.Inventory.conf = []
              _this.queues.push(res.Inventory)
            }
            _this.page.total = _this.queues.length
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
