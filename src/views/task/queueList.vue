<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus" /> 创建队列
          </el-button>
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right" /> 刷新
          </el-button>
          <el-button type="primary" size="mini" @click="sync">
            <i class="el-icon-refresh" /> 同步
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
            <el-table-column label="队列">
              <template v-slot="{row}">
                <span>{{ row.QUEUE_NAME }}</span>
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

                  <!-- 查看详情 -->
                  <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                    <el-button
                      v-if="!row.edit"
                      type="success"
                      icon="el-icon-view"
                      size="mini"
                      @click="info(row)"
                    />
                  </el-tooltip>
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
        <el-dialog :title="titleHead" :visible.sync="dialogCreating" width="40%">
          <el-form
            ref="create"
            :model="create"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="队列名" prop="name">
              <el-input v-model="create.name" class="formInp" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('create')">立即创建</el-button>
              <el-button @click="resetForm('create')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  GetQueueList
} from '@/api/task'

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
        total: 1
      },
      queues: [],
      loading: false,
      dialogCreating: false,
      titleHead: '',
      // 节点添加信息
      create: {
        name: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入队列名',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(query) {
      const _this = this
      _this.loading = true
      const obj = {}
      if (query) {
        if (query.select === 'name') {
          obj.QUEUE_NAME = query.value
        }
      }
      const params = {
        page: {
          PageNumber: _this.page.currentPage, // 当前页数
          PageSize: _this.page.pageSize // 每一页显示条数
        }
      }
      GetQueueList(params)
        .then(res => {
          _this.queues = []
          res.Inventory.ResultData.map(function(item, index) {
            // 保存一份原始数据，便于取消编辑的时候还原数据
            const original = _this._.cloneDeep(item)
            item.original = original
            _this.$set(item, 'edit', false)
            _this.queues.push(item)
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
        _this.getList(data)
      }
    },

    saveEntity() {
      this.dialogCreating = true
      this.titleHead = '添加队列'
    },
    // 添加节点
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const _this = this
          const params = {
            QUEUE_NAME: _this.create.name
          }
          /* CreateUser(params)
            .then(res => {
              _this.getList()
              _this.dialogCreating = false
              _this.$message({
                type: 'success',
                message: '添加成功!'
              })
            })
            .catch(res => {
              _this.$message({
                type: 'error',
                message: '添加失败'
              })
            }) */
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    // 同步
    sync() {
      const _this = this
      /* syncUser()
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
        }) */
    },

    // 查看用户详情
    info(device) {
      /* this.$router.push({
        name: "device.info",
        params: {
          device: device
        }
      }); */
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
          const params = {

          }
          /* DeleteUser(params)
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
