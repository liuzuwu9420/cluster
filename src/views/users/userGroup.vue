<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus" /> 创建用户组
          </el-button>
          <search :items="selected.items" @change="searchChanged" />
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right" /> 刷新
          </el-button>
          <el-button type="primary" size="mini" @click="sync">
            <i class="el-icon-refresh" /> 同步
          </el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="devices"
          element-loading-text="Loading"
          fit
          highlight-current-row
          style="width: 100%"
          max-height="610px"
        >
          <el-table-column label="ID" width="150">
            <template v-slot="{row}">
              <span>{{ row.groupID }}</span>
            </template>
          </el-table-column>

          <el-table-column label="名称">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.groupName" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.groupName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户">
            <template v-slot="{row}">
              <span v-for="(item, index) in row.users" :key="index" class="userLink" @click="getUserID(item)">&nbsp;{{ item.UserName?item.UserName:'' }}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="描述">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.description" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.description }}</span>
            </template>
          </el-table-column>-->
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
import {
  GetUserGroupList,
  GetGroupIDList,
  GetGroupIDUser,
  CreateUserGroup,
  ChangeUserGroup,
  DeleteUserGroup
} from '@/api/role'
import { syncGroup } from '@/api/sync'

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
          },
          {
            value: 'ID',
            label: 'ID'
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
      devices: [],
      loading: false,
      dialogCreating: false,
      titleHead: '',
      // 节点添加信息
      create: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    devices() {
      this.page.total = this.devices.length
    }
  },
  created() {
    this.getList()
    if (this.$route.params.data) {
      this.getList(this.$route.params.data)
    } else {
      this.getList()
    }
  },
  methods: {
    getList() {
      const _this = this
      _this.loading = true
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
      GetUserGroupList()
        .then(res => {
          _this.devices = []
          res.Inventory.map(async function(item, index) {
            try {
              const data = await GetGroupIDUser(item.groupID)
              item.users = data.Inventory
              // 保存一份原始数据，便于取消编辑的时候还原数据
              const original = _this._.cloneDeep(item)
              item.original = original
              _this.$set(item, 'edit', false)
              _this.devices.push(item)
            } catch (e) {
              _this.$message({
                type: 'error',
                message: '获取失败'
              })
            }
          })
          // _this.page.total = _this.devices.length
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
        })
    },

    saveEntity() {
      this.dialogCreating = true
      this.titleHead = '新建用户组'
    },
    // 添加节点
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const _this = this
          const params = {
            name: _this.create.name,
            description: _this.create.description
          }
          CreateUserGroup(params)
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

    // 同步
    sync() {
      const _this = this
      syncGroup()
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
    },

    // 搜索
    searchChanged(data) {
      const _this = this
      if (data.select === 'name') {
        _this.$message({
          message: '名称暂时无法查询',
          type: 'warning',
          duration: 1000
        })
      } else if (data.select === 'ID') {
        _this.loading = true
        GetGroupIDList(data.value)
          .then(async res => {
            _this.devices = []
            const Inv = res.Inventory
            try {
              const data = await GetGroupIDUser(Inv.groupID)
              Inv.users = data.Inventory
              // 保存一份原始数据，便于取消编辑的时候还原数据
              const original = _this._.cloneDeep(Inv)
              Inv.original = original
              _this.$set(Inv, 'edit', false)
              _this.devices.push(Inv)
            } catch (e) {
              _this.$message({
                type: 'error',
                message: '获取失败'
              })
            }
            /* _this.page.total = res.data.pageResultData.totalDataNumber;
          _this.page.pageCount = res.data.pageResultData.totalCount; */
            _this.loading = false
          })
          .catch(res => {
            console.log(res)
          })
      }
    },

    // 跳转用户
    getUserID(data) {
      /* const _this = this
      _this.$router.push({
        name: 'role.user',
        params: {
          data: data
        }
      }) */
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
        .$confirm('此操作将删除该用户组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          const params = {
            _id: row._id
          }
          DeleteUserGroup(params)
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
      row.groupName = row.original.groupName
      row.users = row.original.users
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
      if (row.groupName !== '') {
        params.newOption.groupName = row.groupName
      }
      if (row.description !== '') {
        params.newOption.description = row.description
      }

      await ChangeUserGroup(params)
      row.original.groupName = row.groupName
      row.original.users = row.users
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
  margin-left: 10px;
}

.hasten .headBut {
  margin-right: 10px;
  margin-left: 0px;
  float: left;
}

.pagination {
  text-align: right;
}

.app-container .el-table .userLink {
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
