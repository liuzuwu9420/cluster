<template>
  <div class="app-container" @click="closeSidepage($event)">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="RUN">
        <span slot="label" class="tab-label">
          <i class="el-icon-document-copy" /> 运行中
        </span>
        <el-container class="el-container-run el-scrollbar">
          <el-main class="el-main-run">
            <div class="hasten">
              <div class="refreshBut">
                <el-tooltip class="item" effect="dark" content="自动刷新" placement="top">
                  <dropdown
                    :selected="dropdown.selected"
                    :items="dropdown.items"
                    @change="dropdownChanged"
                  />
                </el-tooltip>
              </div>
              <el-button type="primary" size="mini" @click="getList">
                <i class="el-icon-refresh-right" /> 手动刷新
              </el-button>
              <search :items="selected.items" @change="searchChanged" />
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
                ref="tableSidepageRUN"
                v-loading="loading"
                element-loading-text="作业同步中，请稍后..."
                :data="taskData"
                fit
                highlight-current-row
                style="width: 100%; cursor: pointer;"
                height="100%"
                @row-click="showSidepage"
              >
                <el-table-column label="ID" width="120">
                  <template v-slot="{row}">
                    <span>{{ row.JobID }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="作业名" show-overflow-tooltip>
                  <template v-slot="{row}">
                    <span>{{ row.JobName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="作业状态" width="120">
                  <template v-slot="{row}">
                    <el-tag size="mini" :type="statusMap[row.JobStatus].type">
                      <i :class="statusMap[row.JobStatus].icon" />
                      {{ row.JobStatus | JobStatus }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="队列">
                  <template v-slot="{row}">
                    <span>{{ row.QueueName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="开始时间" show-overflow-tooltip>
                  <template v-slot="{row}">
                    <span>{{ row.ExecuteTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="运行时长">
                  <template v-slot="{row}">
                    <span>{{ row.time }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="提交用户" width="140">
                  <template v-slot="{row}">
                    <span>{{ row.UserName }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <sidepage ref="SidepageNameRUN" :sidepagedata.sync="sidepagedata" />
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane name="PEND">
        <span slot="label" class="tab-label">
          <i class="el-icon-document-add" /> 等待中
        </span>
        <el-container>
          <el-main>
            <div class="hasten">
              <!-- <dropdown
                :selected="dropdown.selected"
                :items="dropdown.items"
                @change="dropdownChanged"
              />-->
              <el-button type="primary" size="mini" @click="getPendList">
                <i class="el-icon-refresh-right" /> 刷新
              </el-button>
              <search :items="selected.items" @change="searchChanged" />
              <div class="pagination">
                <pagination
                  v-show="page.total>0"
                  :total="page.total"
                  :page.sync="page.currentPage"
                  :limit.sync="page.pageSize"
                  @pagination="getPendList"
                />
              </div>
            </div>
            <div class="table-info el-scrollbar">
              <el-table
                ref="tableSidepagePEND"
                v-loading="loading"
                element-loading-text="作业同步中，请稍后..."
                :data="taskData"
                fit
                highlight-current-row
                style="width: 100%; cursor: pointer;"
                height="100%"
                @row-click="showSidepage"
              >

                <el-table-column label="ID" width="120">
                  <template v-slot="{row}">
                    <span>{{ row.JobID }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="作业名" show-overflow-tooltip>
                  <template v-slot="{row}">
                    <span>{{ row.JobName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="作业状态">
                  <template v-slot="{row}">
                    <el-tag size="mini" :type="statusMap[row.JobStatus].type">
                      <i :class="statusMap[row.JobStatus].icon" />
                      {{ row.JobStatus | JobStatus }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="队列">
                  <template v-slot="{row}">
                    <span>{{ row.QueueName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="等待时长">
                  <template v-slot="{row}">
                    <span>{{ row.time }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="提交用户" width="140">
                  <template v-slot="{row}">
                    <span>{{ row.UserName }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <sidepage ref="SidepageNamePEND" :sidepagedata.sync="sidepagedata" />
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane name="FINISH">
        <span slot="label" class="tab-label">
          <i class="el-icon-finished" /> 已完成
        </span>
        <el-container class="el-container-finish el-scrollbar">
          <el-main class="el-main-finish">
            <div class="hasten">
              <div class="headBut">
                <el-date-picker
                  v-model="dateTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </div>
              <el-button type="primary" size="mini" @click="getFinishList">
                <i class="el-icon-refresh-right" /> 刷新
              </el-button>
              <export-excel :list.sync="ExportList.list" :filter-val="ExportList.filterVal" :t-header="ExportList.tHeader" :items="ExportList.items" :selected="ExportList.selected" @change="ExportChanged" />
              <search :items="DoneSelected.items" @change="searchChanged" />
              <div class="pagination">
                <pagination
                  v-show="page.total>0"
                  :total="page.total"
                  :page.sync="page.currentPage"
                  :limit.sync="page.pageSize"
                  @pagination="getFinishList"
                />
              </div>
            </div>
            <div class="table-info el-scrollbar">
              <el-table
                ref="tableSidepageFINISH"
                v-loading="loading"
                element-loading-text="作业同步中，请稍后..."
                :data="taskData"
                fit
                highlight-current-row
                style="width: 100%; cursor: pointer;"
                height="100%"
                @row-click="showSidepage"
              >
                <el-table-column label="ID" width="120">
                  <template v-slot="{row}">
                    <span>{{ row.JobID }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="作业名" show-overflow-tooltip>
                  <template v-slot="{row}">
                    <span>{{ row.JobName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="作业状态">
                  <template v-slot="{row}">
                    <el-tag size="mini" :type="statusMap[row.JobStatus].type">
                      <i :class="statusMap[row.JobStatus].icon" />
                      {{ row.JobStatus | JobStatus }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="队列">
                  <template v-slot="{row}">
                    <span>{{ row.QueueName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="开始时间" show-overflow-tooltip>
                  <template v-slot="{row}">
                    <span>{{ row.ExecuteTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="运行时长">
                  <template v-slot="{row}">
                    <span>{{ row.time }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="费用">
                  <template v-slot="{row}">
                    <span>￥ {{ row.TotalCost }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="提交用户" width="140">
                  <template v-slot="{row}">
                    <span>{{ row.UserName }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <sidepage ref="SidepageNameFINISH" :sidepagedata.sync="sidepagedata" />
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  GetRunTaskList,
  GetPendTaskList,
  GetTaskList,
  GetJobIDList,
  GetJobIDHost
} from '@/api/task'

import { formatDate, formatDiff } from '@/utils/format'

/* import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { initFirst, connection, disconnect } from "@/utils/sockJS"; */

import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Dropdown from '@/components/Dropdown'
import ExportExcel from '@/components/ExportExcel'

import Sidepage from './components/Sidepage'

const statusMap = {
  RUN: {
    name: 'RUN',
    type: 'success',
    icon: 'el-icon-loading'
  },
  PEND: {
    name: 'PEND',
    type: 'warning',
    icon: 'el-icon-video-play'
  },
  DONE: {
    name: 'DONE',
    type: 'info',
    icon: 'el-icon-circle-check'
  },
  'DONE+PDONE': {
    name: 'DONE+PDONE',
    type: 'info',
    icon: 'el-icon-circle-check'
  },
  'DONE+PERR': {
    name: 'DONE+PERR',
    type: 'info',
    icon: 'el-icon-circle-check'
  },
  EXIT: {
    name: 'EXIT',
    type: 'danger',
    icon: 'el-icon-circle-close'
  }
}
export default {
  components: {
    Pagination,
    Search,
    Dropdown,
    Sidepage,
    ExportExcel
  },
  filters: {
    JobStatus(JobStatus) {
      return statusMap[JobStatus].name
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: 'RUN',
      dateTime: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 12)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 下拉选择数据
      dropdown: {
        selected: {
          key: 'OFF',
          value: 'off'
        },
        items: {
          OFF: 'off',
          5000: '5s',
          15000: '15s',
          600000: '1m',
          3000000: '5m'
        }
      },
      // 导出报表数据
      ExportList: {
        selected: {
          key: 'current',
          value: '当前页'
        },
        items: {
          current: '当前页'
        },
        list: [],
        filterVal: ['JobID', 'JobName', 'UUID', 'JobStatus', 'UserName', 'TotalCost', 'time', 'QueueName', 'ProjectName', 'JobGroup', 'SubmissionHostName', 'SubmitTime', 'ExecuteTime', 'EndTime', 'JobDescription'],
        tHeader: ['Id', '作业名', 'UUID', '作业状态', '用户名', '费用', '运行时长', '队列名', '项目名', '作业组', '作业提交主机', '作业提交时间', '作业开始执行时间', '作业结束时间', '描述']
      },
      // 计时器
      setTime: null,
      // 查询数据
      selected: {
        items: [
          {
            value: 'JobID',
            label: '作业ID'
          }
        ]
      },
      DoneSelected: {
        items: [
          {
            value: 'name',
            label: '名称'
          },
          {
            value: 'JobID',
            label: '作业ID'
          }
        ]
      },
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      taskData: [],
      loading: false,
      ID: '',
      stompClient: '',
      // Sidepage
      sidepagedata: {
        list: {},
        tabName: '',
        sidepageShow: false,
        TaskShow: true
      }
    }
  },
  watch: {
    dateTime() {
      this.getFinishList()
    }
  },
  created() {
    if (this.$route.params.Status) {
      const tab = {}
      tab.name = this.$route.params.Status
      this.activeName = tab.name
      this.handleClick(tab)
      if (this.$route.params.select) {
        this.searchChanged(this.$route.params)
      }
    } else {
      this.getList()
    }
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    getList() {
      const _this = this
      _this.loading = true
      const params = {
        page: {
          PageSize: _this.page.pageSize,
          PageNumber: _this.page.currentPage
        }
      }
      GetRunTaskList(params)
        .then(res => {
          _this.taskData = res.Inventory.ResultData.map(function(item, index) {
            item.ExecuteTime = formatDate(item.ExecuteTime, 'yyyy-MM-dd hh:mm:ss')
            item.time = formatDiff(item.ExecuteTime)
            if (item.JobStatus === '') {
              item.JobStatus = 'RUN'
            }
            GetJobIDHost(item.JobID)
              .then(data => {
                item.Host = data.Inventory
              })
              .catch(e => {
                _this.$message({
                  type: 'error',
                  message: '同步失败'
                })
              })
            if (item.Host) {
              return item
            } else {
              item.Host = []
              return item
            }
          })
          _this.page.total = res.Inventory.TotalNumber
          // _this.page.pageCount = res.Inventory.totalCount;
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
          _this.taskData = []
          _this.loading = false
        })
      /* let herfUrl = window.location.hostname;
      //let ws = new WebSocket(`ws://${herfUrl}:878`);
      let ws = new WebSocket(`ws://192.168.3.87:878`);
      ws.onopen = function() {
        ws.send(`{"queryID": "${_this.ID}"}`);
      };
      ws.onmessage = function(result) {
        let data = JSON.parse(result.data);
        console.log(data);
        _this.taskData = [];
        if (data.message == "noData") {
          _this.taskData = [];
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
            _this.taskData.push(obj);
          });
          _this.loading = false;
        }
      }; */
    },

    // 获取等待中作业
    getPendList() {
      const _this = this
      _this.loading = true
      const params = {
        page: {
          PageSize: _this.page.pageSize,
          PageNumber: _this.page.currentPage
        }
      }
      GetPendTaskList(params)
        .then(res => {
          _this.taskData = res.Inventory.ResultData.map(function(item, index) {
            item.SubmitTime = formatDate(item.SubmitTime, 'yyyy-MM-dd hh:mm:ss')
            item.time = formatDiff(item.SubmitTime)
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
          // _this.page.pageCount = res.Inventory.totalCount;
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
          _this.taskData = []
          _this.loading = false
        })
    },

    getFinishList(query) {
      const _this = this
      _this.loading = true
      const queryObj = {}
      const timeObj = {
        StartTime: '1970-10-01 00:00:00',
        EndTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      }
      if (query) {
        queryObj.JobName = query.value
      }
      if (_this.dateTime) {
        timeObj.StartTime = formatDate(_this.dateTime[0], 'yyyy-MM-dd hh:mm:ss')
        timeObj.EndTime = formatDate(_this.dateTime[1], 'yyyy-MM-dd hh:mm:ss')
      }
      const params = {
        page: {
          PageSize: _this.page.pageSize,
          PageNumber: _this.page.currentPage
        },
        query: queryObj,
        time: timeObj
      }
      GetTaskList(params)
        .then(res => {
          _this.taskData = res.Inventory.ResultData.map(function(item, index) {
            item.SubmitTime = formatDate(item.SubmitTime, 'yyyy-MM-dd hh:mm:ss')
            item.EndTime = formatDate(item.EndTime, 'yyyy-MM-dd hh:mm:ss')
            if (item.ExecuteTime) {
              item.ExecuteTime = formatDate(item.ExecuteTime, 'yyyy-MM-dd hh:mm:ss')
              item.time = formatDiff(item.ExecuteTime, item.EndTime)
            } else {
              item.time = '0秒'
            }
            GetJobIDHost(item.JobID)
              .then(data => {
                item.Host = data.Inventory
              })
              .catch(e => {
                _this.$message({
                  type: 'error',
                  message: '同步失败'
                })
              })
            if (item.Host) {
              return item
            } else {
              item.Host = []
              return item
            }
          })
          _this.page.total = res.Inventory.TotalNumber
          _this.ExportList.list = _this.taskData
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
          _this.taskData = []
          _this.loading = false
        })
    },

    // 显示Sidepage
    showSidepage(row, column, event) {
      const _this = this
      let FixedCli
      if (_this.activeName === 'RUN') {
        FixedCli = this.$refs.tableSidepageRUN.$refs.rightFixedWrapper
      } else if (_this.activeName === 'PEND') {
        FixedCli = this.$refs.tableSidepagePEND.$refs.rightFixedWrapper
      } else if (_this.activeName === 'FINISH') {
        FixedCli = this.$refs.tableSidepageFINISH.$refs.rightFixedWrapper
      }
      if (!FixedCli || !FixedCli.contains(event.target)) {
        if (_this.activeName === 'RUN') {
          this.$refs.tableSidepageRUN.setCurrentRow(row)
        } else if (_this.activeName === 'PEND') {
          this.$refs.tableSidepagePEND.setCurrentRow(row)
        } else if (_this.activeName === 'FINISH') {
          this.$refs.tableSidepageFINISH.setCurrentRow(row)
        }
        _this.sidepagedata.list = row
        _this.sidepagedata.tabName = _this.activeName
        _this.sidepagedata.sidepageShow = true
      }
    },

    // 点击其它区域边页隐藏
    closeSidepage(event) {
      let FixedCli1
      let FixedCli2
      if (this.activeName === 'RUN') {
        FixedCli1 = this.$refs.tableSidepageRUN
        FixedCli2 = this.$refs.SidepageNameRUN
      } else if (this.activeName === 'PEND') {
        FixedCli1 = this.$refs.tableSidepagePEND
        FixedCli2 = this.$refs.SidepageNamePEND
      } else if (this.activeName === 'FINISH') {
        FixedCli1 = this.$refs.tableSidepageFINISH
        FixedCli2 = this.$refs.SidepageNameFINISH
      }
      if (FixedCli1 && FixedCli2) {
        const currentCli1 = FixedCli1.$refs.bodyWrapper.firstChild
        const currentCli2 = FixedCli2.$el
        if (currentCli1 && currentCli2) {
          if (!currentCli1.contains(event.target) && !currentCli2.contains(event.target)) { // 点击到了id为sellineName以外的区域，隐藏下拉框
            this.sidepagedata.sidepageShow = false
          }
        }
      }
    },

    // tab点击事件
    handleClick(tab, event) {
      if (tab.name === 'RUN') {
        this.getList()
        this.start(+this.dropdown.selected.key)
      } else if (tab.name === 'PEND') {
        this.stop()
        this.getPendList()
      } else if (tab.name === 'EXIT') {
        this.stop()
        this.getFinishList()
      } else if (tab.name === 'FINISH') {
        this.stop()
        this.getFinishList()
      }
    },

    // 下拉选择发生改变触发事件
    dropdownChanged(data) {
      const _this = this
      if (data.key === 'OFF') {
        _this.stop()
      } else {
        data.key = +data.key
        _this.start(data.key)
      }
    },

    start(time) {
      const _this = this
      if (_this.setTime != null) {
        clearInterval(_this.setTime)
        _this.setTime = null
      }
      _this.setTime = setInterval(function() {
        _this.getList()
      }, time)
    },

    stop() {
      const _this = this
      clearInterval(_this.setTime)
      _this.setTime = null
    },

    // 导出报表
    ExportChanged(data) {
      const _this = this
      if (data.key === 'current') {
        _this.ExportList.list = _this.taskData
      }
    },

    // 搜索
    searchChanged(data) {
      const _this = this
      if (data.select === 'name') {
        if (data.value === '') {
          _this.getFinishList()
        } else {
          _this.getFinishList(data)
        }
      } else if (data.select === 'JobID') {
        if (data.value === '' && _this.activeName === 'RUN') {
          _this.getList()
        } else if (data.value === '' && _this.activeName === 'PEND') {
          _this.getPendList()
        } else if (data.value === '' && _this.activeName === 'FINISH') {
          _this.getFinishList()
        } else {
          _this.loading = true
          GetJobIDList(data.value)
            .then(res => {
              _this.taskData = []
              _this.taskData.push(res.Inventory)
              _this.taskData = _this.taskData.map(function(item, index) {
                if (item.ExecuteTime) {
                  item.ExecuteTime = formatDate(item.ExecuteTime, 'yyyy-MM-dd hh:mm:ss')
                }
                item.SubmitTime = formatDate(item.SubmitTime, 'yyyy-MM-dd hh:mm:ss')
                // 保存一份原始数据，便于取消编辑的时候还原数据
                const original = _this._.cloneDeep(item)
                item.original = original
                _this.$set(item, 'edit', false)
                return item
              })
              _this.page.total = _this.taskData.length
              _this.loading = false
            })
            .catch(res => {
              console.log(res)
              _this.loading = false
            })
        }
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 100%;
}

.tab-label {
  font-size: 18px;
}

.hasten {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 5px 10px;
}

.hasten .el-button {
  height: 36px;
  line-height: 0;
  float: left;
  margin-right: 10px;
  margin-left: 0px;
}

.hasten .refreshBut {
  float: left;
}

.hasten .headBut {
  margin-right: 10px;
  float: left;
}

.pagination {
  float: right;
}

.table-info {
  height: calc(100vh - 200px);
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
  width: 35%;
}

.table-expand .el-form-item:nth-child(3n-1) {
  width: 25%;
}

.table-expand .el-form-item:nth-child(3n-2) {
  width: 30%;
}

.el-table .table-expand .form-item-exit {
  width: 50%;
}

.el-table .table-expand .form-item-finish {
  width: 100%;
}

.el-container-run {
  overflow-x: auto;
}

.el-main-run {
  overflow-x: auto;
}

.el-container-finish {
  overflow-x: auto;
}

.el-main-finish {
  min-width: 1185px;
  overflow-x: auto;
}

.JobInfoSidepage {
  color: #3c73b9;
  cursor: pointer;
}

.JobInfoSidepage:hover {
  color: #1890ff;
  text-decoration:underline;
}
</style>
