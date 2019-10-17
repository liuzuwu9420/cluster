<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-row>
          <el-col>
            <span>主机名:{{device.name}}</span>
            <el-tag size="mini" :type="statusMap[device.type].type">{{device.type | type}}</el-tag>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 设备信息 -->
            <el-tab-pane label="设备信息" name="info">
              <div style="margin-top:5px">
                <el-row class="row-info">
                  <el-col :span="4" class="info-tit">
                    <div>主机名</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>{{ device.name }}</div>
                  </el-col>
                  <el-col :span="4" class="info-tit">
                    <div>当前状态</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>{{device.type|type}}</div>
                  </el-col>
                </el-row>
                <el-row class="row-info">
                  <el-col :span="4" class="info-tit">
                    <div>组别</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>{{ device.group }}</div>
                  </el-col>
                  <el-col :span="4" class="info-tit">
                    <div>IP</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>{{device.hostIp}}</div>
                  </el-col>
                </el-row>
                <el-row class="row-info">
                  <el-col :span="4" class="info-tit">
                    <div>内存</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{ node.totalMem }}</div>
                  </el-col>
                  <el-col :span="4" class="info-tit">
                    <div>主板信息</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{node.mainboard}}</div>
                  </el-col>
                </el-row>
                <el-row class="row-info">
                  <el-col :span="4" class="info-tit">
                    <div>cpu核心数量</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{ node.cpuInfo.count }}</div>
                  </el-col>
                  <el-col :span="4" class="info-tit">
                    <div>CPU物理个数</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{node.cpuInfo.physicalcount}}</div>
                  </el-col>
                </el-row>
                <el-row class="row-info">
                  <el-col :span="4" class="info-tit">
                    <div>磁盘总大小</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{ node.diskListMounts[0].size_total }}</div>
                  </el-col>
                  <el-col :span="4" class="info-tit">
                    <div>可用磁盘</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{node.diskListMounts[0].size_available}}</div>
                  </el-col>
                </el-row>
                <el-row class="row-info">
                  <el-col :span="4" class="info-tit">
                    <div>扇区总个数</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{ node.diskListMounts[0].block_total }}</div>
                  </el-col>
                  <el-col :span="4" class="info-tit">
                    <div>可用扇区个数</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{node.diskListMounts[0].block_available}}</div>
                  </el-col>
                </el-row>
                <el-row class="row-info">
                  <el-col :span="4" class="info-tit">
                    <div>挂载路径</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{ node.diskListMounts[0].mount }}</div>
                  </el-col>
                  <el-col :span="4" class="info-tit">
                    <div>分区类型</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{node.diskListMounts[0].fstype}}</div>
                  </el-col>
                </el-row>
                <el-row class="row-info">
                  <el-col :span="4" class="info-tit">
                    <div>IPV4</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{ node.allIPV4 }}</div>
                  </el-col>
                  <el-col :span="4" class="info-tit">
                    <div>dns</div>
                  </el-col>
                  <el-col :span="8" class="info-main">
                    <div>&nbsp;{{node.dnsServer}}</div>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="服务调用" name="service">
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
                  <el-table-column label="服务名称" prop="name"></el-table-column>
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
import { GetNodeList } from "@/api/device";

import moment from "moment";

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

export default {
  filters: {
    datetime(long) {
      return moment(Number(long)).format("YYYY-MM-DD hh:mm:ss");
    },
    type(type) {
      return statusMap[type].name;
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: "info",
      device: {
        type: "head"
      },
      node: {
        cpuInfo: {},
        diskListMounts: [{}]
      },
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 50,
        total: 1
      },

      eventLogs: [],

      serviceLogs: [],

      loading: false
    };
  },
  created() {
    if (this.$route.params.device) {
      // 当前设备
      this.device = this.$route.params.device;
      this.GetList(this.device.name);
    } else {
      this.$router.push({ name: "device.list" });
    }
    // 产品列表
    //this.fetchProductList();
  },
  methods: {
    //获取信息
    GetList(id) {
      let _this = this;
      GetNodeList(id).then(res => {
        console.log(res);
        if (res.data.result.message == "nodeData") {
          _this.node = {
            cpuInfo: {},
            diskListMounts: [{}]
          };
        } else {
          _this.node = res.data.result;
        }
      });
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },

    // 获取服务调用
    async fetchService(formName) {
      let params = {
        pageSize: this.page.pageSize
      };
      this.loading = true;

      getDeviceServiceLog(params).then(response => {
        this.loading = false;
        this.eventLogs = response.list.map(v => {
          return v;
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  .row-info {
    margin: 3px;
    border: 1px solid #e6e6e6;
  }
  .info-tit {
    padding: 5px;
    background: #f9f9f9;
    font-size: 20px;
    text-align: center;
  }
  .info-main {
    padding: 5px;
    color: #333;
    font-size: 18px;
  }
}
</style>