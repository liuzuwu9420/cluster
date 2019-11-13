<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus" /> 创建用户
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
            :data="devices"
            element-loading-text="Loading"
            fit
            highlight-current-row
            style="width: 100%"
            height="100%"
            max-height="807px"
          >
            <el-table-column label="ID" width="120">
              <template v-slot="{row}">
                <span>{{ row.uid }}</span>
              </template>
            </el-table-column>

            <el-table-column label="用户">
              <template v-slot="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.username" class="edit-input" size="small" />
                </template>
                <span v-else>{{ row.username }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色" width="110">
              <template v-slot="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.role" class="edit-input" size="small" />
                </template>
                <span v-else>{{ row.role }}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户组">
              <template v-slot="{row}">
                <span v-for="(item, index) in row.group" :key="index" class="GroupLink">
                  <span @click="getGroupID(item)">&nbsp;{{ item.GroupName }}</span>
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="登录时间" width="110">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.logTime" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.logTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="解冻时间" width="110">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.thawingTime" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.thawingTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="冻结状态">
            <template v-slot="{row}">
              <el-switch v-model="row.type" active-color="#13ce66"></el-switch>
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
        </div>
        <el-dialog :title="titleHead" :visible.sync="dialogCreating" width="50%">
          <el-form
            ref="create"
            :model="create"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="name">
              <el-input v-model="create.name" class="formInp" />
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-select v-model="create.role" class="formInp" clearable placeholder="请选择">
                <el-option
                  v-for="item in create.roles"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="计费组" prop="billing">
              <el-select v-model="create.billing" class="formInp" clearable placeholder="请选择">
                <el-option
                  v-for="item in create.billings"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户组" prop="usergroup">
              <el-select v-model="create.usergroup" class="formInp" clearable placeholder="请选择">
                <el-option
                  v-for="item in create.usersgroup"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input v-model="create.pass" class="formInp" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                v-model="create.checkPass"
                class="formInp"
                type="password"
                autocomplete="off"
              />
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
  GetUserList,
  GetIDUserGroup,
  CreateUser,
  DeleteUser,
  ChangeUser
} from '@/api/role'
import { syncUser } from '@/api/sync'

import Pagination from '@/components/Pagination'
import Search from '@/components/Search'

export default {
  components: {
    Pagination,
    Search
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
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
        role: '',
        roles: [
          {
            value: 'admin',
            label: '管理员'
          },
          {
            value: 'user',
            label: '用户'
          }
        ],
        billing: '',
        billings: [
          {
            value: 'default',
            label: 'default'
          },
          {
            value: 'compute',
            label: 'compute'
          }
        ],
        usergroup: '',
        usersgroup: [
          {
            value: 'login01',
            label: 'login01'
          },
          {
            value: 'login02',
            label: 'login02'
          }
        ],
        pass: '',
        checkPass: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'change'
          }
        ],
        billing: [
          {
            required: true,
            message: '请选择计费组',
            trigger: 'change'
          }
        ],
        usergroup: [
          {
            required: true,
            message: '请选择用户组',
            trigger: 'change'
          }
        ],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
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
          obj.username = query.value
        } else if (query.select === 'ID') {
          obj.uid = query.value
        }
      }
      const params = {
        page: {
          PageNumber: _this.page.currentPage, // 当前页数
          PageSize: _this.page.pageSize // 每一页显示条数
        },
        query: obj
      }
      GetUserList(params)
        .then(res => {
          _this.devices = []
          res.Inventory.ResultData.map(async function(item, index) {
            try {
              const data = await GetIDUserGroup(item.uid)
              item.group = data.Inventory
              // 保存一份原始数据，便于取消编辑的时候还原数据
              const original = _this._.cloneDeep(item)
              item.original = original
              _this.$set(item, 'role', '用户')
              _this.$set(item, 'edit', false)
              _this.devices.push(item)
            } catch (e) {
              _this.$message({
                type: 'error',
                message: '获取失败'
              })
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
      _this.getList(data)
      /* if (data.select === 'name') {
        _this.$message({
          message: '名称暂时无法查询',
          type: 'warning',
          duration: 1000
        })
      } else if (data.select === 'ID') {
        _this.loading = true
        GetIDUser(data.value)
          .then(res => {
            _this.devices = []
            _this.devices.push(res.Inventory)
            _this.devices = _this.devices.map(function(item, index) {
              // 保存一份原始数据，便于取消编辑的时候还原数据
              const original = _this._.cloneDeep(item)
              item.original = original
              _this.$set(item, 'role', '用户')
              _this.$set(item, 'edit', false)
              return item
            })
            _this.loading = false
          })
          .catch(res => {
            console.log(res)
            _this.loading = false
          })
      } */
    },

    saveEntity() {
      this.dialogCreating = true
      this.titleHead = '添加用户'
    },
    // 添加节点
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const _this = this
          const params = {
            name: _this.create.name,
            role: _this.create.role,
            billing: _this.create.billing,
            usergroup: _this.create.usergroup,
            pass: _this.create.pass
          }
          CreateUser(params)
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
      syncUser()
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

    // 跳转用户组
    getGroupID(data) {
      // const _this = this
      console.log(data)
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
            _id: row._id
          }
          DeleteUser(params)
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
      row.role = row.original.role
      row.logTime = row.original.logTime
      row.thawingTime = row.original.thawingTime
      row.type = row.original.type
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
      if (row.role !== '') {
        params.newOption.role = row.role
      }
      if (row.logTime !== '') {
        params.newOption.logTime = row.logTime
      }
      if (row.thawingTime !== '') {
        params.newOption.thawingTime = row.thawingTime
      }
      if (row.type !== '') {
        params.newOption.type = row.type
      }

      await ChangeUser(params)
      row.original.name = row.name
      row.original.role = row.role
      row.original.logTime = row.logTime
      row.original.thawingTime = row.thawingTime
      row.original.type = row.type
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
