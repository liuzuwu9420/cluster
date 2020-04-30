<template>
  <div class="app-container" @click="closeSidepage($event)">
    <div class="head">
      <el-button type="primary" :disabled="roleDisabled" size="small" class="head-button" @click="jumpAddAlarmRule">
        <i class="el-icon-plus" />
      </el-button>
      <el-button type="primary" size="small" class="head-button" @click="getList">
        <i class="el-icon-refresh-right" />
      </el-button>
    </div>
    <div class="table-info el-scrollbar">
      <Table ref="table" :data="list" :col-configs="colConfigs" :loading="loading">
        <el-table-column slot="name" label="名称" align="center" width="200" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span><el-button type="text" @click="showSidepage(row)">{{ row.metadata.name }}</el-button></span>
          </template>
        </el-table-column>
        <el-table-column slot="severity" label="报警级别" align="center" width="80">
          <template v-slot="{row}">
            <el-tag size="mini" :type="statusObj(row).type">{{ statusObj(row).name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column slot="enabled" label="启用状态" align="center">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.metadata.enabled"
              :disabled="roleDisabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeAlarm(row)"
            />
          </template>
        </el-table-column>
        <el-table-column slot="operate" label="操作" align="center">
          <template v-slot="{row}">
            <el-popover
              v-model="row.deleteVisible"
              placement="top"
              trigger="click"
              width="160"
            >
              <p>确定删除该报警器吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="row.deleteVisible = false">取消</el-button>
                <el-button type="primary" :disabled="roleDisabled" size="mini" @click="deleteGroupsData(row)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" :disabled="roleDisabled" icon="el-icon-delete" size="mini" />
            </el-popover>
          </template>
        </el-table-column>
      </Table>
      <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Base64 } from 'js-base64'
import { getConsulAlarm, changeConsulAlarm, deleteConsulAlarm } from '@/api/consul'
import Table from '@/components/Table'
import Sidepage from './Sidepage/rule'
import SidepageMixin from '@/mixin/toggleSidepage'

const statusMap = {
  紧急: {
    name: '紧急',
    type: 'danger'
  },
  非常严重: {
    name: '非常严重',
    type: 'danger'
  },
  严重告警: {
    name: '严重告警',
    type: 'danger'
  },
  严重: {
    name: '严重',
    type: 'warning'
  },
  提示: {
    name: '提示',
    type: ''
  },
  未知: {
    name: '未知',
    type: 'info'
  }
}

export default {
  name: 'AlarmRule',
  components: {
    Table,
    Sidepage
  },
  mixins: [SidepageMixin],
  data() {
    return {
      statusMap: statusMap,
      list: [],
      colConfigs: [
        { slot: 'name' },
        { prop: 'metadata.desc', label: '报警条目' },
        { slot: 'severity' },
        { slot: 'enabled' },
        { slot: 'operate' }
      ],
      loading: false,
      // Sidepage
      sidepagedata: {
        rules: {},
        sidepageShow: false
      }
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
    statusObj(row) {
      if (row.data.severity) {
        return statusMap[row.data.severity]
      } else {
        return statusMap['未知']
      }
    },
    getList() {
      const _this = this
      const params = {
        recurse: true
      }
      _this.list = []
      getConsulAlarm(params)
        .then(data => {
          data.map((item, index) => {
            item.deleteVisible = false
            const i = item.Key.lastIndexOf('/')
            item.url = item.Key.substring(0, i)
            const dataKey = item.Key.substring(i + 1)
            item.Value = Base64.decode(item.Value)
            if (dataKey === 'data') {
              item.metadata = ''
              item.metadataValue = ''
              item.matedataArr = []
              item.data = {
                expr: {},
                for: {}
              }
              const valueArr = item.Value.split('\n')
              valueArr.map(function(valueItem, index) {
                const bool1 = valueItem.indexOf('name')
                const bool2 = valueItem.indexOf('alert')
                const bool3 = valueItem.indexOf('expr')
                const bool4 = valueItem.indexOf('for')
                const bool5 = valueItem.indexOf('severity')
                const bool6 = valueItem.indexOf('summary')
                if (bool1 !== -1) {
                  const itemArr = valueItem.split(':')
                  item.data.name = _this._.trim(itemArr[1])
                } else if (bool2 !== -1) {
                  const itemArr = valueItem.split(':')
                  item.data.alert = _this._.trim(itemArr[1])
                } else if (bool3 !== -1) {
                  const itemArr = valueItem.split(':')
                  const strArr = _this._.trim(itemArr[1]).split(' ')
                  item.data.expr.condition = strArr[strArr.length - 2]
                  item.data.expr.value = strArr[strArr.length - 1]
                  const exprIndex = itemArr[1].indexOf(item.data.expr.condition)
                  item.data.expr.expr = _this._.trim(itemArr[1].substring(0, exprIndex))
                } else if (bool4 !== -1) {
                  const itemArr = valueItem.split(':')
                  const str = _this._.trim(itemArr[1])
                  item.data.for.condition = str.substring(str.length - 1)
                  item.data.for.value = str.substring(0, str.length - 1)
                } else if (bool5 !== -1) {
                  const itemArr = valueItem.split(':')
                  item.data.severity = _this._.trim(itemArr[1])
                } else if (bool6 !== -1) {
                  const itemArr = valueItem.split(':')
                  item.data.summary = _this._.trim(itemArr[2])
                }
              })
              _this.list.push(item)
            } else {
              _this.list[(index - 1) / 2].matedataArr.push(item)
              const Value = JSON.parse(item.Value)
              _this.list[(index - 1) / 2].metadata = Value
              _this.list[(index - 1) / 2].metadataValue = item.Value
            }
          })
        })
        .catch(e => {
          console.log('e', e)
        })
    },
    changeAlarm(row) {
      const _this = this
      const url = `${row.metadata.key}/metadata`
      const params = `{
  "key": "${row.metadata.key}",
  "name": "${row.metadata.name}",
  "desc": "${row.metadata.desc}",
  "enabled": ${row.metadata.enabled}
}`
      changeConsulAlarm(url, params)
        .then(data => {
          if (data) {
            // _this.getList()
            _this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }
        })
        .catch(e => {
          console.log('e', e)
        })
    },

    async deleteGroupsData(row) {
      const _this = this
      try {
        const params = `${row.url}?recurse=true`
        await deleteConsulAlarm(params)
        _this.$message({
          type: 'success',
          message: '删除成功!'
        })
        _this.getList()
      } catch {
        _this.$message({
          type: 'info',
          message: '删除失败!'
        })
      }
    },

    jumpAddAlarmRule() {
      this.$router.push({
        name: 'Add alarm rule'
      })
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
