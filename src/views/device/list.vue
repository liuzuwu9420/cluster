<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus" /> 添加主机
          </el-button>
          <search :items="selected.items" @change="searchChanged" />
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right" /> 刷新
          </el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="devices"
          element-loading-text="Loading"
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="节点名称">
                  <span>{{ props.row.HostName }}</span>
                </el-form-item>
                <!-- <el-form-item label="内存">
                  <span>{{ props.row.totalMem }}</span>
                </el-form-item>
                <el-form-item label="cpu核心数量">
                  <span>{{ props.row.cpuInfo.count }}</span>
                </el-form-item>
                <el-form-item label="物理CPU个数">
                  <span>{{ props.row.cpuInfo.physicalcount }}</span>
                </el-form-item>
                <el-form-item label="IPV4">
                  <span>{{ props.row.allIPV4.toString() }}</span>
                </el-form-item>
                <el-form-item label="主板信息">
                  <span>{{ props.row.mainboard }}</span>
                </el-form-item>
                <el-form-item label="dns服务器">
                  <span>{{ props.row.dnsServer.toString() }}</span>
                </el-form-item>
                <el-form-item label="磁盘的UUID">
                  <span>{{ props.row.diskListMounts[0].uuid }}</span>
                </el-form-item>
                <el-form-item label="磁盘总大小">
                  <span>{{ props.row.diskListMounts[0].size_total }}</span>
                </el-form-item>
                <el-form-item label="可用磁盘">
                  <span>{{ props.row.diskListMounts[0].size_available }}</span>
                </el-form-item>
                <el-form-item label="磁盘路径">
                  <span>{{ props.row.diskListMounts[0].device }}</span>
                </el-form-item>
                <el-form-item label="挂载路径">
                  <span>{{ props.row.diskListMounts[0].mount }}</span>
                </el-form-item>
                <el-form-item label="扇区总个数">
                  <span>{{ props.row.diskListMounts[0].block_total }}</span>
                </el-form-item>
                <el-form-item label="可用的扇区个数">
                  <span>{{ props.row.diskListMounts[0].block_available }}</span>
                </el-form-item>
                <el-form-item label="每一个扇区的大小">
                  <span>{{ props.row.diskListMounts[0].block_size }}</span>
                </el-form-item>
                <el-form-item label="可用的扇区大小">
                  <span>{{ props.row.diskListMounts[0].inode_available }}</span>
                </el-form-item>
                <el-form-item label="分区类型">
                  <span>{{ props.row.diskListMounts[0].fstype }}</span>
                </el-form-item>-->
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="节点名称" width="120">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.HostName" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.HostName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标签">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <tags :tags="row.Tags" size="mini" />
              </template>
              <span v-else>
                <el-tag v-for="(tag, index) in row.Tags" :key="index">{{ tag }}</el-tag>
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="内存" width="110">
            <template v-slot="{row}">
              <span>{{ row.totalMem }}</span>
            </template>
          </el-table-column>-->
          <el-table-column label="状态">
            <template v-slot="{row}">
              <el-tag size="mini" :type="statusMap[row.State].type">{{ row.State | State }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="IP">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.HostIP" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.HostIP }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.Desc" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.Desc }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
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
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                  <el-button
                    v-if="!row.edit"
                    type="warning"
                    size="mini"
                    icon="el-icon-edit"
                    @click="row.edit=!row.edit"
                  />
                </el-tooltip>
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
        <el-dialog :title="titleHead" :visible.sync="dialogCreating" width="50%">
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
            <el-form-item label="标签" prop="tags">
              <tags :tags="create.dynamicTags" size="mini" />
            </el-form-item>
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
      <el-footer class="pagination">
        <pagination
          v-show="page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="getList"
        />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {
  GetList,
  GetNodeList,
  SaveNodeEntity,
  UpdateEntityOne,
  DeleteEntityOne
} from '@/api/device'

import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Tags from '@/components/Tags'

const statusMap = {
  head: {
    name: '空闲',
    type: 'success'
  },
  compute: {
    name: '繁忙',
    type: 'danger'
  },
  Running: {
    name: 'Running',
    type: 'danger'
  },
  test: {
    name: '占用',
    type: 'warning'
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
  components: {
    Pagination,
    Search,
    Tags
  },
  filters: {
    State(State) {
      return statusMap[State].name
    },
    powerSupply(powerSupply) {
      return powerSupplyMap[powerSupply].name
    }
  },
  data() {
    return {
      statusMap: statusMap,
      powerSupplyMap: powerSupplyMap,
      // 查询数据
      selected: {
        items: [
          {
            value: 'name',
            label: '名称'
          },
          {
            value: 'UUID',
            label: 'UUID'
          }
        ]
      },
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 1
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
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const _this = this
      _this.loading = true
      // const params = {}
      GetList()
        .then(res => {
          _this.devices = res.Inventory.data.map(function(item, index) {
            item.Tags = item.Tags.split('|')
            // 保存一份原始数据，便于取消编辑的时候还原数据
            const original = _this._.cloneDeep(item)
            item.original = original
            _this.$set(item, 'edit', false)
            return item
          })
          _this.page.total = _this.devices.length
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
        })
    },

    // 搜索
    searchChanged(data) {
      const _this = this
      if (data.select === 'name') {
        _this.$message({
          message: '名称暂时无法查询',
          type: 'warning',
          duration: 1000
        })
      } else if (data.select === 'UUID') {
        _this.loading = true
        GetNodeList(data.value)
          .then(res => {
            _this.devices = []
            _this.devices.push(res.Inventory.data)
            _this.devices = _this.devices.map(function(item, index) {
              // 保存一份原始数据，便于取消编辑的时候还原数据
              const original = _this._.cloneDeep(item)
              item.original = original
              _this.$set(item, 'edit', false)
              return item
            })
            _this.page.total = _this.devices.length
            /* _this.page.total = res.data.pageResultData.totalDataNumber;
          _this.page.pageCount = res.data.pageResultData.totalCount; */
            _this.loading = false
          })
          .catch(res => {
            console.log(res)
          })
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

<style scoped>
.hasten {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 5px 10px;
}
/*.hasten .el-form-item__content {
		width: 300px;
	}*/

.hasten .el-button {
  margin-right: 2%;
  height: 36px;
  line-height: 0;
  float: right;
}

.hasten .headBut {
  margin-right: 10px;
  float: left;
}
.pagination {
  text-align: right;
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
  width: 33.33%;
}

.app-container .el-dialog .el-row .size {
  line-height: 40px;
  padding-left: 12px;
}

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
