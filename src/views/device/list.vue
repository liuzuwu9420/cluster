<template>
  <div class="app-container" @click="closeSidepage($event)">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus" /> 添加主机
          </el-button>
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right" /> 刷新
          </el-button>
          <el-button type="primary" size="mini" @click="sync">
            <i class="el-icon-refresh" /> 同步
          </el-button>

          <tagSearch @change="tagChanged" />

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
        <div class="table-info el-scrollbar">
          <el-table
            ref="tableSidepage"
            v-loading="loading"
            :data="devices"
            element-loading-text="Loading"
            fit
            highlight-current-row
            style="width: 100%; cursor: pointer;"
            height="100%"
            @row-click="showSidepage"
          >
            <el-table-column label="节点名称" width="120">
              <template v-slot="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.HostName" class="edit-input" size="small" />
                </template>
                <span v-else>{{ row.HostName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template v-slot="{row}">
                <el-tag size="mini" :type="statusMap[row.Status].type">{{ row.Status | Status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="标签" width="120" align="center">
              <template v-slot="{row}">
                <tags :host-u-u-i-d="row.UUID" />
              </template>
            </el-table-column>
            <el-table-column label="IP" width="140" align="center">
              <template v-slot="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.HostIP" class="edit-input" size="small" />
                </template>
                <span v-else>{{ row.HostIP }}</span>
              </template>
            </el-table-column>
            <el-table-column label="硬件配置" align="center" show-overflow-tooltip>
              <template v-slot="{row}">
                <span>{{ row.HostInfo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="产品名/系统供应商" align="center" show-overflow-tooltip>
              <template v-slot="{row}">
                <span>{{ row.ansible_product_name }} / {{ row.ansible_system_vendor }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="描述">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.Desc" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.Desc }}</span>
            </template>
          </el-table-column> -->
            <el-table-column fixed="right" label="操作" width="200" align="center">
              <template v-slot="{row}">
                <el-button-group>
                  <!-- 编辑模式：确定 -->
                  <el-button
                    v-if="row.edit"
                    type="warning"
                    size="mini"
                    icon="el-icon-circle-check-outline"
                    @click="confirmEdit(row)"
                  >确定</el-button>
                  <!-- 编辑模式：取消 -->
                  <el-button
                    v-if="row.edit"
                    type="success"
                    size="mini"
                    icon="el-icon-circle-check-outline"
                    @click="cancelEdit(row)"
                  >取消</el-button>

                  <!-- 查看详情 -->
                  <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                    <el-button
                      v-if="!row.edit"
                      type="success"
                      icon="el-icon-view"
                      size="mini"
                      @click="info(row)"
                    />
                  </el-tooltip>
                  <!-- SSH -->
                  <el-tooltip class="item" effect="dark" content="SSH" placement="top-end">
                    <el-button
                      v-if="!row.edit"
                      type="info"
                      size="mini"
                      @click="SSHShow(row)"
                    >
                      SSH
                    </el-button>
                  </el-tooltip>
                  <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                  <el-button
                    v-if="!row.edit"
                    type="warning"
                    size="mini"
                    icon="el-icon-edit"
                    @click="row.edit=!row.edit"
                  />
                </el-tooltip> -->
                  <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                    <el-button
                      v-if="!row.edit"
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      @click="deleteItem(row)"
                    />
                  </el-tooltip>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <sidepage ref="SidepageName" :sidepagedata.sync="sidepagedata" />
        </div>
        <el-dialog :title="titleHead" :visible.sync="dialogCreating" width="600px">
          <el-form
            ref="create"
            :model="create"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="节点主机名" prop="name">
              <el-input v-model="create.name" class="formInp" />
            </el-form-item>
            <el-form-item label="节点状态" prop="type">
              <el-select v-model="create.state" class="formInp" clearable placeholder="请选择">
                <el-option
                  v-for="item in create.states"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="节点IP" prop="hostIp">
              <el-input v-model="create.hostIp" class="formInp" />
            </el-form-item>
            <!-- <el-form-item label="标签" prop="tags">
              <tags :tags="create.dynamicTags" size="mini" />
            </el-form-item> -->
            <el-form-item label="描述" prop="desc">
              <el-input v-model="create.desc" type="textarea" :rows="2" class="formInp" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('create')">立即创建</el-button>
              <el-button @click="resetForm('create')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  GetList,
  GetNodeInfo,
  SaveNodeEntity,
  UpdateEntityOne,
  DeleteEntityOne,
  GetTagOfHost
} from '@/api/device'
import { syncDevices } from '@/api/sync'
import { GetPrometheus } from '@/api/prometheus'
import { GetHostsByTag } from '@/api/tags'

import Tags from '@/components/Tags'
import tagSearch from '@/components/tagSearch'
import Pagination from '@/components/Pagination'
import Sidepage from './components/Sidepage'

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
  OFF: {
    name: '关机',
    type: 'danger'
  },
  ON: {
    name: '开机',
    type: 'success'
  }
}
export default {
  name: 'List',
  components: {
    Pagination,
    Sidepage,
    tagSearch,
    Tags
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
          { value: 'name', label: '名称' },
          { value: 'UUID', label: 'UUID' }
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
      dialogCreating: false,
      titleHead: '',
      // 节点添加信息
      create: {
        name: '',
        state: '',
        states: [
          {
            value: 'Running',
            label: 'Running'
          }
        ],
        hostIp: '',
        dynamicTags: [],
        desc: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入节点名',
            trigger: 'blur'
          }
        ],
        state: [
          {
            required: true,
            message: '请选择节点状态',
            trigger: 'change'
          }
        ],
        hostIp: [
          {
            required: true,
            message: '请输入节点IP',
            trigger: 'blur'
          }
        ]
      },
      // Sidepage
      sidepagedata: {
        devices: {},
        sidepageShow: false
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList(query) {
      const _this = this
      let hosts = {}
      _this.loading = true
      const obj = {}
      if (query) {
        if (query.select === 'name') {
          obj.HostName = query.value
        } else if (query.select === 'UUID') {
          obj.UUID = query.value
        }
      }
      const params = {
        page: { 'PageSize': _this.page.pageSize, 'PageNumber': _this.page.currentPage },
        query: obj
      }
      if (this.label.LabelKey) {
        if (this.label.UUID) {
          hosts = await GetHostsByTag(this.label.UUID, params)
        }
      } else {
        hosts = await GetList(params)
      }
      await _this.freshDevices(hosts)
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
      })
    },
    async formatNodeInfo(item) {
      const _this = this
      try {
        const data = await GetNodeInfo(item.UUID)
        if (data.Inventory) {
          Object.assign(item, data.Inventory)
          item.HostInfo = item.ansible_processor_vcpus + '核 / ' + (item.ansible_memtotal_mb / 1024).toFixed(2) + 'GB / ' + item.ansible_architecture
          if (!item.facter_processors) {
            item.facter_processors = {
              'count': '',
              'models': [''],
              'physicalcount': ''
            }
          }
        } else {
          item.HostInfo = ''
        }
      } catch (e) {
        console.log(e)
        _this.$message({
          type: 'info',
          message: '详细信息获取失败'
        })
      }
    },
    async formatTags(item) {
      const _this = this
      try {
        const data = await GetTagOfHost(item.UUID)
        item.Tags = data.Inventory
        return item
      } catch (e) {
        console.log(e)
        _this.$message({
          type: 'info',
          message: '标签信息获取失败'
        })
      }
    },
    // 搜索
    tagChanged(label) {
      this.label = label
      this.currentPage = 1
      this.getList()
    },
    async freshDevices(hosts) {
      const _this = this
      _this.loading = true
      if (!hosts.Inventory) {
        _this.devices = []
        _this.loading = false
        return
      }
      try {
        _this.devices = []
        hosts.Inventory.ResultData.map(async function(item, index) {
          if (item.HostIP) {
            item.Status = await _this.checkHostStatus(item.HostIP)
          }
          Promise.all([_this.formatNodeInfo(item), _this.formatTags(item)]).then(() => {
            // 保存一份原始数据，便于取消编辑的时候还原数据
            const original = _this._.cloneDeep(item)
            item.original = original
            _this.$set(item, 'edit', false)
            if (item.Status) {
              _this.devices.push(item)
            } else {
              item.Status = 'ON'
              item.HostInfo = ''
              item.ansible_system_vendor = ''
              item.Tags = []
              _this.devices.push(item)
            }
          })
        })
        _this.page.total = hosts.Inventory.TotalNumber
        _this.loading = false
      } catch (e) {
        console.log(e)
        _this.loading = false
      }
    },
    // 同步
    sync() {
      const _this = this
      syncDevices()
        .then(res => {
          if (res.Success) {
            _this.getList()
            _this.$message({
              type: 'success',
              message: '同步成功!'
            })
          } else {
            _this.$message({
              type: 'error',
              message: '同步失败!'
            })
          }
        })
        .catch(res => {
          _this.$message({
            type: 'error',
            message: '同步失败'
          })
        })
    },

    // 显示Sidepage
    showSidepage(row, column, event) {
      const _this = this
      const FixedCli = this.$refs.tableSidepage.$refs.rightFixedWrapper
      if (FixedCli || !FixedCli.contains(event.target)) {
        _this.$refs.tableSidepage.setCurrentRow(row)
        _this.sidepagedata.devices = row
        _this.sidepagedata.sidepageShow = true
      }
    },

    // 点击其它区域边页隐藏
    closeSidepage(event) {
      if (this.$refs.tableSidepage) {
        var currentCli1 = this.$refs.tableSidepage.$refs.bodyWrapper.firstChild
        var currentCli2 = this.$refs.SidepageName.$el
        if (currentCli1 && currentCli2) {
          if (!currentCli1.contains(event.target) && !currentCli2.contains(event.target)) { // 点击到了id为sellineName以外的区域，隐藏下拉框
            this.sidepagedata.sidepageShow = false
          }
        }
      }
    },

    saveEntity() {
      this.dialogCreating = true
      this.titleHead = '添加节点'
    },
    // 添加节点
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const _this = this
          const params = {}
          params.HostName = _this.create.name
          params.State = _this.create.state
          params.HostIP = _this.create.hostIp
          if (_this.create.desc !== '') {
            params.Desc = _this.create.desc
          }
          if (_this.create.dynamicTags.length !== 0) {
            let tags = ''
            _this.create.dynamicTags.map((item, index) => {
              if (index === 0) {
                tags = item
              } else {
                tags = tags + '|' + item
              }
            })
            params.Tags = tags
          }
          SaveNodeEntity(params)
            .then(res => {
              _this.getList()
              _this.dialogCreating = false
              _this.$message({
                type: 'success',
                message: '添加成功!'
              })
            })
            .catch(res => {
              _this.$message({
                type: 'error',
                message: '添加失败'
              })
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

    // 查看设备详情
    info(device) {
      /* window.open("http://16.16.18.61:3000/d/9CWBz0bik/prometheus-node-exporterjian-kong-zhan-shi-kan-ban?orgId=1&var-interval=5s&var-env=All&var-name=All&var-node=16.16.18.61:9100&var-maxmount=%2F&kiosk") */
      this.$router.push({
        name: 'device.info',
        params: {
          device: device
        }
      })
    },

    // 打开SSH
    SSHShow(row) {
      window.open(`http://${row.HostIP}:7681`)
    },

    // 删除
    async deleteItem(row) {
      const _this = this
      _this
        .$confirm('此操作将删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          DeleteEntityOne(row.UUID)
            .then(res => {
              _this.getList()
              _this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(res => {
              _this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 取消编辑
    cancelEdit(row) {
      row.edit = false
      // 还原数据
      /* row.name = row.original.name;
      row.hostIp = row.original.hostIp;
      row.group = row.original.group; */
    },

    // 确认编辑
    async confirmEdit(row) {
      const params = {
        oldOption: {
          _id: row._id
        },
        newOption: {}
      }
      if (row.name !== '') {
        params.newOption.name = row.name
      }
      if (row.type !== '') {
        params.newOption.type = row.type
      }
      if (row.hostIp !== '') {
        params.newOption.hostIp = row.hostIp
      }
      if (row.group !== '') {
        params.newOption.group = row.group
      }

      await UpdateEntityOne(params)
      row.original.name = row.name
      row.original.hostIp = row.hostIp
      row.original.group = row.group
      row.edit = false
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
  }
}

.hasten {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 5px 10px;
  display: flex;
}
/*.hasten .el-form-item__content {
		width: 300px;
	}*/

.hasten .el-button {
  margin-right: 10px;
  margin-left: 0px;
  height: 36px;
  line-height: 0;
  float: left;
}

.hasten .headBut {
  margin-right: 10px;
  float: left;
}
.pagination {
  margin-left: auto;
}

.table-info {
  position: relative;
  height: calc(100vh - 140px);
  overflow: auto;
}

.table-expand {
  font-size: 0;
}

.table-expand label {
  width: 90px;
  color: #99a9bf;
}

.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 30%;
}

.table-expand .el-form-item:nth-child(3n-1) {
  width: 40%;
}

.table-expand .el-form-item:nth-child(3n-2) {
  width: 30%;
}

.el-table .table-expand .form-item-finish {
  width: 100%;
}

.hostName {
  color: #3c73b9;
  cursor: pointer;
}

.hostName:hover {
  color: #1890ff;
  text-decoration:underline;
}

/* .tableInfo {
  left: 170px;
    position: absolute;
    top: 0;
    top: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    border-right: 1px solid #fff;
    z-index: 3000;
    background: #fff;
} */

.app-container .el-dialog__wrapper:nth-child(4) .el-dialog {
  background: red;
}

.app-container .el-dialog__wrapper:nth-child(4) .el-dialog .el-dialog__header {
  text-align: center;
}

.app-container .el-dialog .formInp {
  width: 95%;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
