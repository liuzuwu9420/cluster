<template>
  <div class="app-container">
    <el-container>
      <el-form :inline="true">
        <div class="filter">
          <div class="filterTop">
            <span class="left">查询条件</span>
            <span class="right">
              <el-button type="primary" @click="getList()">查询</el-button>
              <el-button @click="clearAll">重置</el-button>
            </span>
          </div>

          <div class="row">
            <label>提交用户</label>
            <el-autocomplete
              class="inline-input"
              v-model="userName"
              :fetch-suggestions="nameSearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
            ></el-autocomplete>
            <label>作业状态</label>
            <el-select v-model="taskSta" clearable placeholder="请选择">
              <el-option
                v-for="item in taskStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="row">
            <label>队列</label>
            <el-autocomplete
              class="inline-input"
              v-model="queue"
              :fetch-suggestions="queueSearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
            ></el-autocomplete>
          </div>
        </div>
      </el-form>
      <el-main>
        <div class="hasten">
          <el-button type="primary" size="mini" @click="getID">
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
  EXIT: {
    name: "退出",
    type: "danger",
    icon: "el-icon-circle-close"
  }
};
export default {
  components: {
    Pagination
  },
  filters: {
    status(type) {
      return statusMap[type].name;
    }
  },
  data() {
    return {
      statusMap: statusMap,
      //查询条件
      userName: "",
      taskStatus: [
        {
          value: "RUN",
          label: "运行"
        },
        {
          value: "PEND",
          label: "等待"
        },
        {
          value: "DONE",
          label: "完成"
        },
        {
          value: "EXIT",
          label: "退出"
        }
      ],
      taskSta: "",
      queue: "",
      nameRestaurants: [],
      queueRestaurants: [],
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
    this.getID();
    console.log(this.$route)
    if(this.$route.params.status) {
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
      let herfUrl = window.location.hostname;
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
      };
      /* let params = {
            match: {
              queryID: _this.ID
            },
            size: _this.page.pageSize
          };
          GetTaskList(params)
            .then(body => {
              _this.loading = true;
              if(body.result.message == "loading") {
                _this.getList();
              }else if (body.result.message == "success") {
                _this.devices = [];
                body.result.data.hits.hits.map(function(item, index) {
                  let obj = {};
                  obj.ID = item._source.JOBID;
                  obj.taskName = item._source.JOB_NAME;
                  obj.status = item._source.STAT;
                  obj.queue = item._source.QUEUE;
                  obj.startTime = item._source.START_TIME;
                  obj.runTime = item._source.CPU_USED;
                  obj.userName = item._source.USER;
                  _this.devices.push(obj);
                });
                _this.loading = false;
              }
            })
            .catch(res => {
              console.log(res);
            }); */
    },

    //重置按钮
    clearAll() {
      //节点名称
      this.userName = "";
      //节点类型
      this.taskSta = "";
      //所属组别
      this.queue = "";
    },

    nameSearch(queryString, cb) {
      var restaurants = this.nameRestaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    queueSearch(queryString, cb) {
      var restaurants = this.queueRestaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
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
.filter {
  border: 1px solid #e8e8e8;
  height: 170px;
}

.filterTop {
  width: 100%;
  height: 40px;
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  line-height: 40px;
}

.filterTop .left {
  display: inline-block;
  width: 49%;
  text-align: left;
  margin-left: 1%;
  color: #747474;
  font-size: 14px;
}

.filterTop .right {
  display: inline-block;
  width: 45%;
  text-align: right;
}

.filterTop .right .el-button {
  width: 82px;
  height: 28px;
  padding: 0 0;
}

.filter .row {
  margin-top: 20px;
}

.filter .row label {
  display: inline-block;
  width: 15%;
  text-align: right;
  margin-right: 2%;
  font-weight: 400;
}

.filter .row .el-input {
  width: 30%;
  height: 28px;
}

.filter .row .el-input__icon {
  line-height: 1 !important;
}

.filter .row .el-select {
  width: 30%;
  height: 28px;
}

.filter .row .el-autocomplete {
  width: 30%;
  height: 28px;
}

.filter .row .el-input__inner {
  height: 100%;
}

.filter .row .el-select .el-input--suffix {
  width: 100% !important;
}

.hasten {
  width: 100%;
  background-color: #fafafa;
  height: 40px;
  border: 1px solid #e8e8e8;
  margin-top: 20px;
  margin-bottom: 10px;
  line-height: 40px;
  padding: 5px 10px;
}

.hasten .el-button {
  margin-left: 2%;
  height: 28px;
  line-height: 0;
  float: right;
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