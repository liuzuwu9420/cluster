<template>
  <div class="app-container" @click="closeSidepage($event)">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus" /> 添加计费规则
          </el-button>
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
            :data="billRuleData"
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
                  <el-input v-model="row.RuleName" size="small" />
                </template>
                <span v-else>{{ row.RuleName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="160">
              <template v-slot="{row}">
                <template v-if="row.edit">
                  <el-select v-model="row.RuleType">
                    <el-option
                      v-for="item in create.RuleTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
                <span v-else>{{ row.RuleType }}</span>
              </template>
            </el-table-column>
            <el-table-column label="价格" width="230">
              <template v-slot="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.CostRate" class="edit-input" size="small" />
                  <el-select v-model="row.ChargeUnit" class="edit-input">
                    <el-option
                      v-for="item in create.ChargeUnits"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
                <span v-else>￥ {{ row.CostRate }} / {{ row.ChargeUnit }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" show-overflow-tooltip>
              <template v-slot="{row}">
                <span>{{ row.CreatedAt }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" show-overflow-tooltip>
              <template v-slot="{row}">
                <span>{{ row.UpdatedAt }}
                </span>
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
                      :disabled="row.UUID === 'default'?true:false"
                      @click="deleteItem(row)"
                    />
                  </el-tooltip>
                </el-button-group>
              </template>
            </el-table-column>
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
            <el-form-item label="名称" prop="RuleName">
              <el-input v-model="create.RuleName" class="formInp" />
            </el-form-item>
            <el-form-item label="类型" prop="RuleType">
              <el-select v-model="create.RuleType" class="formInp">
                <el-option
                  v-for="item in create.RuleTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="价格" prop="CostRate">
              <el-input v-model="create.CostRate" v-number-input.float class="formInp">
                <template slot="prepend">￥</template>
              </el-input>
            </el-form-item>
            <el-form-item label="时间单位" prop="time">
              <el-select v-model="create.ChargeUnit" class="formInp">
                <el-option
                  v-for="item in create.ChargeUnits"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
import { GetBillingRuleList, CreateBillRule, ChangeBillRule, DeleteBillRule } from '@/api/rule'

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
      billRuleData: [],
      loading: false,
      dialogCreating: false,
      titleHead: '',
      // 节点添加信息
      create: {
        RuleName: '',
        CostRate: '',
        RuleType: 'CPU',
        RuleTypes: [{
          label: 'CPU',
          value: 'CPU'
        }],
        ChargeUnit: '小时',
        ChargeUnits: [{
          label: '秒',
          value: '秒'
        }, {
          label: '分',
          value: '分'
        }, {
          label: '小时',
          value: '小时'
        }, {
          label: '天',
          value: '天'
        }, {
          label: '周',
          value: '周'
        }]
      },
      rules: {
        RuleName: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        CostRate: [
          {
            required: true,
            message: '请输入价格',
            trigger: 'blur'
          }
        ],
        RuleType: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'blur'
          }
        ],
        ChargeUnit: [
          {
            required: true,
            message: '请选择时间单位',
            trigger: 'blur'
          }
        ]
      },
      // Sidepage
      sidepagedata: {
        lists: {},
        sidepageShow: false
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
          obj.RuleName = query.value
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
      GetBillingRuleList(params)
        .then(res => {
          // _this.billRuleData = []
          _this.billRuleData = res.Inventory.ResultData.map(function(item, index) {
            item.CreatedAt = formatDate(item.CreatedAt, 'yyyy-MM-dd hh:mm:ss')
            item.UpdatedAt = formatDate(item.UpdatedAt, 'yyyy-MM-dd hh:mm:ss')
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

    saveEntity() {
      this.dialogCreating = true
      this.titleHead = '添加计费规则'
    },
    // 添加节点
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const _this = this
          console.log(_this.create)
          const params = {
            RuleName: _this.create.RuleName,
            CostRate: +_this.create.CostRate,
            RuleType: _this.create.RuleType,
            ChargeUnit: _this.create.ChargeUnit
          }
          CreateBillRule(params)
            .then(res => {
              _this.getList()
              _this.dialogCreating = false
              _this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
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
      if (!row.edit) {
        const FixedCli = this.$refs.tableSidepage.$refs.rightFixedWrapper
        if (!FixedCli.contains(event.target)) {
          _this.$refs.tableSidepage.setCurrentRow(row)
          _this.sidepagedata.lists = row
          _this.sidepagedata.sidepageShow = true
        }
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

    // 删除
    async deleteItem(row) {
      const _this = this
      _this
        .$confirm('此操作将删除该计费规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          DeleteBillRule(row.UUID)
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
      row.GroupName = row.original.RuleName
      row.CostRate = row.original.CostRate
      row.ChargeUnit = row.original.ChargeUnit
      row.RuleType = row.original.RuleType
    },

    // 确认编辑
    async confirmEdit(row) {
      const params = {}
      params.UUID = row.UUID
      if (row.RuleName !== '') {
        params.RuleName = row.RuleName
      }
      if (row.CostRate !== '') {
        params.CostRate = row.CostRate
      }
      if (row.ChargeUnit !== '') {
        params.ChargeUnit = row.ChargeUnit
      }
      if (row.RuleType !== '') {
        params.RuleType = row.RuleType
      }
      if (row.RuleName !== '' && row.CostRate !== '' && row.ChargeUnit !== '' && row.RuleType !== '') {
        await ChangeBillRule(params)
        row.original.RuleName = row.RuleName
        row.original.CostRate = +row.CostRate
        row.original.ChargeUnit = row.ChargeUnit
        row.original.RuleType = row.RuleType
        row.edit = false
      } else {
        this.$message({
          type: 'error',
          message: '请输入完整'
        })
      }
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
.table-info .edit-input{
  width: 49%;
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
