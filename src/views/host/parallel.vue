<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="table-info el-scrollbar">
          <div class="parallel-title">并行处理</div>
          <el-row :gutter="40" class="panel-group">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel" @click="handleSetLineChartData('boot')">
                <div class="card-panel-icon-wrapper icon-boot">
                  <i class="el-icon-switch-button card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">远程开机</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel" @click="handleSetLineChartData('shutdown')">
                <div class="card-panel-icon-wrapper icon-shutdown">
                  <i class="el-icon-switch-button card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">远程关机</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel" @click="handleSetLineChartData('shell')">
                <div class="card-panel-icon-wrapper icon-shell">
                  <i class="el-icon-document-copy card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">并行shell</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel" @click="handleSetLineChartData('source')">
                <div class="card-panel-icon-wrapper icon-source">
                  <i class="el-icon-copy-document card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">并行拷贝</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-dialog :title="title" :visible.sync="addVisible" width="30%">
          <el-form ref="ruleForm" :model="nodeInfo" label-position="left">
            <el-form-item>
              <el-radio v-model="nodeInfo.radio" label="1">节点类型</el-radio>
              <el-radio v-model="nodeInfo.radio" label="2">节点名称</el-radio>
            </el-form-item>
            <el-form-item>
              <el-select
                v-show="nodeInfo.radio==='1'"
                v-model="nodeInfo.nodeType"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in nodeInfo.nodeTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-show="nodeInfo.radio==='2'"
                v-model="nodeInfo.nodeName"
                placeholder="多个节点请用' , '分开"
              />
            </el-form-item>
            <el-form-item v-show="shellShow" label="执行命令">
              <el-input v-model="nodeInfo.shell" />
            </el-form-item>
            <el-form-item v-show="copyShow" label="拷贝文件">
              <el-input v-model="nodeInfo.source" class="copyInput" placeholder="源文件" />
              <el-input v-model="nodeInfo.target" class="copyInput" placeholder="目标文件" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="roleDisabled" @click="submitForm('ruleForm')">确定</el-button>
              <el-button plain @click="resetForm('ruleForm')">重置</el-button>
              <el-button type="info" @click="addVisible=false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { hostRemote, parallelShell, parallelCopy } from '@/api/parallel'

export default {
  data() {
    return {
      title: '',
      addVisible: false,
      nodeInfo: {
        radio: '1',
        nodeTypes: [{
          value: 'all',
          label: '全部(all)'
        }, {
          value: 'manager',
          label: '管理节点(manager)'
        }, {
          value: 'computer',
          label: '计算节点(computer)'
        }, {
          value: 'login',
          label: '登录节点(login)'
        }],
        nodeType: '',
        nodeName: '',
        shell: '',
        source: '',
        target: ''
      },
      shellShow: false,
      copyShow: false,
      type: ''
    }
  },
  computed: {
    ...mapGetters([
      'roleDisabled'
    ])
  },
  methods: {
    handleSetLineChartData(type) {
      this.type = type
      this.shellShow = false
      this.copyShow = false
      if (type === 'boot') {
        this.title = '远程开机'
      } else if (type === 'shutdown') {
        this.title = '远程关机'
      } else if (type === 'shell') {
        this.title = '并行shell'
        this.shellShow = true
      } else if (type === 'source') {
        this.title = '并行拷贝'
        this.copyShow = true
      }
      this.addVisible = true
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {}
          if (_this.nodeInfo.radio === '1') {
            params.hostInfo = _this.nodeInfo.nodeType
          } else if (_this.nodeInfo.radio === '2') {
            params.hostInfo = _this.nodeInfo.nodeName
          }
          if (_this.type === 'boot' || _this.type === 'shutdown') {
            if (_this.type === 'boot') {
              params.status = 'on'
            } else if (_this.type === 'shutdown') {
              params.status = 'off'
            }
            hostRemote(params)
              .then(res => {
                if (_this.type === 'boot') {
                  _this.out(res, '远程开机')
                } else if (_this.type === 'shutdown') {
                  _this.out(res, '远程关机')
                }
              }).catch(e => {
                console.log('error', e)
              })
          } else if (_this.type === 'shell') {
            params.command = _this.nodeInfo.shell
            parallelShell(params)
              .then(res => {
                _this.out(res, '并行shell')
              }).catch(e => {
                console.log('error', e)
              })
          } else if (_this.type === 'source') {
            params.sourceFile = _this.nodeInfo.source
            params.targetDirectory = _this.nodeInfo.target
            parallelCopy(params)
              .then(res => {
                _this.out(res, '并行拷贝')
              }).catch(e => {
                console.log('error', e)
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.nodeInfo.nodeType = ''
      this.nodeInfo.nodeName = ''
      this.nodeInfo.shell = ''
      this.nodeInfo.source = ''
      this.nodeInfo.target = ''
    },
    out(res, name) {
      const _this = this
      let data = ''
      // console.log(res.stdout)
      // console.log(res.stderr)
      // const boolBrOut = res.stdout

      const re = /\n/g
      res.stdout = res.stdout.replace(re, '<br>')
      res.stderr = res.stderr.replace(re, '<br>')

      if (res.stdout !== '' && res.stderr !== '') {
        data = `${res.stdout}<br>${res.stderr}`
      } else if (res.stdout !== '' && res.stderr === '') {
        data = `${res.stdout}`
      } else if (res.stdout === '' && res.stderr !== '') {
        data = `${res.stderr}`
      }
      _this.$alert(data, name, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        callback: action => {
          _this.addVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  .el-container {
    height: 100%;
  }
  .el-main {
    overflow: hidden;
    .el-select,
    .el-input {
      width: 90%;
    }
    .copyInput {
      width: 40%;
      float: left;
      margin-left: 4px;
    }
  }
  .table-info {
    .parallel-title {
      width: 100%;
      height: 44px;
      background-color: #eff9ff;
      padding: 14px;
    }
    .panel-group {
      margin-top: 18px;
      .card-panel-col {
        margin-bottom: 32px;
      }
      .card-panel {
        height: 108px;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        overflow: hidden;
        color: #666;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
        border-color: rgba(0, 0, 0, 0.05);
        &:hover {
          .card-panel-icon-wrapper {
            color: #fff;
          }
          .icon-boot {
            background: #79d622;
          }
          .icon-shutdown {
            background: #f73636;
          }
          .icon-shell {
            background: #51cef4;
          }
          .icon-source {
            background: #34bfa3;
          }
        }
        .icon-boot {
          color: #79d622;
        }
        .icon-shutdown {
          color: #f73636;
        }
        .icon-shell {
          color: #51cef4;
        }
        .icon-source {
          color: #34bfa3;
        }
        .card-panel-icon-wrapper {
          float: left;
          margin: 14px 0 0 14px;
          padding: 16px;
          transition: all 0.38s ease-out;
          border-radius: 6px;
        }
        .card-panel-icon {
          float: left;
          font-size: 48px;
        }
        .card-panel-description {
          font-weight: bold;
          margin: 38px 0;
          text-align: center;
          .card-panel-text {
            font-size: 28px;
          }
          .card-panel-num {
            font-size: 20px;
          }
        }
      }
    }
  }
}
@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
