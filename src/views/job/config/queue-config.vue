<template>
  <div class="app-container" @click="closeSidepage($event)">
    <div class="head">
      <el-button type="primary" :disabled="roleDisabled" size="small" class="head-button" @click="showAdd">
        <i class="el-icon-plus" />
      </el-button>
      <el-button type="primary" size="small" class="head-button" @click="getList">
        <i class="el-icon-refresh-right" />
      </el-button>
    </div>
    <div class="table-info el-scrollbar">
      <Table ref="table" :data="list" :col-configs="colConfigs" :loading="loading">
        <el-table-column slot="name" label="队列名称名称" align="center" width="200" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span><el-button type="text" @click="showSidepage(row)">{{ row.QUEUE_NAME }}</el-button></span>
          </template>
        </el-table-column>
        <el-table-column slot="enabled" label="启用状态" align="center">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.ENABLED"
              :disabled="roleDisabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchEnable(row)"
            />
          </template>
        </el-table-column>
        <el-table-column slot="operate" label="操作" align="center">
          <template v-slot="{row}">
            <el-button size="mini" type="primary" :disabled="roleDisabled" @click="showEdit(row)">编辑</el-button>
            <el-popover
              v-model="row.deleteVisible"
              placement="top"
              trigger="click"
              width="160"
            >
              <p>确定删除队列吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="row.deleteVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteQueue(row)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" :disabled="roleDisabled" icon="el-icon-delete" size="mini" />
            </el-popover>
          </template>
        </el-table-column>
      </Table>
      <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" />
    </div>
    <el-dialog title="添加队列" :visible.sync="addVisible" width="50%" center top="5vh">
      <el-tabs v-model="activeTab" v-loading="operateLoading" type="border-card">
        <el-tab-pane label="一般模式" name="normal">
          <el-form ref="addForm" :inline="false" :model="addConfig" label-position="right" label-width="150px" :rules="rule">
            <el-form-item label="队列设置" />
            <el-form-item label="队列名" prop="QUEUE_NAME">
              <el-input v-model="addConfig.QUEUE_NAME" placeholder="队列名" style="width:50%;" />
            </el-form-item>
            <el-form-item label="优先值" prop="PRIORITY">
              <el-input v-model.number="addConfig.PRIORITY" placeholder="请输入0-100的整数" style="width:40%;" />
            </el-form-item>
            <el-form-item label="交互式">
              <el-radio-group v-model="addConfig.INTERACTIVE">
                <el-radio label="YES">YES</el-radio>
                <el-radio label="NO">NO</el-radio>
                <el-radio label="ONLY">ONLY</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="启用">
              <el-switch v-model="addConfig.ENABLED" active-value="true" inactive-value="false" />
            </el-form-item>
            <el-form-item label="主机/主机组">
              <el-select v-model="addConfig.HOSTS" multiple placeholder="请选择">
                <el-option
                  v-for="item in hosts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户/用户组" prop="USERS">
              <el-input v-model="addConfig.USERS" placeholder="用户/用户组,可用空格分开,全部请输入all" />
            </el-form-item>
            <el-form-item label="队列最大运行作业数" prop="QJOB_LIMIT">
              <el-input v-model.number="addConfig.QJOB_LIMIT" placeholder="队列最大运行作业数" style="width:40%;" />
            </el-form-item>
            <el-form-item label="队列用户最大作业数" prop="UJOB_LIMIT">
              <el-input v-model.number="addConfig.UJOB_LIMIT" placeholder="队列内每个用户最大运行作业数" style="width:40%;" />
            </el-form-item>
            <el-form-item label="队列最大运行时间" prop="CPULIMIT">
              <el-input v-model.number="addConfig.CPULIMIT" placeholder="队列最大运行时间,按分钟计数" style="width:40%;" />
            </el-form-item>
            <el-form-item label="队列描述">
              <el-input v-model="addConfig.DESCRIPTION" type="textarea" placeholder="队列描述" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="文本模式" name="aceEdit">
          <Ace :value="defaultAce" :reset="addConfig.resetAce" @input="handleAceInput" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button type="primary" @click="add">确认</el-button>
        <el-button type="primary" @click="cancelOperate('add')">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑配置" :visible.sync="editVisible" width="50%" top="5vh">
      <el-tabs v-model="activeTab" v-loading="operateLoading" type="border-card">
        <el-tab-pane label="一般模式" name="normal">
          <el-form ref="editForm" :inline="false" :model="editConfig" label-position="right" label-width="150px" :rules="rule">
            <el-form-item label="队列名">
              <el-input v-model="editConfig.QUEUE_NAME" disabled placeholder="队列名" style="width:50%;" />
            </el-form-item>
            <el-form-item label="优先值" prop="PRIORITY">
              <el-input v-model.number="editConfig.PRIORITY" placeholder="优先值" style="width:40%;" />
            </el-form-item>
            <el-form-item label="交互式">
              <el-radio-group v-model="editConfig.INTERACTIVE">
                <el-radio label="YES">YES</el-radio>
                <el-radio label="NO">NO</el-radio>
                <el-radio label="ONLY">ONLY</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="启用">
              <el-switch v-model="editConfig.ENABLED" />
            </el-form-item>
            <el-form-item label="主机/主机组">
              <el-select v-model="editConfig.HOSTS" multiple placeholder="请选择">
                <el-option
                  v-for="item in hosts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户/用户组" prop="USERS">
              <el-input v-model="editConfig.USERS" placeholder="用户/用户组,可用空格分开,全部请输入all" />
            </el-form-item>
            <el-form-item label="队列最大运行作业数" prop="QJOB_LIMIT">
              <el-input v-model="editConfig.QJOB_LIMIT" placeholder="队列最大运行作业数" style="width:40%;" />
            </el-form-item>
            <el-form-item label="队列用户最大作业数" prop="UJOB_LIMIT">
              <el-input v-model="editConfig.UJOB_LIMIT" placeholder="队列用户最大作业数" style="width:40%;" />
            </el-form-item>
            <el-form-item label="队列最大运行时间" prop="CPULIMIT">
              <el-input v-model="editConfig.CPULIMIT" placeholder="队列最大运行时间" style="width:40%;" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="editConfig.DESCRIPTION" type="textarea" placeholder="描述" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="文本模式" name="aceEdit">
          <Ace :value="editConfig.strConfig" :reset="editConfig.resetAce" @input="handleAceInput" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button type="primary" @click="edit">确认</el-button>
        <el-button type="primary" @click="cancelOperate('edit')">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQueueConfig, putQueueConfig, deleteQueueConfig } from '@/api/consul'
