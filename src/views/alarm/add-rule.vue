<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="head">
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button type="info" plain @click="resetForm('ruleForm')">重置</el-button>
          <el-button>
            <router-link :to="{ name: 'Alarm rule' }">
              取消
            </router-link>
          </el-button>
        </div>
        <div class="table-info el-scrollbar">
          <div class="add-title">创建报警器</div>
          <div class="add-form">
            <el-form ref="ruleForm" label-position="left" :model="ruleForm" :rules="rules" label-width="78px" class="add-ruleForm">
              <el-form-item label="英文名" prop="key">
                <el-input v-model="ruleForm.key" placeholder="请输入英文用于创建路径" />
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="ruleForm.name" />
              </el-form-item>
              <el-form-item label="状态" prop="enabled">
                <el-radio v-model="ruleForm.enabled" label="1">启用</el-radio>
                <el-radio v-model="ruleForm.enabled" label="2">不启用</el-radio>
              </el-form-item>
              <el-form-item label="报警条目" prop="RuleName">
                <div ref="chooseAlarmRule" tabindex="1" class="content" @focus="changBackground(1)" @blur="changBackground(2)" @click="showSidepage">
                  {{ ruleForm.Rule.name }}
                  <div>
                    <i v-show="ruleForm.Rule.name===''?true:false" class="el-icon-circle-plus-outline add" />
                    <i v-show="ruleForm.Rule.name===''?false:true" class="el-icon-remove-outline delete" @click="ruleForm.Rule.name=''" />
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="报警条件" prop="condition">
                <el-input v-model="ruleForm.condition" class="input-with-select">
                  <el-select slot="prepend" v-model="ruleForm.conditionSelect" placeholder="请选择">
                    <el-option label=">" value=">" />
                    <el-option label=">=" value=">=" />
                    <el-option label="<" value="<" />
                    <el-option label="<=" value="<=" />
                    <el-option label="==" value="==" />
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="持续时间" prop="time">
                <el-input v-model="ruleForm.time" class="input-with-select">
                  <el-select slot="append" v-model="ruleForm.timeSelect" placeholder="请选择">
                    <el-option label="分钟" value="m" />
                    <el-option label="秒" value="s" />
                    <el-option label="小时" value="h" />
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="报警级别" prop="level">
                <el-select v-model="ruleForm.level" placeholder="请选择">
                  <el-option label="紧急" value="紧急" />
                  <el-option label="严重" value="严重" />
                  <el-option label="提示" value="提示" />
                </el-select>
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
import { changeConsulAlarm } from '@/api/consul'
import Sidepage from './Sidepage/add-rule'

export default {
  components: {
    Sidepage
  },
  data() {
    var validateKey = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入key'))
      } else {
        var pattern2 = new RegExp('[A-Za-z]+')
        if (!pattern2.test(value)) {
          this.ruleForm.key = ''
          callback(new Error('请输入英文'))
        }
        callback()
      }
    }
    var validateRuleName = (rule, value, callback) => {
      if (this.ruleForm.Rule.name === '') {
        callback(new Error('请选择作业条目'))
      } else {
        callback()
      }
    }
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
        key: '',
        name: '',
        enabled: '1',
        desc: '',
        Rule: {
          name: '',
          expr: ''
        },
        condition: '',
        conditionSelect: '>',
        time: '',
        timeSelect: 'm',
        level: ''
      },
      rules: {
        key: [
          { required: true, validator: validateKey, trigger: 'blur' }
        ],
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        RuleName: [
          { required: true, validator: validateRuleName, trigger: 'blur' }
        ],
        condition: [
          {
            required: true,
            message: '请选择并输入报警条件',
            trigger: 'blur'
          }
        ],
        time: [
          {
            required: true,
            message: '请选择并输入持续时间',
            trigger: 'blur'
          }
        ],
        level: [
          {
            required: true,
            message: '请选择报警级别',
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
      this.ruleForm.Rule.name = data.name
      this.ruleForm.Rule.expr = data.expr
      this.changBackground(2)
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate(async(valid) => {
        if (valid) {
          let enabled = null
          let summary = ''
          if (this.ruleForm.enabled === '1') {
            enabled = true
          } else {
            enabled = false
          }
          if (this.ruleForm.Rule.name === '主机状态') {
            summary = '服务器宕机'
            this.ruleForm.desc = '主机状态'
          } else if (this.ruleForm.Rule.name === 'CPU使用率') {
            summary = this.ruleForm.Rule.name + this.ruleForm.conditionSelect + this.ruleForm.condition
            this.ruleForm.desc = summary
          } else if (this.ruleForm.Rule.name === '磁盘容量') {
            summary = this.ruleForm.Rule.name + this.ruleForm.conditionSelect + this.ruleForm.condition
            this.ruleForm.desc = summary
          }
          const paramsMatedata = `{
  "key": "prometheus/alerting-rules/groups/${this.ruleForm.key}",
  "name": "${this.ruleForm.name}",
  "desc": "${this.ruleForm.desc}",
  "enabled": ${enabled}
}`
          const paramsData = `- name: ${this.ruleForm.name}
  rules:
  - alert: ${this.ruleForm.Rule.name}
    expr: ${this.ruleForm.Rule.expr} ${this.ruleForm.conditionSelect} ${this.ruleForm.condition}
    for: ${this.ruleForm.time}${this.ruleForm.timeSelect}
    labels:
      severity: ${this.ruleForm.level}
    annotations:
      summary: "{{$labels.instance}}:${summary}"`
          const metadataUrl = `/prometheus/alerting-rules/groups/${this.ruleForm.key}/metadata`
          const dataUrl = `/prometheus/alerting-rules/groups/${this.ruleForm.key}/data`
          const metadataRes = await changeConsulAlarm(metadataUrl, paramsMatedata)
          const dataRes = await changeConsulAlarm(dataUrl, paramsData)
          if (metadataRes && dataRes) {
            _this.$message({
              showClose: true,
              message: '添加报警器成功！',
              type: 'success'
            })
            _this.$router.push({
              name: 'Alarm rules'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.Rule.name = ''
      this.ruleForm.conditionSelect = ''
      this.ruleForm.timeSelect = ''
    },
    changBackground(flag) {
      switch (flag) {
        case 1:
          this.$refs.chooseAlarmRule.style['border-color'] = '#1890ff'
          break
        case 2:
          if (this.ruleForm.Rule.name === '') {
            this.$refs.chooseAlarmRule.style['border-color'] = '#ff4949'
          } else {
            this.$refs.chooseAlarmRule.style['border-color'] = '#DCDFE6'
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
  padding-left: 20px;
}
.table-info .add-form .el-select {
    width: 100%;
  }
.table-info .add-form .input-with-select .el-select {
    width: 90px;
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
