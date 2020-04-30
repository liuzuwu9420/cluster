<template>
  <div class="app-container">
    <div class="head">
      <div class="head-buttons">
        <el-button :disabled="roleDisabled" type="primary" size="small" class="head-button" @click="showAdd">
          <i class="el-icon-plus" />
        </el-button>
        <el-dialog title="添加计费规则" :visible.sync="addVisible" width="30%">
          <el-form ref="ruleForm" :inline="false" :model="addConfig" label-position="right" label-width="100px" :rules="rules">
            <el-form-item label="队列名称" prop="queue_name">
              <el-select v-model="addConfig.queue_name" placeholder="请选择">
                <el-option
                  v-for="item in queues"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="计费对象" prop="resource_name">
              <el-radio-group v-model="addConfig.resource_name">
                <el-radio-button label="CPU">CPU</el-radio-button>
                <el-radio-button label="HOST">HOST</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="单价" prop="price">
              <el-input v-model.number="addConfig.price" placeholder="请输入数字" />
            </el-form-item>
            <el-form-item label="时间单位" prop="time_unit">
              <el-radio-group v-model="addConfig.time_unit">
                <el-radio-button label="D">天</el-radio-button>
                <el-radio-button label="H">小时</el-radio-button>
                <el-radio-button label="M">分钟</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="addConfig.Desc" placeholder="描述" />
            </el-form-item>
            <div class="click-button-container">
              <el-form-item>
                <el-button type="primary" @click="add('ruleForm')">添加</el-button>
                <el-button type="primary" @click="cancelAdd('ruleForm')">取消</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-dialog>
        <el-button type="primary" size="small" class="head-button" @click="getList">
          <i class="el-icon-refresh-right" />
        </el-button>
      </div>
    </div>
    <div class="table-info">
      <Table ref="table" :data="billRules" :col-configs="colConfigs" :loading="loading">
        <el-table-column slot="operate" label="操作" align="center">
          <template v-slot="{row}">
            <el-button
              v-if="!row.edit"
              :disabled="roleDisabled"
              type="primary"
              size="mini"
              @click="row.edit=!row.edit"
            >编辑</el-button>
            <el-button-group v-else>
              <el-button
                type="success"
                size="mini"
                @click="confirmEdit(row)"
              >确认</el-button>
              <el-button
                type="info"
                size="mini"
                @click="cancelEdit(row)"
              >取消</el-button>
            </el-button-group>
            <el-popover
              v-model="row.deleteVisible"
              placement="top"
              trigger="click"
              width="160"
            >
              <p>确定删除配置吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="row.deleteVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteConfig(row)">确定</el-button>
              </div>
              <el-button slot="reference" :disabled="roleDisabled" type="danger" size="mini">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </Table>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQueueBill, putQueueBill, deleteQueueBill } from '@/api/consul'
import { GetLsfQueueList } from '@/api/task'
import Table from '@/components/Table'
import { formatDate } from '@/utils/format'

const editInTable = {
  props: ['colConfig'],
  template: `
  <el-table-column :label='colConfig.label' align="center">
    <template v-slot="{row}">
        <el-input v-if="row.edit" v-model="row[colConfig.prop]" size="small" style="align-content: center;" />
        <span v-else>{{row[colConfig.prop] }}</span>
    </template>
  </el-table-column>
  `
}
const selectInTable = {
  props: ['colConfig'],
  template: `
  <el-table-column :label='colConfig.label' align="center">
    <template v-slot="{row}">
    <el-select v-if="row.edit" v-model="row[colConfig.prop]" size="small">
    <el-option v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"></el-option>
    </el-select>
        <span v-else>{{row[colConfig.prop] | time_unit}}</span>
    </template>
  </el-table-column>
  `,
  data() {
    return {
      options: []
    }
  },
  filters: {
    time_unit(v) {
      switch (v) {
        case 'D':
          return '天'
        case 'H':
          return '小时'
        case 'M':
          return '分钟'
        default:
          return v
      }
    }
  },
  mounted() {
    if (this.colConfig.prop === 'time_unit') {
      this.options = [{ value: 'M', label: '分钟' }, { value: 'H', label: '小时' }, { value: 'D', label: '天' }]
    } else if (this.colConfig.prop === 'resource_name') {
      this.options = [{ value: 'CPU', lable: 'CPU' }, { value: 'HOST', label: 'HOST' }]
    }
  }
}

export default {
  components: {
    Table
  },

  data() {
    return {
      billRules: [],
      queues: [],
      loading: false,
      addVisible: false,
      // 节点添加信息
      addConfig: {
        queue_name: '',
        price: '',
        resource_name: '',
        time_unit: '',
        created: '',
        Desc: ''
      },
      colConfigs: [
        { prop: 'queue_name', label: '队列名称' },
        { prop: 'price', label: '单价', component: editInTable },
        { prop: 'resource_name', label: '计费对象', component: selectInTable },
        { prop: 'time_unit', label: '时间单位', component: selectInTable },
        { prop: 'created', label: '创建时间' },
        { prop: 'Desc', label: '描述', component: editInTable },
        { slot: 'operate', label: '操作' }

      ],
      rules: {
        queue_name: [
          { required: true, message: '请输入队列名称' }
        ],
        resource_name: [
          { required: true, message: '请选择计费对象' }
        ],
        price: [
          { type: 'number', required: true, message: '请输入单价' }
        ],
        time_unit: [
          { required: true, message: '请选择时间单位' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'roleDisabled'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    async getList(query) {
      this.loading = true
      const Base64 = require('js-base64').Base64
      const res = await getQueueBill()
      if (!res) { return }
      this.billRules = res.map((item) => {
        let obj = {}
        obj = JSON.parse(Base64.decode(item.Value))
        obj.queue_name = item.Key.replace(/lsf\/job-meter\//, '')
        obj.created = obj.created ? formatDate(obj.created) : ''
        this.$set(obj, 'edit', false)
        obj.originalqueue_name = obj.queue_name
        obj.originalprice = obj.price
        obj.deleteVisible = false
        return obj
      })
      this.loading = false
    },

    async GetLsfQueueList() {
      const res = await GetLsfQueueList({ page_size: 500, page_number: 1 })
      if (!res) { return }
      const data = res.RECORDS.map((item, index) => {
        return { value: item.QUEUE_NAME, label: item.QUEUE_NAME }
      })
      this.queues = data
    },

    showAdd() {
      this.GetLsfQueueList()
      this.addVisible = true
    },

    async add(formName) {
      this.addConfig.created = (new Date()).toISOString()
      const data = this.addConfig
      const valid = await this.$refs[formName].validate()
      if (!valid) {
        return false
      } else {
        putQueueBill(this.addConfig.queue_name, data).then((res) => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.cancelAdd(formName)
          this.getList()
        })
      }
    },

    cancelAdd(formName) {
      this.addConfig = {}
      this.addVisible = false
      this.$refs[formName].resetFields()
    },

    confirmEdit(row) {
      row.originalqueue_name = row.queue_name
      row.originalprice = row.price
      putQueueBill(row.queue_name, row).then(res => {
        this.getList()
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
      })
    },
    cancelEdit(row) {
      row.queue_name = row.originalqueue_name
      row.price = row.originalprice
      row.edit = false
      this.$refs.table.$refs['el-table'].setCurrentRow()
      this.$message({
        message: '取消设置',
        type: 'warning'
      })
    },
    deleteConfig(row) {
      deleteQueueBill(row.queue_name).then(res => {
        this.getList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.head-button {
  margin-right: 10px;
  }
</style>