import { GetLsfHostList, CheckQueuesConfig } from '@/api/task'
import Ace from '@/components/Ace'
import Table from '@/components/Table'
import Sidepage from './Sidepage/queueSidepage'
import SidepageMixin from '@/mixin/toggleSidepage'

const rule = {
  QUEUE_NAME: [{ required: true, message: '请输入列名,仅包括大小写英文字母和数组', pattern: /^\w*$/ }],
  PRIORITY: [{ message: '请输入0-100的整数', min: 0, max: 100, trigger: 'change', pattern: /^[0-9]{1,2}$/ }],
  USERS: [{ message: '用户/用户组,可用空格分开,全部请输入all', trigger: 'change', pattern: /^[\w ]*$/ }],
  QJOB_LIMIT: [{ message: '请输入整数', min: 0, trigger: 'change', pattern: /^[0-9]*$/ }],
  UJOB_LIMIT: [{ message: '请输入整数', min: 0, trigger: 'change', pattern: /^[0-9]*$/ }],
  CPULIMIT: [{ message: '请输入整数', min: 0, trigger: 'change', pattern: /^[0-9]*$/ }]
}

const config = {
  QUEUE_NAME: '',
  PRIORITY: '',
  INTERACTIVE: '',
  ENABLED: false,
  HOSTS: '',
  USERS: '',
  QJOB_LIMIT: '',
  UJOB_LIMIT: '',
  CPULIMIT: '',
  DESCRIPTION: ''
}
export default {
  name: 'QueueConfig',
  components: {
    Table,
    Sidepage,
    Ace
  },
  mixins: [SidepageMixin],
  data() {
    return {
      list: [],
      colConfigs: [
        { slot: 'name' },
        { prop: 'PRIORITY', label: '优先值' },
        { prop: 'INTERACTIVE', label: '交互式' },
        { slot: 'enabled' },
        { slot: 'operate' }
      ],
      loading: false,
      sidepagedata: {
        list: {},
        sidepageShow: false
      },
      operateLoading: false,
      addConfig: JSON.parse(JSON.stringify(config)),
      editConfig: JSON.parse(JSON.stringify(config)),
      addVisible: false,
      editVisible: false,
      activeTab: 'normal',
      defaultAce: 'Begin Queue\nQUEUE_NAME=\nEnd Queue',
      aceInput: '',
      hosts: [],
      rule: rule
    }
  },
  computed: {
    ...mapGetters([
      'roleDisabled'
    ])
  },
  watch: {
    sidepagedata: {
      handler: function(val) {
        if (!val.sidepageShow) {
          this.getList()
        }
      },
      deep: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.getQueueConfig()
    },

    async getQueueConfig() {
      this.list = []
      this.loading = true
      const Base64 = require('js-base64').Base64
      const res = await getQueueConfig()
      const obj = {}
      res.map(item => {
        const path = item.Key.match(/.+lsb\.queues\/(\w+)\/(\w+)/)
        if (!obj[path[1]]) {
          obj[path[1]] = {}
          obj[path[1]][path[2]] = Base64.decode(item.Value)
        } else {
          obj[path[1]][path[2]] = Base64.decode(item.Value)
        }
      })

      for (const value of Object.values(obj)) {
        const queue = this.parseStrConfig(value.data)
        queue.ENABLED = JSON.parse(value.metadata).enabled
        queue.strConfig = value.data
        this.list.push(queue)
      }
      this.loading = false
    },

    parseStrConfig(value) {
      const queue = {}
      const strConfig = value.trim().split(/\n/)
      strConfig.map(item => {
        const arr = item.trim().split('=')
        queue[arr[0].trim()] = arr[1] ? arr[1].trim() : arr[1]
      })
      delete queue['Begin Queue']
      delete queue['End Queue']
      return queue
    },
    async GetLsfHostList() {
      const res = await GetLsfHostList({ page_size: 10000, page_number: 1 })
      this.hosts = res.RECORDS.map(item => {
        return { value: item.HOST_NAME, label: item.HOST_NAME }
      })
    },
    showAdd() {
      this.GetLsfHostList()
      this.addVisible = true
      this.addConfig.resetAce = true
    },
    showEdit(row) {
      this.editConfig = JSON.parse(JSON.stringify(row))
      this.GetLsfHostList()
      this.editConfig.resetAce = true
      this.editVisible = true
    },
    add() {
      this.comfirmOperate(this.addConfig, 'add')
    },
    edit() {
      this.comfirmOperate(this.editConfig, 'edit')
    },

    cancelOperate(operate) {
      if (operate === 'edit' && this.aceInput && this.aceInput !== this.editConfig.strConfig) {
        const { Path, metadata } = this.formatStrConfig(this.editConfig.strConfig)
        const data = this.editConfig.strConfig
        Promise.all([putQueueConfig(`${Path}/data`, data), putQueueConfig(`${Path}/metadata`, metadata)]).then(() => {
          this.getList()
        })
      } else {
        this[`${operate}Config`] = {}
      }
      this.$refs[`${operate}Form`].resetFields()
      this[`${operate}Visible`] = false
      this.editConfig.resetAce = false
      this.aceInput = ''
      this.operateLoading = false
    },
    switchEnable(row) {
      const metadata = {
        name: row.QUEUE_NAME,
        desc: row.DESCRIPTION,
        enabled: row.ENABLED
      }
      putQueueConfig(`${row.QUEUE_NAME}/metadata`, metadata).then(res => {
        if (res) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
      })
    },
    deleteQueue(row) {
      deleteQueueConfig(row.QUEUE_NAME).then(res => {
        this.$message({
          message: '成功删除',
          type: 'success'
        })
        this.getList()
      })
    },
    handleAceInput(v) {
      this.aceInput = v
    },
    async comfirmOperate(config, operate) {
      clearTimeout(timer)
      let finalData = ''
      let finalMetadata = {}
      let finalPath = ''
      this.operateLoading = true
      if (this.activeTab === 'normal') {
        finalMetadata = {
          name: `${config['QUEUE_NAME']}`,
          desc: `${config['DESCRIPTION']}`,
          enabled: JSON.parse(config['ENABLED'])
        }
        finalPath = config.QUEUE_NAME
        const valid = await this.$refs[`${operate}Form`].validate()
        if (!valid) { return }
        finalData = this.parseConfigStr(config)
      } else if (this.activeTab === 'aceEdit') {
        if (!this.aceInput || this.aceInput === this.editConfig.strConfig) {
          this.cancelOperate(operate)
          return
        }
        const { Path, metadata } = this.formatStrConfig(this.aceInput)
        finalPath = Path
        finalMetadata = metadata
        finalData = this.aceInput
      }
      const put = await Promise.all([putQueueConfig(`${finalPath}/data`, finalData), putQueueConfig(`${finalPath}/metadata`, finalMetadata)])
      if (!put.length > 0) { return }
      const timer = setTimeout(async() => {
        const res = await CheckQueuesConfig()
        if (res.stderr.includes('No errors found')) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.operateLoading = false
          this[`${operate}Visible`] = false
          this.getList()
        } else {
          this.$message({
            message: `修改出错啦，出错内容：\n${res.stderr}`,
            type: 'error',
            duration: 0,
            showClose: true
          })
          this.operateLoading = false
        }
      }, 3000)
    },

    parseConfigStr(config, filterArr = ['ENABLED', 'strConfig', 'resetAce']) {
      const resultArr = []
      for (const [key, value] of Object.entries(config)) {
        if (filterArr.indexOf(key) >= 0 || !value || value.length <= 0) { continue }
        if (key === 'HOSTS' && value.length > 0) {
          resultArr.push([`${key}=${value.join(' ')}`])
          continue
        }
        resultArr.push([`${key}=${value}`])
      }
      resultArr.unshift('Begin Queue')
      resultArr.push('End Queue')
      return resultArr.join('\n')
    },

    formatStrConfig(str) {
      const queue = this.parseStrConfig(str)
      const metadata = {
        name: `${queue['QUEUE_NAME']}`,
        desc: queue['DESCRIPTION'] ? `${queue['DESCRIPTION']}` : '',
        enabled: true
      }
      const Path = queue.QUEUE_NAME
      return { Path, metadata }
    }

  }
}
</script>

<style lang="scss" scoped>
.head-button{
  margin-right: 10px;
  &:first-child{
    margin-right: 0;
  }
}
</style>
