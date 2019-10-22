<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus"></i> 添加主机
          </el-button>
          <search :items="selected.items" @change="searchChanged" />
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right"></i> 刷新
          </el-button>
          <router-link :to="{ name: 'device.add' }">
            <el-button type="primary" size="mini">
              <i class="el-icon-plus"></i> 批量添加设备
            </el-button>
          </router-link>
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
            <span>{{ props.row.hostname }}</span>
          </el-form-item>
          <el-form-item label="内存">
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
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
          <el-table-column label="节点名称" width="120">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.hostname" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.hostname }}</span>
            </template>
          </el-table-column>

          <el-table-column label="内存" width="110">
            <template v-slot="{row}">
              <span>{{ row.totalMem }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="状态">
            <template v-slot="{row}">
              <el-tag size="mini" :type="statusMap[row.type].type">{{row.type | type}}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="IPV4">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.allIPV4" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.allIPV4.toString() }}</span>
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
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                  <el-button
                    v-if="!row.edit"
                    type="warning"
                    size="mini"
                    icon="el-icon-edit"
                    @click="row.edit=!row.edit"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                  <el-button
                    v-if="!row.edit"
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteItem(row)"
                  ></el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :title="titleHead" :visible.sync="dialogCreating" width="50%">
          <el-form
            :model="create"
            :rules="rules"
            ref="create"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="节点主机名" prop="name">
              <el-input class="formInp" v-model="create.name"></el-input>
            </el-form-item>
            <el-form-item label="节点类型" prop="type">
              <el-select class="formInp" v-model="create.type" clearable placeholder="请选择">
                <el-option
                  v-for="item in create.types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="节点IP" prop="hostIp">
              <el-input class="formInp" v-model="create.hostIp"></el-input>
            </el-form-item>
            <el-form-item label="节点所属组" prop="group">
              <el-input class="formInp" v-model="create.group"></el-input>
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
  SaveNodeEntity,
  UpdateEntityOne,
  DeleteEntityOne
} from "@/api/device";

import Pagination from "@/components/Pagination";
import Search from "@/components/Search";

