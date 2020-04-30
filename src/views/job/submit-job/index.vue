<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-row>
            <el-col :span="5">
              <div class="MPI-logo" style="position: relative; height: 100%; padding-top: 60px; " />
            </el-col>
            <el-col :span="19">
              <div class="MPI-title">MPI</div>
              <div
                class="MPI-info"
              >Message Passing Interface (MPI) is a communication standard used in parallelcomputing and HPC applications. Use this template to submit your MPI application.</div>
            </el-col>
          </el-row>
        </div>
        <div class="table-info el-scrollbar">
          <!-- <div class="chooseRadio">
            <el-radio-group v-model="radioForm">
              <el-radio-button label="模板提交" />
              <el-radio-button label="命令行提交" />
            </el-radio-group>
          </div>-->
          <el-row>
            <el-col :xs="24" :sm="24" :lg="24">
              <!-- <div class="add-title">模板提交</div> -->
              <div class="add-form">
                <el-form
                  ref="ruleForm"
                  label-position="top"
                  :model="ruleForm"
                  :rules="rules"
                  label-width="100px"
                  class="add-ruleForm"
                >
                  <div class="add-title">资源选项</div>
                  <el-form-item label="队列" prop="queue">
                    <el-select v-model="ruleForm.queue" clearable placeholder="请选择">
                      <el-option
                        v-for="item in ruleForm.queues"
                        :key="item.value"
                        :label="item.QUEUE_NAME"
                        :value="item.QUEUE_NAME"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="核数" prop="cores">
                    <el-input v-model.number="ruleForm.cores" />
                  </el-form-item>
                  <div class="add-title">模板参数</div>
                  <el-form-item label="运行参数" prop="parameter">
                    <ace :value="shellParameter" :max-lines="1000" :min-lines="20" @input="shellParameterInput" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <!-- <el-col :xs="24" :sm="24" :lg="12" class="submit">
              <div class="add-title">命令行提交</div>
              <div class="container el-scrollbar">
                <div class="head">
                  <div class="head-buttons">
                    <el-button type="primary" size="medium" @click="submitShell()">提交</el-button>
                    <el-button plain size="medium" @click="taskShellValue=''">重置</el-button>
                  </div>
                </div>

                <div class="shell-info el-scrollbar">
                  <ace-shell :value="taskShellValue" :max-lines="40" :min-lines="40" @input="shellInput" />
                </div>
              </div>
            </el-col> -->
          </el-row>
          <!-- <div v-if="formShow">
            <div class="add-title">模板信息</div>
            <div class="add-form">
              <el-form
                ref="ruleForm"
                label-position="top"
                :model="ruleForm"
                :rules="rules"
                label-width="100px"
                class="add-ruleForm"
              >
                <el-form-item label="作业名称" prop="taskName">
                  <el-input v-model="ruleForm.taskName" />
                </el-form-item>
                <div class="add-title">模板参数</div>
                <el-form-item label="运行参数" prop="parameter">
                  <el-input v-model="ruleForm.parameter" />
                </el-form-item>
                <div class="add-title">资源选项</div>
                <el-form-item label="队列" prop="queue">
                  <el-select v-model="ruleForm.queue" clearable placeholder="请选择">
                    <el-option
                      v-for="item in ruleForm.queues"
                      :key="item.value"
                      :label="item.QUEUE_NAME"
                      :value="item.QUEUE_NAME"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="核数" prop="cores">
                  <el-input v-model.number="ruleForm.cores" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>-->
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetLsfQueueList } from '@/api/task'
import { addLsfserver } from '@/api/submit-task'
import Ace from '@/components/Ace'

export default {
  name: 'SubmitTask',
  components: {
    Ace
  },
  data() {
    return {
      formShow: true,
      radioForm: '模板提交',
      shellParameter: `#!/bin/sh
`,
      // 添加信息
      ruleForm: {
        taskName: '',
        parameter: '',
        queue: '',
        queues: [],
        cores: 1
      },
      rules: {
        parameter: [
          {
            required: true,
            message: '请输入运行参数',
            trigger: 'blur'
          }
        ],
        queue: [
          {
            required: true,
            message: '请选择队列',
            trigger: 'blur'
          }
        ],
        cores: [
          { required: true, message: '核数不能为空' },
          { type: 'number', message: '核数必须为数字值' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'name'
    ])
  },
  watch: {
    radioForm() {
      if (this.radioForm === '模板提交') {
        this.formShow = true
      } else {
        this.formShow = false
      }
    }
  },
  mounted() {
    this.getQueues()
  },
  methods: {
    getQueues() {
      const _this = this
      _this.loading = true
      const params = {
        page_size: 1000,
        page_number: 1
      }
      GetLsfQueueList(params)
        .then(res => {
          _this.queues = []
          res.RECORDS.map(function(item, index) {
            item.value = index
            _this.ruleForm.queues.push(item)
          })
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
          _this.loading = false
        })
    },
    shellParameterInput(value) {
      const bool = value.indexOf('#!/bin/sh')
      if (bool !== -1) {
        const index = bool + 9
        this.ruleForm.parameter = value.substring(index)
      } else {
        this.ruleForm.parameter = value
      }
    },
    submitShell() {
      const _this = this
      _this.loading = true
      const scriptContent = `#BSUB n ${this.ruleForm.cores}
#BSUB q ${this.ruleForm.queue}
${this.ruleForm.parameter}`
      const params = {
        username: _this.name,
        scriptContent: `${scriptContent}`
      }
      addLsfserver(params)
        .then(res => {
          const re = /\n/g
          res.stdout = res.stdout.replace(re, '<br>')
          this.$alert(res.stdout, '提交成功！', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定'
          })
        })
        .catch(res => {
          console.log(res)
          _this.loading = false
        })
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.submitShell()
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
  .hasten {
    width: 100%;
    height: 60px;
    margin-bottom: 10px;
    padding: 5px 10px;
    .MPI-logo {
      background-image: url(../../../assets/submit_task_images/mpi.jpg);
      background-repeat: no-repeat;
    }
    .MPI-title {
      font-weight: 600;
      margin-bottom: 5px;
    }
  }
  .table-info {
    height: calc(100vh - 140px);
    overflow: auto;
    .submit {
      border-right: 1px solid #fff;
      -webkit-box-shadow: -1px -5px 5px rgba(0, 0, 0, 0.4);
      box-shadow: -1px -5px 5px rgba(0, 0, 0, 0.4);
    }
    .container {
      padding-left: 10px;
    }
    .chooseRadio {
      margin: 5px;
    }
    .add-title {
      height: 44px;
      background-color: #eff9ff;
      padding: 14px;
    }
    .add-form {
      height: calc(100% - 44px);
      padding-top: 14px;
      .el-form-item {
        margin-left: 30px;
      }
      .el-select,
      .el-input {
        width: 300px;
        margin-right: 10px;
      }
    }
    .head-buttons {
      margin-top: 10px;
    }
  }
  .shell-info {
    height: calc(100vh - 249px);
    overflow: auto;
  }
}
</style>
