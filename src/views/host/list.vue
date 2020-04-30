<template>
  <div class="app-container">
    <div class="head">
      <div class="head-buttons">
        <el-button type="primary" size="small" class="head-button" @click="getList">
          <i class="el-icon-refresh-right" />
        </el-button>
        <search class="head-button" :items="selected.items" @change="searchChanged" @closeSearch="closeSearch" />
      </div>
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
    <div class="table-info">
      <Table ref="table" :data="devices" :col-configs="colConfigs" :loading="loading">
        <el-table-column slot="HostName" label="节点名称" align="center" width="200">
          <template v-slot="{row}">
            <span>
              <el-button type="text" @click="jumpFrame(row)">{{ row.HostName }}</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column slot="Status" label="状态" align="center" width="80">
          <template v-slot="{row}">
            <el-tag size="mini" :type="statusObj(row).type">{{ statusObj(row).name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column slot="xcatStatus" label="电源" align="center" width="80">
          <template v-slot="{row}">
            <el-tag size="mini" :type="powerStatusObj(row).type">{{ powerStatusObj(row).name }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column slot="labels" label="标签" align="center" width="80">
          <template v-slot="{row}">
            <tags v-if="row.Tags" :host-u-u-i-d="row.UUID" :tags="row.Tags" />
          </template>
        </el-table-column> -->
        <el-table-column slot="BMCIP" label="BMC-IP" align="center">
          <template v-slot="{row}">
            <clipboard v-show="row.BMCIP" :text="row.BMCIP">
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">用户名：{{ row.bmcusername }}<br>密码：{{ row.bmcpassword }}</div>
                <span class="jumpLink" @click="openTab(row)">{{ row.BMCIP }}</span>
              </el-tooltip>
            </clipboard>
          </template>
        </el-table-column>
        <el-table-column slot="operate" label="操作" align="center">
          <template v-slot="{row}">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="SSH" placement="top">
                <el-button
                  type="info"
                  :disabled="roleDisabled"
                  size="mini"
                  @click="SSHShow(row)"
                >
                  SSH
                </el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </Table>
      <!-- <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" /> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetPrometheus } from '@/api/prometheus'
import { getEsDataBySql } from '@/api/elasticsearch'
import Search from '@/components/Search'
import Pagination from '@/components/Pagination'
// import Sidepage from './components/Sidepage'
import Clipboard from '@/components/Clipboard'
import Table from '@/components/Table'

const statusMap = {
  OFF: {
    name: '不正常',
    type: 'danger'
  },
  ON: {
    name: '正常',
    type: 'success'
  },
  UNKNOWN: {
    name: '未知',
    type: 'info'
  }
}
const powerSupplyMap = {
  'powering-off': {
    name: '关机',
    type: 'danger'
  },
  booted: {
    name: '开机',
    type: 'success'
  },
  UNKNOWN: {
    name: '未知',
    type: 'info'
  }
}
export default {
  name: 'List',
  components: {
    Pagination,
    Clipboard,
    Table,
    Search
  },
  filters: {
    Status(Status) {
      return statusMap[Status].name
    },
    powerSupply(powerSupply) {
      return powerSupplyMap[powerSupply].name
    }
  },
  data() {
    return {
      statusMap: statusMap,
      powerSupplyMap: powerSupplyMap,
      label: {},
      // 查询数据
      selected: {
        items: [
          { value: '_id', label: '名称' }
        ]
      },
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      devices: [],
      loading: false,
      colConfigs: [
        { slot: 'HostName' },
        { slot: 'Status' },
        { prop: 'HostIP', label: 'OS-IP' },
        { slot: 'BMCIP' },
        { prop: 'IB', label: 'IB' },
        { prop: 'groups', label: 'GROUPS' },
        { prop: 'arch/os', label: 'ARCH/OS' },
        { slot: 'operate' }
      ],
      // Sidepage
      sidepagedata: {
        devices: {
          Status: 'ON',
          xcat: {
            status: 'booted'
          }
        },
        sidepageShow: false
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
    powerStatusObj(row) {
      if (row.xcat.status) {
        return powerSupplyMap[row.xcat.status]
      } else {
        return powerSupplyMap['UNKNOWN']
      }
    },
    statusObj(row) {
      if (row.Status) {
        return statusMap[row.Status]
      } else {
        return statusMap['UNKNOWN']
      }
    },
    async getList(query = {}) {
      const _this = this
      _this.loading = true
      _this.devices = []
      try {
        let data = ``
        const queryString = query.value ? ` and ${query.select}='${query.value}'` : ''
        data = {
          'query': `SELECT * FROM xcat-host 
        ${queryString}
        limit ${(_this.page.currentPage - 1) * _this.page.pageSize},${_this.page.pageSize}`
        }
        const res = await getEsDataBySql(data)
        const resData = res.hits.hits
        resData.map(async(item) => {
          const source = {}
          source.HostName = item._id
          source.HostIP = item._source.ip
          source.BMCIP = item._source.bmc
          source.bmcusername = item._source.bmcusername
          source.bmcpassword = item._source.bmcpassword
          source.IB = item._source['nicips.ib0']
          source.groups = item._source.groups
          source['arch/os'] = `${item._source.arch} / ${item._source.os}`
          source.Status = await _this.checkHostStatus(source.HostIP)
          if (source.Status) {
            _this.devices.push(source)
          } else {
            source.Status = 'UNKNOWN'
            _this.devices.push(source)
          }
        })
        _this.page.total = res.hits.total.value
        _this.loading = false
      } catch (e) {
        console.log(e)
        _this.loading = false
      }
    },

    async checkHostStatus(ip) {
      const params = {
        query: `up{job="node",instance="${ip}:9100"}`
      }
      return new Promise((resolve) => {
        GetPrometheus(params)
          .then(res => {
            if (res.data.result.length !== 0) {
              if (res.data.result[0].value[1] === '0') {
                resolve('OFF')
              } else if (res.data.result[0].value[1] === '1') {
                resolve('ON')
              }
            } else {
              resolve('UNKNOWN')
            }
          })
          .catch(e => {
            console.log(e)
            resolve('UNKNOWN')
          })
      })
    },

    // 跳转物理视图
    jumpFrame(data) {
      const _this = this
      _this.$router.push({
        name: 'Host frame',
        params: {
          device: data
        }
      })
    },

    // 查看设备详情
    info(device) {
      this.$router.push({
        name: 'device.info',
        params: {
          device: device
        }
      })
    },

    // 打开SSH
    SSHShow(row) {
      // window.open(`http://node-dev.xtc.home/webssh/?host=${row.HostName}`)
      window.open(`http://node-dev.xtc.home/webssh/?host=${row.HostName}`, '_blank')
    },
    closeSearch() {
      this.getList()
    },
    openTab(row) {
      window.open(`http://${row.BMCIP}`)
    },

    searchChanged(obj) {
      this.getList(obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.head-button{
  margin-right: 10px;
}
.jumpLink {
    cursor: pointer;
    color: #49b0f9;
  }
</style>