const statusMap = {
  head: {
    name: "空闲",
    type: "success"
  },
  compute: {
    name: "繁忙",
    type: "danger"
  },
  2: {
    name: "繁忙",
    type: "danger"
  },
  222: {
    name: "繁忙",
    type: "danger"
  },
  test: {
    name: "占用",
    type: "warning"
  }
};
const powerSupplyMap = {
  OFF: {
    name: "关机",
    type: "danger"
  },
  ON: {
    name: "开机",
    type: "success"
  }
};
export default {
  components: {
    Pagination,
    Search
  },
  filters: {
    type(type) {
      return statusMap[type].name;
    },
    powerSupply(powerSupply) {
      return powerSupplyMap[powerSupply].name;
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
            value: "名称",
            label: "名称"
          },
          {
            value: "UUID",
            label: "UUID"
          }
        ]
      },
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 5,
        total: 0
      },
      devices: [
    {
        hostname: "node-1", //节点名称
        systemVersion: "1.11.1", //节点系统版本
        totalMem: "200GB",//内存大小
        cpuInfo:    //cpu信息
        {
            count: 10, //cpu核心数量
            physicalcount: 5 // 物理CPU个数
        },
        allIPV4:
        [
            "16.16.18.66", //所有的IPV4网络地址,不包含127
            "172.17.0.1"
        ],
        mainboard: "主板信息",  //主板信息
        dnsServer:
        [
            "114.114.114.114" //dns服务器
        ],
        diskListMounts:
        [
            {
                block_used: 10,   //已经使用的扇区个数block_used
                uuid: "UUID", //磁盘的UUID
                size_total: "200GB", //磁盘总大小  单位byte
                block_total: 20,  //扇区总个数block_used
                mount: "挂载路径", //挂载路径
                block_available: 10, //可用的扇区个数
                size_available: "100GB",  //可用的磁盘大小
                fstype: "分区类型", //分区类型
                inode_total: 1, //可以创建的索引个数
                options: "rw", //设置,rw为可读可写
                device: "磁盘路径", //磁盘路径
                inode_used: 2, //已经创建的索引个数
                block_size: "50GB", //每一个扇区的大小  单位byte
                inode_available: "100GB" //可用的扇区大小
            }
        ],
        edit: false
    }
 ],
      loading: false,
      dialogCreating: false,
      titleHead: "",
      // 节点添加信息
      create: {
        name: "",
        type: "",
        types: [
          {
            value: "head",
            label: "head"
          },
          {
            value: "compute",
            label: "compute"
          }
        ],
        hostIp: "",
        group: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入节点名",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择节点类型",
            trigger: "change"
          }
        ],
        hostIp: [
          {
            required: true,
            message: "请输入节点IP",
            trigger: "blur"
          }
        ],
        group: [
          {
            required: true,
            message: "请输入节点所属组",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    //this.getList();
  },
  methods: {
    getList() {
      let _this = this;
      _this.loading = true;
      let params = {
        pageOption: {
          pageNumber: _this.page.currentPage, //当前页数
          pageSize: _this.page.pageSize //每一页显示条数
        },
        selectOption: {}
      };
      if (_this.hostname !== "") {
        params.selectOption.name = _this.hostname;
      }
      if (_this.hosttype !== "") {
        params.selectOption.type = _this.hosttype;
      }
      if (_this.hostip !== "") {
        params.selectOption.hostIp = _this.hostip;
      }
      if (_this.group !== "") {
        params.selectOption.group = _this.group;
      }
      GetList(params)
        .then(res => {
          //_this.devices = []
          console.log(res);
          _this.devices = res.data.result.nodeData.map(function(item, index) {
            /*let obj = {
							edit: false
						};
						Object.assign(obj, item);
						_this.devices.push(obj);*/
            // 保存一份原始数据，便于取消编辑的时候还原数据
            const original = _.cloneDeep(item);
            item.original = original;
            _this.$set(item, "edit", false);
            return item;
          });
          _this.page.total = res.data.result.pageResultData.totalDataNumber;
          _this.page.pageCount = res.data.result.pageResultData.totalCount;
          _this.loading = false;
        })
        .catch(res => {
          console.log(res);
        });
    },

    //搜索
    searchChanged(data) {
      console.log(data);
    },

    saveEntity() {
      this.dialogCreating = true;
      this.titleHead = "添加节点";
    },
    //添加节点
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this;
          let params = {
            name: _this.create.name,
            type: _this.create.type,
            hostIp: _this.create.hostIp,
            group: _this.create.group
          };
          SaveNodeEntity(params)
            .then(res => {
              _this.getList();
              _this.dialogCreating = false;
              _this.$message({
                type: "success",
                message: "添加成功!"
              });
            })
            .catch(res => {
              _this.$message({
                type: "error",
                message: "添加失败"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 查看设备详情
    info(device) {
      this.$router.push({
        name: "device.info",
        params: {
          device: device
        }
      });
    },

    // 删除
    async deleteItem(row) {
      let _this = this;
      _this
        .$confirm("此操作将删除该节点, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            _id: row._id
          };
          DeleteEntityOne(params)
            .then(res => {
              _this.getList();
              _this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(res => {
              _this.$message({
                type: "error",
                message: "删除失败"
              });
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 取消编辑
    cancelEdit(row) {
      row.edit = false;
      // 还原数据
      /* row.name = row.original.name;
      row.hostIp = row.original.hostIp;
      row.group = row.original.group; */
    },

    // 确认编辑
    async confirmEdit(row) {
      let params = {
        oldOption: {
          _id: row._id
        },
        newOption: {}
      };
      if (row.name !== "") {
        params.newOption.name = row.name;
      }
      if (row.type !== "") {
        params.newOption.type = row.type;
      }
      if (row.hostIp !== "") {
        params.newOption.hostIp = row.hostIp;
      }
      if (row.group !== "") {
        params.newOption.group = row.group;
      }

      await UpdateEntityOne(params);
      row.original.name = row.name;
      row.original.hostIp = row.hostIp;
      row.original.group = row.group;
      row.edit = false;
    }
  }
};
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
</style>