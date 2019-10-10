<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-row>
          <el-col>
            <span>主机名:{{device.name}}</span>
            <el-tag size="mini" :type="statusMap[device.status].type">{{device.status | status}}</el-tag>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 设备信息 -->
            <el-tab-pane label="设备信息" name="info">
              <div style="margin-top:5px">
                <table border="0" class="deviceInfo_props">
                  <tr>
                    <th>组别</th>
                    <td>
                      <span class="index_text_2EhsV">{{ device.group }}</span>
                    </td>
                  </tr>
                  <!--<tr>
                    <th>添加时间</th>
                    <td>{{ device.createTime }}</td>
                    <th>激活时间</th>
                    <td>{{ device.activeTime }}</td>
                    <th>最后上线时间</th>
                    <td>{{ device.lastOnlineTime }}</td>
                  </tr>-->
                  <tr>
                    <th>当前状态</th>
                    <td>{{device.status|status}}</td>
                  </tr>
                </table>
              </div>
            </el-tab-pane>

            <el-tab-pane label="运行状态" name="status">
              <el-table
                v-loading="loading"
                :data="propertyStatus"
                element-loading-text="Loading"
                fit
                highlight-current-row
                style="width: 100%"
              >
                <el-table-column label="属性名称">
                  <template v-slot="{row}">
                    <span>{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="数据类型">
                  <template v-slot="{row}">
                    <span>{{ row.dataType }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="最新值">
                  <template v-slot="{row}">
                    <span>{{ row.value }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="单位">
                  <template v-slot="{row}">
                    <span>{{ row.unit }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="更新时间">
                  <template v-slot="{row}">
                    <span>{{ row.time | datetime }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 网关设备：子设备管理 -->
            <el-tab-pane v-if="device.nodeType == 1" label="子设备管理" name="child">
              <el-container style="margin-top:10px">
                <el-header>
                  <el-form :inline="true">
                    <el-form-item>
                      <el-select
                        v-model="query.productKey"
                        clearable
                        size="mini"
                        placeholder="所有产品"
                      >
                        <el-option
                          v-for="product in products"
                          :key="product.productName"
                          :label="product.productName"
                          :value="product.productKey"
                          :disabled="product.disabled"
                        >{{ product.productName }}</el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item v-if="false">
                      <el-row type="flex">
                        <el-col :span="9">
                          <dropdown
                            :selected="dropdown.selected"
                            :items="dropdown.items"
                            @change="dropdownChanged"
                          />
                        </el-col>
                        <el-col :span="15">
                          <el-input size="mini" v-model="query.input" clearable />
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item>
                      <el-button type="primary" size="mini" @click="fetchData">
                        <i class="el-icon-search"></i>
                        查询
                      </el-button>
                    </el-form-item>

                    <el-form-item style="float:right ;">
                      <el-button v-if="false" type="primary" size="mini" @click="handleOpenDialog">
                        <i class="el-icon-plus"></i>
                        添加子设备
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-header>
                <el-main>
                  <el-table
                    v-loading="loading"
                    :data="devices"
                    element-loading-text="Loading"
                    fit
                    highlight-current-row
                    style="width: 100%"
                  >
                    <!-- 展开项 -->
                    <el-table-column type="expand">
                      <template v-slot="{row}">
                        <el-form label-position="left" inline class="table-expand">
                          <el-form-item label="批次">
                            <span>{{ row.batchNo }}</span>
                          </el-form-item>
                          <el-form-item label="项目">
                            <span>{{ row.projectName }}</span>
                          </el-form-item>
                          <el-form-item label="产品名称">
                            <span>{{ row.productName }}</span>
                          </el-form-item>
                          <el-form-item label="节点类型">
                            <span>{{ row.nodeType==0?"设备":"网关" }}</span>
                          </el-form-item>
                          <el-form-item label="所属网关">
                            <span>{{ row.gatewayDeviceName }}</span>
                          </el-form-item>
                          <el-form-item label="密钥">
                            <span>{{ row.secret }}</span>
                          </el-form-item>
                          <el-form-item label="添加时间">
                            <span>{{ row.createTime }}</span>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column label="名称" width="250" prop="name"></el-table-column>
                    <el-table-column label="备注名">
                      <template v-slot="{row}">
                        <template v-if="row.edit">
                          <el-input v-model="row.nickName" class="edit-input" size="small" />
                        </template>
                        <span v-else>{{ row.nickName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="安装电梯">
                      <template v-slot="{row}">
                        <template v-if="row.edit">
                          <el-input v-model="row.lift" class="edit-input" size="small" />
                        </template>
                        <span v-else>{{ row.lift }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="标签">
                      <template v-slot="{row}">
                        <!-- 编辑模式 -->
                        <template v-if="row.edit">
                          <tags :tags="row.tags" size="mini" />
                        </template>
                        <!-- 查看模式 -->
                        <template v-else>
                          <el-tag size="mini" :key="tag" v-for="tag in row.tags">{{tag}}</el-tag>
                        </template>
                      </template>
                    </el-table-column>

                    <!-- 写卡终端需要填写 物业代码 -->
                    <el-table-column label="物业代码">
                      <template v-slot="{row}">
                        <template v-if="row.edit">
                          <el-input v-model="row.propertyCode" class="edit-input" size="small" />
                        </template>
                        <span v-else>{{ row.propertyCode }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column v-if="false" label="类目">
                      <template v-slot="{row}">
                        <el-tag size="mini" type="info">{{row.type | types}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" width="125">
                      <template v-slot="{row}">
                        <el-tag
                          size="mini"
                          :type="statusMap[row.status].type"
                        >{{row.status | status}}</el-tag>
                        <!-- <el-switch @change="changeDevice(row)" v-model="row.flag"></el-switch> -->
                      </template>
                    </el-table-column>
                    <el-table-column label="二维码" width="100">
                      <template v-slot="{row}">
                        <el-tooltip class="item" effect="dark" content="点击打印二维码" placement="right">
                          <el-image
                            :src="row.qrCode"
                            style="width: 60px; height: 60px"
                            @click="print(row)"
                          ></el-image>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="false" fixed="right" label="操作" width="280">
                      <template v-slot="{row}">
                        <!-- 编辑模式：确定 -->
                        <el-button
                          v-if="row.edit"
                          type="success"
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
                        <el-button
                          v-if="!row.edit"
                          type="info"
                          icon="el-icon-view"
                          size="mini"
                          @click="info(row)"
                        >查看</el-button>
                        <el-button
                          v-if="!row.edit"
                          type="warning"
                          size="mini"
                          icon="el-icon-edit"
                          @click="row.edit=!row.edit"
                        >编辑</el-button>
                        <el-button
                          v-if="!row.edit"
                          type="danger"
                          size="mini"
                          icon="el-icon-delete"
                          @click="deleteItem(row)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-main>
                <el-footer class="pagination">
                  <pagination
                    v-show="page.total>0"
                    :total="page.total"
                    :page.sync="page.currentPage"
                    :limit.sync="page.pageSize"
                    @pagination="fetchData"
                  />
                </el-footer>
              </el-container>
            </el-tab-pane>

            <el-tab-pane label="事件管理" name="event">
              <!-- 查询条件 -->
              <el-form :inline="true" :model="eventForm" ref="eventForm">
                <el-form-item
                  prop="identifier"
                  :rules="[
                    { required: true, message: '请输入事件标识符', trigger: 'blur' }
                  ]"
                >
                  <el-row type="flex">
                    <el-col :span="24">
                      <el-input
                        placeholder="请输入事件标识符"
                        size="mini"
                        v-model="eventForm.identifier"
                        clearable
                      />
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="fetchEvent('eventForm')">
                    <i class="el-icon-search"></i>
                    查询
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-row type="flex">
                    <el-col :span="9">
                      <dropdown :selected="dropdown.selected" :items="dropdown.items" />
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <template>
                    <div class="block">
                      <span class="demonstration"></span>
                      <el-date-picker
                        v-model="timeValue"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        size="mini"
                      ></el-date-picker>
                    </div>
                  </template>
                </el-form-item>
              </el-form>
              <!-- 列表 -->
              <el-main>
                <el-table
                  v-loading="loading"
                  :data="eventLogs"
                  element-loading-text="Loading"
                  fit
                  highlight-current-row
                  style="width: 100%"
                >
                  <!-- 列 -->
                  <el-table-column label="时间">
                    <template v-slot="{row}">
                      <span>{{ row.time | datetime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="标识符" prop="identifier"></el-table-column>
                  <el-table-column label="事件名称" prop="name"></el-table-column>
                  <el-table-column label="事件类型" prop="eventType"></el-table-column>
                  <el-table-column label="输出参数" prop="outputData"></el-table-column>
                </el-table>
              </el-main>
            </el-tab-pane>

            <el-tab-pane label="服务调用" name="service">
              <!-- 查询条件 -->
              <el-form :inline="true" :model="serviceForm" ref="serviceForm">
                <el-form-item
                  prop="identifier"
                  :rules="[
                    { required: true, message: '请输入服务标识符', trigger: 'blur' }
                  ]"
                >
                  <el-row type="flex">
                    <el-col :span="24">
                      <el-input
                        placeholder="请输入服务标识符"
                        size="mini"
                        v-model="serviceForm.identifier"
                        clearable
                      />
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="fetchService('serviceForm')">
                    <i class="el-icon-search"></i>
                    查询
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <template>
                    <div class="block">
                      <span class="demonstration"></span>
                      <el-date-picker
                        v-model="timeValue"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        size="mini"
                      ></el-date-picker>
                    </div>
                  </template>
                </el-form-item>
              </el-form>
              <!-- 列表 -->
              <el-main>
                <el-table
                  v-loading="loading"
                  :data="serviceLogs"
                  element-loading-text="Loading"
                  fit
                  highlight-current-row
                  style="width: 100%"
                >
                  <!-- 列 -->
                  <el-table-column label="时间" prop="time"></el-table-column>
                  <el-table-column label="标识符" prop="identifier"></el-table-column>
                  <el-table-column label="服务名称" prop="name"></el-table-column>
                  <el-table-column label="输入参数" prop="inputData"></el-table-column>
                  <el-table-column label="输出参数" prop="outputData"></el-table-column>
                </el-table>
              </el-main>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  findDevices,
  updateDevice,
  getDeviceEventLog,
  getDeviceServiceLog,
  queryDevicePropertyStatus
} from "@/api/device";
import { getProductList } from "@/api/product";

import Dropdown from "@/components/Dropdown";

import moment from "moment";

const statusMap = {
  FREE: { name: "空闲", type: "success" },
  BUSY: { name: "繁忙", type: "danger" },
  OCCUPY: { name: "占用", type: "warning" }
};

export default {
  components: { Dropdown },
  filters: {
    datetime(long) {
      return moment(Number(long)).format("YYYY-MM-DD hh:mm:ss");
    },
    status(status) {
      return statusMap[status].name;
    },
    substr(str, length, sufix) {
      if (!length) {
        length = 11;
      }
      if (!sufix) {
        sufix = "…";
      }
      return str.substr(0, length) + sufix;
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: "info",
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 50,
        total: 1
      },
      // 下拉选择数据
      dropdown: {
        selected: {
          key: "all",
          value: "全部"
        },
        items: {
          all: "全部",
          info: "信息",
          alert: "告警",
          error: "故障"
        }
      },

      // 查询条件
      query: {
        productKey: "",
        input: ""
      },

      propertyStatus: [],

      eventLogs: [],

      serviceLogs: [],

      pickerOptions: {
        shortcuts: [
          {
            text: "最近5分钟",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - (3600 * 1000) / 12);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近15分钟",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - (3600 * 1000) / 4);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近2小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 2);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近12小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 12);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },

      timeValue: [new Date(), new Date()],

      eventForm: {
        identifier: ""
      },

      serviceForm: {
        identifier: ""
      },

      loading: false
    };
  },
  created() {
    // 当前设备
    this.device = this.$route.params.device;
    // 产品列表
    //this.fetchProductList();
    // 子设备列表
    //this.fetchData();
    // 查询设备的属性快照
    //this.fetchPropertyStatus();
  },
  methods: {
    // 打印二维码
    print(data) {
      const img = new Image();
      img.src = data.qrCode;
      const wind = window.open(
        "",
        "newwindow",
        "height=600, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no"
      );
      let content = `<div>DeviceName：${data.name}</div><div>ProductKey：${data.productKey}</div>`;
      wind.document.body.innerHTML = img.outerHTML + content;
      wind.print();
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 下拉选择发生改变触发事件
    // dropdownChanged(data) {
    //   console.log("click on item " + this.dropdown.selected.key);
    // },

    // 获取产品列表
    async fetchProductList() {
      this.products = await getProductList();
    },

    // 查询设备的属性快照
    async fetchPropertyStatus() {
      let iotId = this.device.iotId;
      let data = await queryDevicePropertyStatus(iotId);
      this.propertyStatus = data;
    },

    // 获取子设备列表
    async fetchData() {
      let params = {
        pageSize: this.page.pageSize,
        pageNo: this.page.currentPage,
        gatewayDeviceName: this.device.name
      };
      if (this.query.productKey) {
        params.productKey = this.query.productKey;
      }
      if (this.query.input) {
        params[this.dropdown.selected.key] = this.query.input;
      }
      this.loading = true;
      findDevices(params).then(response => {
        this.loading = false;
        const items = response.datas;
        this.devices = items.map(v => {
          // 处理 tags 将字符串 拆分成 数组
          if (v.tags && v.tags.length > 0) {
            v.tags = v.tags.split("|");
          } else {
            v.tags = [];
          }
          // 保存一份原始数据，便于取消编辑的时候还原数据
          const original = _.cloneDeep(v);
          v.original = original;
          this.$set(v, "edit", false);
          return v;
        });
        this.page.total = response.pageInfo.totalCount;
      });
    },

    // 获取事件数据
    async fetchEvent(formName) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      let params = {
        pageSize: this.page.pageSize,
        startTime: this.timeValue[0],
        endTime: this.timeValue[1],
        asc: 0,
        iotId: this.device.iotId,
        identifier: this.eventForm.identifier
      };
      if (this.dropdown.selected.key != "all") {
        params["eventType"] = this.dropdown.selected.key;
      }
      this.loading = true;

      getDeviceEventLog(params).then(response => {
        this.loading = false;
        this.eventLogs = response.list.map(v => {
          return v;
        });
      });
      //   }
      // });
    },
    // 获取服务调用
    async fetchService(formName) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      let params = {
        pageSize: this.page.pageSize,
        startTime: this.timeValue[0],
        endTime: this.timeValue[1],
        asc: 0,
        iotId: this.device.iotId,
        identifier: this.serviceForm.identifier
      };
      this.loading = true;

      getDeviceServiceLog(params).then(response => {
        this.loading = false;
        this.eventLogs = response.list.map(v => {
          return v;
        });
      });
    }
    //     });
    //   }
  }
};
</script>
<style scoped>
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
  width: 50%;
}

.device-search {
  width: 250px;
}
.device-search .el-select {
  width: 250px;
}

.deviceInfo_props {
  width: 100%;
  border: 0;
  border-left: 1px solid #ebecec;
  border-top: 1px solid;
  border-color: #ebecec;
  margin-bottom: 18px;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

.deviceInfo_props tr {
  height: 48px;
}

.deviceInfo_props th {
  min-width: 120px;
  text-align: left;
  color: #74777a;
  font-weight: 400;
  background: #fafafc;
}

.deviceInfo_props td {
  width: 22%;
  word-break: break-all;
}

.deviceInfo_props td,
.deviceInfo_props th {
  padding: 0 8px;
  border-right: 1px solid #ebecec;
  border-bottom: 1px solid #ebecec;
}

td,
th {
  padding: 0;
  text-align: left;
}
.deviceInfo_cell-text {
  max-width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  float: left;
}

.next-btn-text.next-btn-medium {
  margin: 0;
  height: 20px;
  padding: 0;
  font-size: 14px;
  line-height: 20px;
  border-width: 0;
}

.next-btn-text.next-btn-normal,
.next-btn-text.next-btn-normal.visited,
.next-btn-text.next-btn-normal:link,
.next-btn-text.next-btn-normal:visited {
  color: #00c1de;
}

.next-btn-text.next-btn-normal {
  background-color: transparent;
  border-color: transparent;
}

.next-btn-medium {
  white-space: nowrap;
}
.next-btn-text {
  box-shadow: none;
}
</style>