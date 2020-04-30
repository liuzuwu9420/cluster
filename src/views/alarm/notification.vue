<template>
  <div class="app-container">
    <div class="table-info el-scrollbar">
      <el-row :gutter="20" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-panel-icon-wrapper">
              <svg-icon icon-class="email" class-name="card-panel-icon icon-email" />
              <div>邮件设置</div>
              <div class="switch">
                <el-radio-group
                  v-model="emailSwitch"
                  size="mini"
                  @change="changeSwitch(emailSwitch, 'email')"
                >
                  <el-radio-button label="ON" />
                  <el-radio-button label="OFF" />
                </el-radio-group>
              </div>
            </div>
            <div style="padding: 14px;">
              <el-form
                ref="emailRuleForm"
                :model="emailRuleForm"
                :rules="rules"
                label-width="120px"
                class="emailRuleForm"
              >
                <el-form-item prop="smtp_smarthost" label="服务器代理">
                  <el-input v-model="emailRuleForm.smtp_smarthost" :disabled="emailTrue" />
                </el-form-item>
                <el-form-item prop="smtp_auth_username" label="邮箱名称">
                  <el-input v-model="emailRuleForm.smtp_auth_username" :disabled="emailTrue" />
                </el-form-item>
                <el-form-item label="邮箱密码" prop="smtp_auth_password">
                  <el-input
                    v-model="emailRuleForm.smtp_auth_password"
                    type="password"
                    autocomplete="off"
                    :disabled="emailTrue"
                  />
                </el-form-item>
                <el-form-item prop="smtp_from" label="发送邮箱名称">
                  <el-input v-model="emailRuleForm.smtp_from" :disabled="emailTrue" />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    :disabled="emailTrue"
                    @click="submitForm('emailRuleForm')"
                  >确认</el-button>
                  <el-button :disabled="emailTrue" @click="resetForm('emailRuleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-panel-icon-wrapper">
              <svg-icon icon-class="sms" class-name="card-panel-icon icon-sms" />
              <div>短信设置</div>
              <div class="switch">
                <el-radio-group
                  v-model="smsSwitch"
                  size="mini"
                  @change="changeSwitch(smsSwitch, 'sms')"
                >
                  <el-radio-button label="ON" />
                  <el-radio-button label="OFF" />
                </el-radio-group>
              </div>
            </div>
            <div style="padding: 14px;">
              <el-form
                ref="smsRuleForm"
                :model="smsRuleForm"
                :rules="rules"
                label-width="140px"
                class="smsRuleForm"
              >
                <el-form-item prop="port" label="端口">
                  <el-input
                    v-model="smsRuleForm.port"
                    placeholder="ttyS0"
                    :disabled="smsTrue"
                  />
                </el-form-item>
                <el-form-item prop="type" label="调解器类型">
                  <el-input
                    v-model="smsRuleForm.type"
                    placeholder="GPRS"
                    :disabled="smsTrue"
                  />
                </el-form-item>
                <el-form-item prop="num" label="每日短信数量限制">
                  <el-input
                    v-model="smsRuleForm.num"
                    placeholder="500"
                    :disabled="smsTrue"
                  />
                </el-form-item>
                <el-form-item prop="send" label="今日已发送">
                  {{ smsRuleForm.send }}
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    :disabled="smsTrue"
                    @click="submitForm('smsRuleForm')"
                  >确认</el-button>
                  <el-button :disabled="smsTrue" @click="resetForm('smsRuleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-panel-icon-wrapper">
              <svg-icon icon-class="wechat" class-name="card-panel-icon icon-wechat" />
              <div>微信设置</div>
              <div class="switch">
                <el-radio-group
                  v-model="wechatSwitch"
                  size="mini"
                  @change="changeSwitch(wechatSwitch, 'wechat')"
                >
                  <el-radio-button label="ON" />
                  <el-radio-button label="OFF" />
                </el-radio-group>
              </div>
            </div>
            <div style="padding: 14px;">
              <el-form
                ref="wechatRuleForm"
                :model="wechatRuleForm"
                :rules="rules"
                label-width="120px"
                class="wechatRuleForm"
              >
                <el-form-item prop="to_party" label="接收组id">
                  <el-input
                    v-model="wechatRuleForm.to_party"
                    :disabled="wechatTrue"
                  />
                </el-form-item>
                <el-form-item prop="agent_id" label="AgentId">
                  <el-input
                    v-model="wechatRuleForm.agent_id"
                    :disabled="wechatTrue"
                  />
                </el-form-item>
                <el-form-item prop="corp_id" label="CorpId">
                  <el-input
                    v-model="wechatRuleForm.corp_id"
                    :disabled="wechatTrue"
                  />
                </el-form-item>
                <el-form-item prop="api_secret" label="Secret">
                  <el-input
                    v-model="wechatRuleForm.api_secret"
                    :disabled="wechatTrue"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    :disabled="wechatTrue"
                    @click="submitForm('wechatRuleForm')"
                  >确认</el-button>
                  <el-button :disabled="wechatTrue" @click="resetForm('wechatRuleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Notice',
  data() {
    return {
      emailSwitch: 'OFF',
      wechatSwitch: 'OFF',
      smsSwitch: 'OFF',
      emailRuleForm: {
        smtp_smarthost: '',
        smtp_auth_username: '',
        smtp_auth_password: '',
        smtp_from: ''
      },
      wechatRuleForm: {
        to_party: '',
        agent_id: '',
        corp_id: '',
        api_secret: ''
      },
      smsRuleForm: {
        port: '',
        num: '',
        type: '',
        send: 0
      },
      rules: {
        smtp_auth_username: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        smtp_from: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        smtp_smarthost: [
          { required: true, message: '请输入邮箱smtp服务器代理', trigger: 'blur' }
        ],
        smtp_auth_password: [
          { required: true, message: '请输入邮箱密码', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入数量限制', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入调解器类型', trigger: 'blur' }
        ],
        to_party: [
          { required: true, message: '请输入接收组的id', trigger: 'blur' }
        ],
        agent_id: [
          { required: true, message: '请输入AgentId', trigger: 'blur' }
        ],
        corp_id: [
          { required: true, message: '请输入CorpId', trigger: 'blur' }
        ],
        api_secret: [
          { required: true, message: '请输入Secret', trigger: 'blur' }
        ]
      },
      emailTrue: true,
      smsTrue: true,
      wechatTrue: true
    }
  },
  methods: {
    changeSwitch(value, name) {
      if (name === 'email') {
        if (value === 'ON') {
          this.emailTrue = false
        } else {
          this.emailTrue = true
        }
      } else if (name === 'sms') {
        if (value === 'ON') {
          this.smsTrue = false
        } else {
          this.smsTrue = true
        }
      } else if (name === 'wechat') {
        if (value === 'ON') {
          this.wechatTrue = false
        } else {
          this.wechatTrue = true
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  .table-info {
    .card-panel-col {
      .el-card {
        height: 432px;
      }
      .card-panel-icon-wrapper {
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
        text-align: center;
      }
      .card-panel-icon {
        padding: 8px;
        border: 1px solid #eee;
        border-radius: 50%;
        font-size: 48px;
      }
      .icon-email {
        background: #ff0202;
        color: #fff;
      }
      .icon-wechat {
        background: #08c160;
        color: #fff;
      }
      .icon-sms {
        background: #08c160;
        color: #fff;
      }
      .switch {
        position: relative;
        left: 37%;
        top: -75px;
      }
    }
  }
}
</style>
