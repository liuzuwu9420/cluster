<template>
  <div v-show="sidepagedata.sidepageShow" class="tableInfo">
    <el-tabs v-show="choseUsers" v-model="activeName" :before-leave="beforeLeave">
      <el-tab-pane name="close">
        <span slot="label">
          <i class="el-icon-close" />
        </span>
      </el-tab-pane>
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="container el-scrollbar">
          <el-row class="basic-container">
            <el-col :xs="24" :sm="24" :lg="16">
              <div class="left-head">
                <div class="left-head-name">
                  <span class="HostName">{{ sidepagedata.groups.GroupName }}</span>
                </div>
              </div>
              <div class="left-body">
                <div class="left-head-title">
                  <i class="el-icon-notebook-1" />
                  <span class="head-title">概览</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">UUID:</div>
                  <div class="right-content">{{ sidepagedata.groups.UUID }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">创建时间:</div>
                  <div class="right-content">{{ sidepagedata.groups.CreatedAt }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">最后修改时间:</div>
                  <div class="right-content">{{ sidepagedata.groups.UpdatedAt }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">描述:</div>
                  <div class="right-content">{{ sidepagedata.groups.Desc }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="用户" name="UserData">
        <div class="container el-scrollbar">
          <div class="hasten">
            <el-dropdown class="headBut" trigger="click" @command="handleCommand">
              <el-button type="primary">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add">添加用户</el-dropdown-item>
                <el-dropdown-item command="rm" :disabled="selectUser">移除用户</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
              :data="usersData"
              element-loading-text="Loading"
              fit
              style="width: 100%; background-color: #e8f4ff;"
              row-class-name="table-row-class"
              height="100%"
              max-height="765px"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column label="ID" width="120">
                <template v-slot="{row}">
                  <span class="userLink" @click="getUserID(row)">{{ row.UserID }}</span>
                </template>
              </el-table-column>

              <el-table-column label="用户">
                <template v-slot="{row}">
                  <span>{{ row.UserName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间">
                <template v-slot="{row}">
                  <span>{{ row.CreatedAt }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-show="!choseUsers" v-model="activeChooseUsersName" :before-leave="beforeLeaveUsers">
      <el-tab-pane name="closeUsers">
        <span slot="label">
          <i class="el-icon-close" />
        </span>
      </el-tab-pane>
      <el-tab-pane label="选择用户" name="clooseUsers">
        <div class="container el-scrollbar">
          <div class="hasten">
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
          <div class="table-info-choose-uses el-scrollbar">
            <el-table
              v-loading="loading"
              :data="usersData"
              element-loading-text="Loading"
              fit
              style="width: 100%; background-color: #e8f4ff;"
              row-class-name="table-row-class"
              height="100%"
              max-height="650px"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column label="ID" width="120">
                <template v-slot="{row}">
                  <span class="userLink" @click="getUserID(row)">{{ row.UserID }}</span>
                </template>
              </el-table-column>

              <el-table-column label="用户">
                <template v-slot="{row}">
                  <span>{{ row.UserName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间">
                <template v-slot="{row}">
                  <span>{{ row.CreatedAt }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="foot-table-users">
            <el-button type="primary" :disabled="chooseUsersTrue" @click="changeUsers">确定</el-button>
            <el-button @click="beforeLeaveUsers('closeUsers')">取消</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { GetBillUser, ChangeBillUser, DeleteBillGroupUser, GetGroupIDUser } from '@/api/role'
import { formatDate } from '../../../../utils/format'
// import Tags from '@/components/Tags'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'

export default {
  name: 'GroupsSidepage',
  components: {
    // Tags,
    Pagination,
    Search
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          groups: {},
          sidepageShow: false,
          group: ''
        }
      }
    }
  },
  data() {
    return {
      activeName: 'BasicAttribute',
      selectUser: true,
      loading: false,
      usersData: [],
      multipleSelection: [],
      // 查询数据
      selected: {
        items: [
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
      choseUsers: true,
      activeChooseUsersName: 'clooseUsers',
      chooseUsersTrue: true
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val, oldVal) {
        this.choseUsers = true
        if (this.activeName === 'UserData') {
          this.getList()
        }
      },
      deep: true
    },
    multipleSelection() {
      if (this.multipleSelection.length !== 0) {
        this.selectUser = false
        this.chooseUsersTrue = false
      } else {
        this.selectUser = true
        this.chooseUsersTrue = true
      }
    }
  },
  methods: {
    beforeLeave(tab) {
      const _this = this
      if (tab === 'close') {
        _this.sidepagedata.sidepageShow = false
        _this.multipleSelection = []
        return false
      } else if (tab === 'UserData') {
        _this.getList()
      }
    },
    beforeLeaveUsers(tab) {
      const _this = this
      if (tab === 'closeUsers') {
        _this.choseUsers = true
        _this.sidepagedata.sidepageShow = true
        _this.multipleSelection = []
        _this.getList()
        return false
      } else if (tab === 'clooseUsers') {
        _this.getList()
      }
    },
    getList(data) {
      const _this = this
      const boolean = 'false'
      if (_this.sidepagedata.group === 'userGroup') {
        if (!_this.choseUsers) {
          _this.getGroupUsers(data, boolean)
        } else {
          _this.getGroupUsers(data)
        }
      } else if (_this.sidepagedata.group === 'billGroup') {
        if (!_this.choseUsers) {
          _this.getBillUsers(data, boolean)
        } else {
          _this.getBillUsers(data)
        }
      }
    },
    getGroupUsers(query, boolean) {
      const _this = this
      _this.loading = true
      const id = _this.sidepagedata.groups.GroupID
      let containBool = true
      const obj = {}
      if (query) {
        if (query.select === 'ID') {
          obj.UserID = query.value
        }
      }
      if (boolean === 'false') {
        containBool = false
      }
      const params = {
        page: {
          PageNumber: _this.page.currentPage, // 当前页数
          PageSize: _this.page.pageSize // 每一页显示条数
        },
        query: obj,
        contain: containBool
      }
      GetGroupIDUser(id, params)
        .then(res => {
          _this.usersData = res.Inventory.ResultData.map(function(item, index) {
            item.CreatedAt = formatDate(item.CreatedAt, 'yyyy-MM-dd hh:mm:ss')
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
          _this.loading = false
        }).catch(res => {
          console.log(res)
          _this.loading = false
        })
    },
    getBillUsers(query, boolean) {
      const _this = this
      _this.loading = true
      const UUID = _this.sidepagedata.groups.UUID
      let containBool = true
      const obj = {}
      if (query) {
        if (query.select === 'ID') {
          obj.UserID = query.value
        }
      }
      if (boolean === 'false') {
        containBool = false
      }
      const params = {
        page: {
          PageNumber: _this.page.currentPage, // 当前页数
          PageSize: _this.page.pageSize // 每一页显示条数
        },
        query: obj,
        contain: containBool
      }
      GetBillUser(UUID, params)
        .then(res => {
          _this.usersData = res.Inventory.ResultData.map(function(item, index) {
            item.CreatedAt = formatDate(item.CreatedAt, 'yyyy-MM-dd hh:mm:ss')
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
          _this.loading = false
        }).catch(res => {
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
    // 跳转用户
    getUserID(data) {
      const _this = this
      _this.$router.push({
        name: 'role.user',
        params: {
          select: 'ID',
          value: data.UserID
        }
      })
    },

    handleCommand(command) {
      if (command === 'add') {
        this.multipleSelection = []
        this.choseUsers = false
        this.getList()
      } else if (command === 'rm') {
        this.deleteUsers(this.multipleSelection)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 移除组中用户
    deleteUsers(data) {
      const _this = this
      if (_this.sidepagedata.group === 'userGroup') {
        _this.deleteGroupUsers(data)
        _this.getList()
      } else if (_this.sidepagedata.group === 'billGroup') {
        _this.deleteBillUsers(data)
        _this.getList()
      }
    },
    async deleteBillUsers(data) {
      const _this = this
      _this.loading = true
      try {
        data.map(async item => {
          await DeleteBillGroupUser(item.UserID)
        })
        _this.$message({
          type: 'success',
          message: '移除成功!'
        })
      } catch (e) {
        _this.$message({
          type: 'error',
          message: '移除失败!'
        })
      }
      _this.loading = false
    },
    async deleteGroupUsers(data) {
      const _this = this
      _this.loading = true
      this.$message({
        type: 'error',
        message: '暂不可用'
      })
      /* try {
        data.map(async item => {
          await DeleteBillGroupUser(item.UserID)
        })
        _this.$message({
          type: 'success',
          message: '移除成功!'
        })
      } catch (e) {
        _this.$message({
          type: 'error',
          message: '移除失败!'
        })
      } */
      _this.loading = false
    },

    // 修改用户所在组
    changeUsers() {
      const _this = this
      if (_this.sidepagedata.group === 'userGroup') {
        _this.changeGroupUsers(_this.multipleSelection)
      } else if (_this.sidepagedata.group === 'billGroup') {
        _this.changeBillUsers(_this.multipleSelection)
      }
    },
    changeGroupUsers(data) {
      this.$message({
        type: 'error',
        message: '暂不可用'
      })
      /* data.map(async item => {
        await ChangeBillUser(item.UserID)
      }) */
    },
    async changeBillUsers(data) {
      const _this = this
      try {
        data.map(async item => {
          const params = {
            userID: item.UserID,
            groupUUID: _this.sidepagedata.groups.UUID
          }
          await ChangeBillUser(params)
        })
        _this.choseUsers = true
        _this.getList()
        _this.$message({
          type: 'success',
          message: '修改成功!'
        })
      } catch (e) {
        _this.$message({
          type: 'error',
          message: '修改失败!'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tableInfo {
  left: 160px;
  position: absolute;
  top: 0;
  top: 0;
  bottom: 0;
  right: 0;
  max-height: 805px;
  border-right: 1px solid #fff;
  z-index: 2000;
  background: #fff;
  .el-tabs {
    background-color: #eff9ff;
  }
  .el-tab-pane {
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
    font-size: 16px;
    background-color: #e8f4ff;
    padding: 0 10px;
  }
  .basic-container {
    padding-left: 60px;
  }
  .left-head {
    margin-top: 20px;
    line-height: 20px;
    font-size: 0;
    color: #1a2736;
    .HostName {
      font-size: 24px;
      line-height: 26px;
      height: 26px;
      padding: 0 0 0 1px;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .left-head-name {
      margin-bottom: 5px;
    }
    .hosts-tags {
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .left-body {
    margin-top: 30px;
    .left-head-title {
      border-bottom: 1px solid #5e6978;
      padding-bottom: 8px;
      color: #1a2736;
      font-size: 18px;
      margin-right: 60px;
      margin-bottom: 5px;
    }
  }
  .head-title {
    margin-left: 5px;
  }
  .right-head-title {
    border-bottom: 1px solid #5e6978;
    padding-bottom: 8px;
    color: #1a2736;
    font-size: 18px;
    margin-right: 60px;
    margin-bottom: 5px;
    margin-top: 40px;
  }
  .detail-row {
    padding-top: 20px;
    height: 40px;
    font-size: 14px;
    line-height: 24px;
  }
  .left-title {
    width: 130px;
    color: #5e6978;
    float: left;
  }
  .left-content {
    color: #1a2736;
    overflow: auto;
  }
  .right-content {
    overflow: auto;
  }
  .hasten {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    padding: 5px 10px;
    .el-button {
      height: 36px;
      line-height: 0;
      float: left;
      margin-right: 0px;
      margin-left: 0px;
    }
    .headBut {
      margin-right: 0px;
      margin-left: 10px;
      float: left;
    }
  }

  .pagination {
    float: right;
  }

  .table-info {
    height: calc(100vh - 234px);
    overflow: auto;
  }

  .table-info-choose-uses {
    height: calc(100vh - 294px);
    overflow: auto;
  }
  .el-table .userLink {
    cursor: pointer;
    color: #49b0f9;
  }
  .foot-table-users {
    width: 100%;
    height: 40px;
    padding: 5px 10px;
    text-align: center;
  }
}

</style>
