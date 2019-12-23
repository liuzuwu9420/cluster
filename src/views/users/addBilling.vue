<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button type="info" plain @click="resetForm('ruleForm')">重置</el-button>
          <router-link :to="{ name: 'role.billing' }">
            <el-button>
              取消
            </el-button>
          </router-link>
        </div>
        <div class="table-info el-scrollbar">
          <div class="add-title">创建计费组</div>
          <div class="add-form">
            <el-form ref="ruleForm" label-position="top" :model="ruleForm" :rules="rules" label-width="100px" class="add-ruleForm">
              <el-form-item label="名称" prop="GroupName">
                <el-input v-model="ruleForm.GroupName" />
              </el-form-item>
              <el-form-item label="价格" prop="BillingRule">
                <div ref="chooseBillingRule" tabindex="1" class="content" @focus="changBackground(1)" @blur="changBackground(2)" @click="showSidepage">
                  {{ ruleForm.Rule }}
                  <div>
                    <i v-show="ruleForm.Rule===''?true:false" class="el-icon-circle-plus-outline add" />
                    <i v-show="ruleForm.Rule===''?false:true" class="el-icon-remove-outline delete" @click="ruleForm.Rule=''" />
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="描述" prop="desc">
                <el-input v-model="ruleForm.Desc" type="textarea" />
              </el-form-item>
            </el-form>
          </div>
          <sidepage :sidepagedata.sync="sidepagedata" @handle-billing-rule-data="handleBillingRuleData" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { CreateBill, ChangeBillGroupRule } from '@/api/role'
import Sidepage from './components/Sidepage/addBillingSidepage'

export default {
  components: {
    Sidepage
  },
  data() {
    return {
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      billGroupData: [],
      loading: false,
      dialogCreating: false,
      titleHead: '',
      // 添加信息
      ruleForm: {
        GroupName: '',
        Rule: '',
        BillingRule: {},
        Desc: ''
      },
      rules: {
        GroupName: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        BillingRule: [
          {
            required: true,
            message: '请选择计费规则',
            trigger: 'blur'
          }
        ]
      },
      // Sidepage
      sidepagedata: {
        sidepageShow: false
      }
    }
  },
  computed: {
    classObject: function() {
      return {
        active: this.isActive && !this.error,
        'text-danger': this.error && this.error.type === 'fatal'
      }
    }
  },
  methods: {
    // 显示Sidepage
    showSidepage(row, column, event) {
      const _this = this
      _this.sidepagedata.sidepageShow = true
    },
    handleBillingRuleData(data) {
      this.ruleForm.BillingRule = data
      this.ruleForm.Rule = `${data.RuleName} (${data.RuleType} ￥ ${data.CostRate}/${data.ChargeUnit})`
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            GroupName: _this.ruleForm.GroupName,
            Desc: _this.ruleForm.Desc
          }
          CreateBill(params)
            .then(res => {
              if (res.Success) {
                const GroupUUID = res.Inventory
                const RuleUUID = _this.ruleForm.BillingRule.UUID
                ChangeBillGroupRule(GroupUUID, RuleUUID)
                  .then(res => {
                    console.log(res)
                    _this.$message({
                      showClose: true,
                      message: '添加计费组成功！',
                      type: 'success'
                    })
                    _this.$router.push({
                      name: 'role.billing'
                    })
                  }).catch(res => {
                    console.log(res)
                  })
              }
            }).catch(res => {
              console.log(res)
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
    changBackground(flag) {
      switch (flag) {
        case 1:
          this.$refs.chooseBillingRule.style['border-color'] = '#1890ff'
          break
        case 2:
          if (this.ruleForm.BillingRule === '') {
            this.$refs.chooseBillingRule.style['border-color'] = '#ff4949'
          } else {
            this.$refs.chooseBillingRule.style['border-color'] = '#DCDFE6'
          }
          break
        default:
          break
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
.table-info .add-title {
  width: 100%;
  height: 44px;
  background-color: #eff9ff;
  padding: 14px;
}
.table-info .add-form {
  width: 300px;
  height: calc(100% - 44px);
  padding-top: 14px;
}
.table-info .add-form .content {
    height: 40px;
    font-size: 14px;
    color: #606266;
    width: 100%;
    border: 1px solid #dae0e6;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 40px;
    padding-left: 15px;
}
.delete:hover, .add:hover {
    color: #3c73b9;
    cursor: pointer;
}

.delete, .add {
    position: absolute;
    color: #99c8ed;
    height: 23px;
    width: 23px;
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
    font-size: 23px;
}
</style>
