<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="head">
          <el-button type="primary" :disabled="roleDisabled" @click="submitForm('ruleForm')">部署</el-button>
          <el-button plain @click="resetForm('ruleForm')">重置</el-button>
        </div>
        <div class="table-info el-scrollbar">
          <div class="add-title">节点部署</div>
          <div class="add-form">
            <el-form
              ref="ruleForm"
              label-position="right"
              :model="ruleForm"
              label-width="180px"
              class="add-ruleForm"
              :inline="true"
            >
              <el-form-item label="xcat server 节点名称:" prop="nodeName">
                <el-input v-model="ruleForm.nodeName" />
              </el-form-item>
              <el-form-item label="域名:" prop="domain">
                <el-input v-model="ruleForm.domain" />
              </el-form-item>
              <el-form-item label="xcat server 节点地址:" prop="nodeAddress">
                <el-input v-model="ruleForm.nodeAddress" />
              </el-form-item>
              <el-form-item label="掩码:" prop="mask">
                <el-input v-model="ruleForm.mask" />
              </el-form-item>
              <el-form-item label="xcat server 节点传输网卡:" prop="nodeNET">
                <el-select v-model="ruleForm.nodeNET" clearable placeholder="请选择">
                  <el-option
                    v-for="item in ruleForm.nodeNETs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="新增节点系数:" prop="nodeNum">
                <el-input-number
                  v-model="ruleForm.nodeNum"
                  controls-position="right"
                  :min="1"
                  @change="handleChange"
                />
              </el-form-item>
              <div v-for="(newNode, index) in ruleForm.newNodes" :key="index" class="newNodes">
                <el-divider content-position="left">新增节点 {{ index + 1 }}</el-divider>
                <el-form-item label="系统地址:" prop="sysAddress">
                  <el-input v-model="newNode.sysAddress" />
                </el-form-item>
                <el-form-item label="主机名:" prop="hostName">
                  <el-input v-model="newNode.hostName" />
                </el-form-item>
                <el-form-item label="MAC:" prop="MAC">
                  <el-input v-model="newNode.MAC" />
                </el-form-item>
                <el-form-item label="IPMI地址:" prop="IPMIAddress">
                  <el-input v-model="newNode.IPMIAddress" />
                </el-form-item>
                <el-form-item label="IPMI用户名:" prop="IPMIName">
                  <el-input v-model="newNode.IPMIName" />
                </el-form-item>
                <el-form-item label="IPMI密码:" prop="IPMIPass">
                  <el-input v-model="newNode.IPMIPass" />
                </el-form-item>
                <el-form-item label="角色:" prop="role">
                  <el-select v-model="newNode.role" clearable placeholder="请选择">
                    <el-option
                      v-for="item in newNode.roles"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      // 添加信息
      ruleForm: {
        nodeName: '',
        domain: '',
        nodeAddress: '',
        mask: '',
        nodeNETs: [{
          value: '1',
          label: 'em1'
        }, {
          value: '2',
          label: 'em2'
        }, {
          value: '3',
          label: 'em3'
        }],
        nodeNET: '',
        nodeNum: 1,
        newNodes: [
          {
            sysAddress: '',
            hostName: '',
            MAC: '',
            IPMIAddress: '',
            IPMIName: '',
            IPMIPass: '',
            roles: [{
              value: '1',
              label: '管理节点'
            }, {
              value: '2',
              label: '计算节点'
            }, {
              value: '3',
              label: '登录节点'
            }],
            role: ''
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'roleDisabled'
    ])
  },
  watch: {
    ruleForm: {
      handler: function(val, oldVal) {
        if (val.nodeNum !== val.newNodes.length) {
          this.handleChange(val.nodeNum)
        }
      },
      deep: true
    }
  },
  methods: {
    handleChange(value) {
      if (this.ruleForm.newNodes.length < value) {
        const node = {
          sysAddress: '',
          hostName: '',
          MAC: '',
          IPMIAddress: '',
          IPMIName: '',
          IPMIPass: ''
        }
        for (let index = this.ruleForm.newNodes.length; index < value; index++) {
          this.ruleForm.newNodes.push(node)
        }
      } else if (this.ruleForm.newNodes.length > value) {
        for (let index = this.ruleForm.newNodes.length; index > value; index--) {
          this.ruleForm.newNodes.pop()
        }
      }
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '开始部署！',
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
      this.ruleForm.newNodes[0].sysAddress = ''
      this.ruleForm.newNodes[0].hostName = ''
      this.ruleForm.newNodes[0].MAC = ''
      this.ruleForm.newNodes[0].IPMIAddress = ''
      this.ruleForm.newNodes[0].IPMIName = ''
      this.ruleForm.newNodes[0].IPMIPass = ''
      this.ruleForm.newNodes[0].role = ''
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
  height: calc(100% - 44px);
  padding-top: 14px;
}
.table-info .add-form .add-ruleForm {
  margin-left: 20px;
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
.table-info .add-form .el-divider {
  margin-bottom: 22px
}
.delete:hover,
.add:hover {
  color: #3c73b9;
  cursor: pointer;
}

.delete,
.add {
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
