<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <template>
            <div class="headBut" v-if="!selected.showSearch">
              <el-button type="primary" icon="el-icon-search" @click="selected.showSearch = true"></el-button>
            </div>
            <div class="headBut" v-else>
              <search
                :items="selected.items"
                :showSearch="selected.showSearch"
                @change="searchChanged"
              />
            </div>
          </template>
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right"></i> 刷新
          </el-button>
        </div>
        <el-table
          v-loading="loading"
          element-loading-text="作业同步中，请稍后..."
          :data="devices"
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="ID" width="120">
            <template v-slot="{row}">
              <span>{{ row.ID }}</span>
            </template>
          </el-table-column>

          <el-table-column label="作业名" show-overflow-tooltip>
            <template v-slot="{row}">
              <span>{{ row.taskName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="作业状态" width="110">
            <template v-slot="{row}">
              <el-tag size="mini" :type="statusMap[row.status].type">
                <i :class="statusMap[row.status].icon"></i>
                {{row.status | status}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="队列" width="140">
            <template v-slot="{row}">
              <span>{{ row.queue }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" width="140">
            <template v-slot="{row}">
              <span>{{ row.startTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="运行时间" width="110">
            <template v-slot="{row}">
              <span>{{ row.runTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提交用户" width="140">
            <template v-slot="{row}">
              <span>{{ row.userName }}</span>
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
          @pagination="getList"
        />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { GetTaskList, GetTaskID } from "@/api/monitor";

/* import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { initFirst, connection, disconnect } from "@/utils/sockJS"; */

import Pagination from "@/components/Pagination";
import Search from "@/components/Search";

const statusMap = {
  RUN: {
    name: "运行",
    type: "success",
    icon: "el-icon-loading"
  },
  PEND: {
    name: "等待",
    type: "warning",
    icon: "el-icon-video-play"
  },
  DONE: {
    name: "完成",
    type: "info",
    icon: "el-icon-circle-check"
  },
  "DONE+PDONE": {
    name: "完成",
    type: "info",
    icon: "el-icon-circle-check"
  },
  "DONE+PERR": {
    name: "完成",
    type: "info",
    icon: "el-icon-circle-check"
  },
  EXIT: {
    name: "退出",
    type: "danger",
    icon: "el-icon-circle-close"
  }
};
export default {
  components: {
    Pagination,
    Search
  },
  filters: {
    status(type) {
      return statusMap[type].name;
    }
  },
  data() {
    return {
      statusMap: statusMap,
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
        ],
        showSearch: false
      },
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 5,
        total: 0
      },
      devices: [],
      loading: false,
      ID: "",
      stompClient: ""
    };
  },
  created() {
    this.getList();
    if (this.$route.params.status) {
      this.taskSta = this.$route.params.status;
    }
  },
  methods: {
    getID() {
      let _this = this;
      GetTaskID()
        .then(function(res) {
          _this.ID = res.result.queryID;
          /* let herfUrl = window.location.hostname;
          //let sock = new SockJS(`http://${herfUrl}:878`);
          let sock = new SockJS(`http://192.168.3.87:878`);
          sock.onopen = function() {
            console.log("open");
            sock.send(`{"queryID": "${_this.ID}"}`);
          };

          sock.onmessage = function(e) {
            console.log("message", e.data);
            sock.close();
          };

          sock.onclose = function() {
            console.log("close");
          }; */
          _this.getList();
        })
        .catch(res => {
          console.log(res);
        });
    },
    getList() {
      let _this = this;
      _this.loading = true;
      let params = {
        UserName: "root"
      };
      GetTaskList(params)
        .then(body => {
          _this.loading = true;
          _this.devices = [];
          body.data.result.map(function(item, index) {
            let obj = {};
            obj.ID = item.JID;
            obj.taskName = item.Name;
            obj.status = item.Status;
            obj.queue = item.QueueName;
            obj.startTime = "2019-10-10";
            obj.runTime = "2019-10-10";
            obj.userName = item.UserName;
            _this.devices.push(obj);
          });
          _this.loading = false;
        })
        .catch(res => {
          console.log(res);
        });
      /* let herfUrl = window.location.hostname;
      //let ws = new WebSocket(`ws://${herfUrl}:878`);
      let ws = new WebSocket(`ws://192.168.3.87:878`);
      ws.onopen = function() {
        ws.send(`{"queryID": "${_this.ID}"}`);
      };
      ws.onmessage = function(result) {
        let data = JSON.parse(result.data);
        console.log(data);
        _this.devices = [];
        if (data.message == "noData") {
          _this.devices = [];
          _this.loading = false;
        } else {
          data.dataList.map(function(item, index) {
            let obj = {};
            obj.ID = item.JOBID;
            obj.taskName = item.JOB_NAME;
            obj.status = item.STAT;
            obj.queue = item.QUEUE;
            obj.startTime = item.START_TIME;
            obj.runTime = item.CPU_USED;
            obj.userName = item.USER;
            _this.devices.push(obj);
          });
          _this.loading = false;
        }
      }; */
    },

    //搜索
    searchChanged(data) {
      this.selected.showSearch = data.showSearch;
      console.log(data);
    }
  },
  beforeDestroy() {
    if (this.stompClient) {
      this.disconnect();
    }
  }
};
</script>

<style scoped>
.hasten {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  line-height: 40px;
  padding: 5px 10px;
}

.hasten .el-button {
  height: 36px;
  line-height: 0;
  float: right;
}

.hasten .el-input-group {
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
  width: 50%;
}
</style>