<template>
  <div class="app-container" @click="closeSidepage($event)">
    <el-container>
      <el-main>
        <div class="hasten">
          <!-- <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus" /> 创建用户组
          </el-button> -->
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
            ref="tableSidepage"
            v-loading="loading"
            :data="userGroupsData"
            element-loading-text="Loading"
            fit
            highlight-current-row
            style="width: 100%; cursor: pointer;"
            height="100%"
            @row-click="showSidepage"
          >
            <el-table-column label="名称" width="160">
              <template v-slot="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.GroupName" class="edit-input" size="small" />
                </template>
                <span v-else>{{ row.GroupName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="ID">
              <template v-slot="{row}">
                <span>{{ row.GroupID }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间">
              <template v-slot="{row}">
                <span>{{ row.CreatedAt }}
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
            <!-- <el-table-column fixed="right" label="操作" width="200">
              <template v-slot="{row}">
                <el-button-group>
                  <el-button
                    v-if="row.edit"
                    type="warning"
                    size="mini"
                    icon="el-icon-circle-check-outline"
                    @click="confirmEdit(row)"
                  >确定</el-button>
                  <el-button
                    v-if="row.edit"
                    type="success"
                    size="mini"
                    icon="el-icon-circle-check-outline"
                    @click="cancelEdit(row)"
                  >取消</el-button>

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
            </el-table-column> -->
          </el-table>
          <sidepage ref="SidepageName" :sidepagedata.sync="sidepagedata" />
        </div>
        <el-dialog :title="titleHead" :visible.sync="dialogCreating" width="600px">
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
    </el-container>
  </div>
</template>

<script>
import {
  GetUserGroupList,
  CreateUserGroup,
  ChangeUserGroup,
  DeleteUserGroup
} from '@/api/role'
import { syncUser } from '@/api/sync'

import { formatDate } from '@/utils/format'

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
        total: 0
      },
      userGroupsData: [],
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
      },
      // Sidepage
      sidepagedata: {
        groups: {},
        sidepageShow: false,
        group: 'userGroup'
      }
    }
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
      const obj = {}
      if (query) {
        if (query.select === 'name') {
          obj.GroupName = query.value
        } else if (query.select === 'ID') {
          obj.GroupID = query.value
        }
      }
      const params = {
        page: {
          PageNumber: _this.page.currentPage, // 当前页数
          PageSize: _this.page.pageSize // 每一页显示条数
        },
        query: obj
      }
      GetUserGroupList(params)
        .then(async res => {
          _this.userGroupsData = []
          res.Inventory.ResultData.map(function(item, index) {
            item.CreatedAt = formatDate(item.CreatedAt, 'yyyy-MM-dd hh:mm:ss')
            item.UpdatedAt = formatDate(item.UpdatedAt, 'yyyy-MM-dd hh:mm:ss')
            // 保存一份原始数据，便于取消编辑的时候还原数据
            const original = _this._.cloneDeep(item)
            item.original = original
            _this.$set(item, 'edit', false)
            _this.userGroupsData.push(item)
          })
          _this.page.total = res.Inventory.TotalNumber
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
          _this.loading = false
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

    // 搜索
    searchChanged(data) {
      const _this = this
      if (data.value === '') {
        _this.getList()
      } else {
        _this.getList(data)
      }
      /* if (data.select === 'name') {
        _this.$message({
          message: '名称暂时无法查询',
          type: 'warning',
          duration: 1000
        })
      } else if (data.select === 'ID') {
        _this.loading = true
        GetGroupIDList(data.value)
          .then(async res => {
            _this.userGroupsData = []
            const Inv = res.Inventory
            try {
              const data = await GetGroupIDUser(Inv.GroupID)
              Inv.users = data.Inventory
              // 保存一份原始数据，便于取消编辑的时候还原数据
              const original = _this._.cloneDeep(Inv)
              Inv.original = original
              _this.$set(Inv, 'edit', false)
              _this.userGroupsData.push(Inv)
            } catch (e) {
              _this.$message({
                type: 'error',
                message: '获取失败'
              })
            }
            _this.loading = false
          })
          .catch(res => {
            console.log(res)
          })
      } */
    },

    // 显示Sidepage
    showSidepage(row, column, event) {
      const _this = this
      const FixedCli = this.$refs.tableSidepage.$refs.rightFixedWrapper
      if (!FixedCli || !FixedCli.contains(event.target)) {
        _this.$refs.tableSidepage.setCurrentRow(row)
        _this.sidepagedata.groups = row
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
      row.GroupName = row.original.GroupName
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
      if (row.GroupName !== '') {
        params.newOption.GroupName = row.GroupName
      }
      if (row.description !== '') {
        params.newOption.description = row.description
      }

      await ChangeUserGroup(params)
      row.original.GroupName = row.GroupName
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

.app-container .el-table .userLink {
  cursor: pointer;
  color: #49b0f9;
}

.groupName {
  color: #3c73b9;
  cursor: pointer;
}

.groupName:hover {
  color: #1890ff;
  text-decoration:underline;
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
