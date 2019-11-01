<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus" /> 创建计费组
          </el-button>
          <search :items="selected.items" @change="searchChanged" />
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right" /> 刷新
          </el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="devices"
          element-loading-text="Loading"
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="ID" width="120">
            <template v-slot="{row}">
              <span>{{ row.ID }}</span>
            </template>
          </el-table-column>

          <el-table-column label="名称" width="110">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.name" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收费比率" width="140">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.ratio" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.ratio }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已使用金额" width="140">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.useMoney" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.useMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" width="140">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.description" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.description }}</span>
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
        <el-dialog :title="titleHead" :visible.sync="dialogCreating" width="50%">
          <el-form
            ref="create"
            :model="create"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="名称" prop="name">
              <el-input v-model="create.name" class="formInp" />
            </el-form-item>
            <el-form-item label="收费比率" prop="ratio">
              <el-input v-model="create.ratio" class="formInp">
                <template slot="append">元每CPU&times;小时</template>
              </el-input>
            </el-form-item>
            <el-form-item label="初始金额" prop="money">
              <el-input v-model="create.money" class="formInp">
                <template slot="append">￥</template>
              </el-input>
            </el-form-item>
            <el-form-item class="formInp" label="描述" prop="description">
              <el-input
                v-model="create.description"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('create')">立即创建</el-button>
              <el-button @click="resetForm('create')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-main>
      <el-footer class="pagination">
        <pagination
          v-show="page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="getList"
        />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { GetBillList, CreateBill, ChangeBill, DeleteBill } from '@/api/role'

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
        pageSize: 5,
        total: 1
      },
      devices: [],
      loading: false,
      dialogCreating: false,
      titleHead: '',
      // 节点添加信息
      create: {
        name: '',
        ratio: '',
        money: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        ratio: [
          {
            required: true,
            message: '请输入收费比率',
            trigger: 'blur'
          }
        ],
        money: [
          {
            required: true,
            message: '请输入初始金额',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    // this.getList();
  },
  methods: {
    getList() {
      const _this = this
      const params = {
        pageOption: {
          pageNumber: _this.page.currentPage, // 当前页数
          pageSize: _this.page.pageSize // 每一页显示条数
        },
        selectOption: {}
      }
      if (_this.searchValue !== '') {
        params.selectOption.name = _this.searchValue
      }
      GetBillList(params)
        .then(res => {
          // _this.devices = []
          _this.devices = res.data.result.nodeData.map(function(item, index) {
            // 保存一份原始数据，便于取消编辑的时候还原数据
            const original = _this._.cloneDeep(item)
            item.original = original
            _this.$set(item, 'edit', false)
            return item
          })
          _this.page.total = res.data.pageResultData.totalDataNumber
          _this.page.pageCount = res.data.pageResultData.totalCount
        })
        .catch(res => {
          console.log(res)
        })
    },

    saveEntity() {
      this.dialogCreating = true
      this.titleHead = '新建计费组'
    },
    // 添加节点
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const _this = this
          const params = {
            name: _this.create.name,
            ratio: _this.create.ratio,
            money: _this.create.money,
            description: _this.create.description
          }
          CreateBill(params)
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
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    // 搜索
    searchChanged(data) {
      console.log(data)
    },

    // 查看详情
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
        .$confirm('此操作将删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          const params = {
            _id: row._id
          }
          DeleteBill(params)
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
            })
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
      row.name = row.original.name
      row.ratio = row.original.ratio
      row.usemoney = row.original.usemoney
      row.description = row.original.description
    },

    // 确认编辑
    async confirmEdit(row) {
      const params = {
        oldOption: {
          _id: row._id
        },
        newOption: {}
      }
      if (row.name !== '') {
        params.newOption.name = row.name
      }
      if (row.ratio !== '') {
        params.newOption.ratio = row.ratio
      }
      if (row.usemoney !== '') {
        params.newOption.usemoney = row.usemoney
      }
      if (row.description !== '') {
        params.newOption.description = row.description
      }

      await ChangeBill(params)
      row.original.name = row.name
      row.original.ratio = row.ratio
      row.original.usemoney = row.usemoney
      row.original.description = row.description
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

.hasten .el-button {
  height: 36px;
  line-height: 0;
  float: right;
}

.hasten .el-input-group {
  float: right;
}

.hasten .headBut {
  margin-right: 10px;
  float: left;
}
.pagination {
  text-align: right;
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
  width: 50%;
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
