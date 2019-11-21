<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right" /> 刷新
          </el-button>
          <el-button type="primary" size="mini" @click="sync('cmd')">
            <i class="el-icon-refresh" /> 同步命令
          </el-button>
          <el-button type="primary" size="mini" @click="sync('conf')">
            <i class="el-icon-refresh" /> 同步配置
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
            v-loading="loading"
            :data="queues"
            element-loading-text="Loading"
            fit
            highlight-current-row
            style="width: 100%"
            height="100%"
            max-height="807px"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="table-expand">
                  <el-form-item v-for="(item, index) in props.row.conf" :key="index" :label="item.label">
                    <span>{{ item.value }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="队列">
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
            <el-table-column fixed="right" label="操作" width="200">
              <template v-slot="{row}">
                <el-button-group>
                  <!-- 编辑模式：确定 -->
                  <el-button
                    v-if="row.edit"
                    type="warning"
                    size="mini"
                    icon="el-icon-circle-check-outline"
                    @click="confirmEdit(row)"
                  >确定</el-button>
                  <!-- 编辑模式：取消 -->
                  <el-button
                    v-if="row.edit"
                    type="success"
                    size="mini"
                    icon="el-icon-circle-check-outline"
                    @click="cancelEdit(row)"
                  >取消</el-button>

                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                    <el-button
                      v-if="!row.edit"
                      type="warning"
                      size="mini"
                      icon="el-icon-edit"
                      @click="row.edit=!row.edit"
                    />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                    <el-button
                      v-if="!row.edit"
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      @click="deleteItem(row)"
                    />
                  </el-tooltip>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
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
import { syncCmd, syncConf } from '@/api/sync'

import Pagination from '@/components/Pagination'
import Search from '@/components/Search'

export default {
  components: {
    Pagination,
    Search
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
      loading: false
    }
  },
  created() {
    this.getList()
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
            // 保存一份原始数据，便于取消编辑的时候还原数据
            const original = _this._.cloneDeep(item)
            item.original = original
            _this.$set(item, 'edit', false)
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
              // 保存一份原始数据，便于取消编辑的时候还原数据
            const original = _this._.cloneDeep(res.Inventory)
            res.Inventory.original = original
            _this.$set(res.Inventory, 'edit', false)
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

    // 同步
    sync(data) {
      const _this = this
      if (data === 'cmd') {
        syncCmd()
          .then(res => {
            if (res.Success) {
              _this.getList()
              _this.$message({
                type: 'success',
                message: '同步成功!'
              })
            } else {
              _this.$message({
                type: 'error',
                message: '同步失败!'
              })
            }
          })
          .catch(res => {
            _this.$message({
              type: 'error',
              message: '同步失败'
            })
          })
      } else if (data === 'conf') {
        syncConf()
          .then(res => {
            if (res.Success) {
              _this.getList()
              _this.$message({
                type: 'success',
                message: '同步成功!'
              })
            } else {
              _this.$message({
                type: 'error',
                message: '同步失败!'
              })
            }
          })
          .catch(res => {
            _this.$message({
              type: 'error',
              message: '同步失败'
            })
          })
      }
    },
    // 删除
    async deleteItem(row) {
      const _this = this
      _this
        .$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          /* const params = {

          }DeleteUser(params)
            .then(res => {
              _this.getList()
              _this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(res => {
              _this.$message({
                type: 'error',
                message: '删除失败'
              })
            }) */
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 取消编辑
    cancelEdit(row) {
      row.edit = false
      // 还原数据
      row.QUEUE_NAME = row.original.QUEUE_NAME
    },

    // 确认编辑
    async confirmEdit(row) {
      const params = {

      }
      if (row.name !== '') {
        params.newOption.QUEUE_NAME = row.QUEUE_NAME
      }

      /* await ChangeUser(params) */
      row.original.QUEUE_NAME = row.QUEUE_NAME
      row.edit = false
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

.app-container .el-table .GroupLink {
  cursor: pointer;
  color: #49b0f9;
}

.app-container .el-dialog .el-row .size {
  line-height: 40px;
  padding-left: 12px;
}

.app-container .el-dialog__wrapper:nth-child(4) .el-dialog {
  background: red;
}

.app-container .el-dialog__wrapper:nth-child(4) .el-dialog .el-dialog__header {
  text-align: center;
}

.app-container .el-dialog .formInp {
  width: 95%;
}
</style>
