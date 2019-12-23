<template>
  <div class="app-container" @click="closeSidepage($event)">
    <el-container>
      <el-main>
        <div class="hasten">
          <!-- <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus" /> 创建计费组
          </el-button> -->
          <router-link :to="{ name: 'role.addBilling' }">
            <el-button type="primary" size="mini">
              <i class="el-icon-plus" />
              创建计费组
            </el-button>
          </router-link>
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
            :data="billGroupData"
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
            <el-table-column label="价格" width="230">
              <template v-slot="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.CostRate" class="edit-input" size="small" />
                </template>
                <span v-else>{{ row.Rule }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template v-slot="{row}">
                <span>{{ row.CreatedAt }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="描述">
              <template v-slot="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.Desc" class="edit-input" size="small" />
                </template>
                <span v-else>{{ row.Desc }}</span>
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

                  <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                    <el-button
                      v-if="!row.edit"
                      type="warning"
                      size="mini"
                      icon="el-icon-edit"
                      @click="row.edit=!row.edit"
                    />
                  </el-tooltip> -->
                  <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                    <el-button
                      v-if="!row.edit"
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      :disabled="row.UUID === 'default'?true:false"
                      @click="deleteItem(row)"
                    />
                  </el-tooltip>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <sidepage ref="SidepageName" :sidepagedata.sync="sidepagedata" @handle-change="handleChange" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { GetBillList, CreateBill, DeleteBillGroup } from '@/api/role'

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
            value: 'UUID',
            label: 'UUID'
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
      billGroupData: [],
      loading: false,
      // Sidepage
      sidepagedata: {
        groups: {},
        sidepageShow: false,
        group: 'billGroup'
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
      const obj = {}
      if (query) {
        if (query.select === 'name') {
          obj.GroupName = query.value
        } else if (query.select === 'UUID') {
          obj.UUID = query.value
        }
      }
      const params = {
        page: {
          PageNumber: _this.page.currentPage, // 当前页数
          PageSize: _this.page.pageSize // 每一页显示条数
        },
        query: obj
      }
      GetBillList(params)
        .then(res => {
          // _this.billGroupData = []
          _this.billGroupData = res.Inventory.ResultData.map(function(item, index) {
            item.CreatedAt = formatDate(item.CreatedAt, 'yyyy-MM-dd hh:mm:ss')
            item.UpdatedAt = formatDate(item.UpdatedAt, 'yyyy-MM-dd hh:mm:ss')
            item.Rule = `${item.RuleName} (${item.RuleType} ￥ ${item.CostRate}/${item.ChargeUnit})`
            // 保存一份原始数据，便于取消编辑的时候还原数据
            const original = _this._.cloneDeep(item)
            item.original = original
            _this.$set(item, 'edit', false)
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
          _this.page.pageCount = res.Inventory.PageNumber
        })
        .catch(res => {
          console.log(res)
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

    // 显示Sidepage
    showSidepage(row, column, event) {
      const _this = this
      const FixedCli = this.$refs.tableSidepage.$refs.rightFixedWrapper
      if (!FixedCli.contains(event.target)) {
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

    handleChange(bool) {
      if (bool) {
        this.getList()
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
        .$confirm('此操作将删除该计费组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          DeleteBillGroup(row.UUID)
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
      row.CostRate = row.original.CostRate
      row.Desc = row.original.Desc
    },

    // 确认编辑
    async confirmEdit(row) {
      /* const params = {
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
      row.edit = false */
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 100%;
}

.app-container .el-container {
  height: 100%;
}
.app-container .el-main {
  overflow: hidden;
}

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
