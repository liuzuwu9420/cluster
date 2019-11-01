<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="RUN">
        <span slot="label" class="tab-label">
          <i class="el-icon-document-copy" /> 运行中
        </span>
        <el-container>
          <el-main>
            <div class="hasten">
              <search :items="selected.items" @change="searchChanged" />
              <el-button type="primary" size="mini" @click="getList">
                <i class="el-icon-refresh-right" /> 手动刷新
              </el-button>
              <el-button type="primary" size="mini" @click="sync">
                <i class="el-icon-refresh-right" /> 同步
              </el-button>
              <div class="refreshBut">
                <el-tooltip class="item" effect="dark" content="自动刷新" placement="top">
                  <dropdown
                    :selected="dropdown.selected"
                    :items="dropdown.items"
                    @change="dropdownChanged"
                  />
                </el-tooltip>
              </div>
            </div>
            <el-table
              v-loading="loading"
              element-loading-text="作业同步中，请稍后..."
              :data="devices"
              fit
              highlight-current-row
              style="width: 100%"
              max-height="610px"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="作业名">
                      <span>{{ props.row.JobName }}</span>
                    </el-form-item>
                    <el-form-item label="作业id">
                      <span>{{ props.row.JobID }}</span>
                    </el-form-item>
                    <el-form-item label="UUID">
                      <span>{{ props.row.UUID }}</span>
                    </el-form-item>
                    <el-form-item label="作业组">
                      <span>{{ props.row.JobGroup }}</span>
                    </el-form-item>
                    <el-form-item label="队列名">
                      <span>{{ props.row.QueueName }}</span>
                    </el-form-item>
                    <el-form-item label="项目名">
                      <span>{{ props.row.ProjectName }}</span>
                    </el-form-item>
                    <el-form-item label="用户名">
                      <span>{{ props.row.UserName }}</span>
                    </el-form-item>
                    <el-form-item label="作业状态">
                      <span>
                        <el-tag size="mini" :type="statusMap[props.row.JobStatus].type">
                          <i :class="statusMap[props.row.JobStatus].icon" />
                          {{ props.row.JobStatus | JobStatus }}
                        </el-tag>
                      </span>
                    </el-form-item>
                    <el-form-item label="作业提交主机">
                      <span>{{ props.row.SubmissionHostName }}</span>
                    </el-form-item>
                    <el-form-item label="开始时间">
                      <span>{{ props.row.StartTime }}</span>
                    </el-form-item>
                    <el-form-item label="运行时间">
                      <span>{{ props.row.ExecuteDuration }}</span>
                    </el-form-item>
                    <el-form-item label="描述">
                      <span>{{ props.row.JobDescription }}</span>
                    </el-form-item>
                    <el-form-item label="运行节点">
                      <el-table
                        :data="props.row.Host"
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="HostName"
                          label="节点名"
                        />
                        <el-table-column
                          prop="NumSlots"
                          label="所占cpu核数"
                        />
                      </el-table>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
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
                  <span>{{ row.StartTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="运行时长">
                <template v-slot="{row}">
                  <span>{{ row.ExecuteDuration }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交用户" width="140">
                <template v-slot="{row}">
                  <span>{{ row.UserName }}</span>
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
              <search :items="selected.items" @change="searchChanged" />
              <el-button type="primary" size="mini" @click="getFinishList">
                <i class="el-icon-refresh-right" /> 刷新
              </el-button>
            </div>
            <el-table
              v-loading="loading"
              element-loading-text="作业同步中，请稍后..."
              :data="devices"
              fit
              highlight-current-row
              style="width: 100%"
              max-height="610px"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="作业名">
                      <span>{{ props.row.JobName }}</span>
                    </el-form-item>
                    <el-form-item label="作业id">
                      <span>{{ props.row.JobID }}</span>
                    </el-form-item>
                    <el-form-item label="UUID">
                      <span>{{ props.row.UUID }}</span>
                    </el-form-item>
                    <el-form-item label="作业组">
                      <span>{{ props.row.JobGroup }}</span>
                    </el-form-item>
                    <el-form-item label="队列名">
                      <span>{{ props.row.QueueName }}</span>
                    </el-form-item>
                    <el-form-item label="项目名">
                      <span>{{ props.row.ProjectName }}</span>
                    </el-form-item>
                    <el-form-item label="用户名">
                      <span>{{ props.row.UserName }}</span>
                    </el-form-item>
                    <el-form-item label="作业状态">
                      <span>
                        <el-tag size="mini" :type="statusMap[props.row.JobStatus].type">
                          <i :class="statusMap[props.row.JobStatus].icon" />
                          {{ props.row.JobStatus | JobStatus }}
                        </el-tag>
                      </span>
                    </el-form-item>
                    <el-form-item label="作业提交主机">
                      <span>{{ props.row.SubmissionHostName }}</span>
                    </el-form-item>
                    <el-form-item label="作业提交时间">
                      <span>{{ props.row.SubmitTime }}</span>
                    </el-form-item>
                    <el-form-item label="等待时间">
                      <span>{{ props.row.PendDuration }}</span>
                    </el-form-item>
                    <el-form-item label="描述">
                      <span>{{ props.row.JobDescription }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
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
              <el-table-column label="等待时间">
                <template v-slot="{row}">
                  <span>{{ row.PendDuration }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交用户" width="140">
                <template v-slot="{row}">
                  <span>{{ row.UserName }}</span>
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
              @pagination="getFinishList"
            />
          </el-footer>
        </el-container>
      </el-tab-pane>
      <!-- <el-tab-pane name="EXIT">
        <span slot="label" class="tab-label">
          <i class="el-icon-document-delete" /> 已退出
        </span>
        <el-container>
          <el-main>
            <div class="hasten">
              <search :items="selected.items" @change="searchChanged" />
              <el-button type="primary" size="mini" @click="getFinishList">
                <i class="el-icon-refresh-right" /> 刷新
              </el-button>
            </div>
            <el-table
              v-loading="loading"
              element-loading-text="作业同步中，请稍后..."
              :data="devices"
              fit
              highlight-current-row
              style="width: 100%"
              max-height="610px"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="作业名">
                      <span>{{ props.row.JobName }}</span>
                    </el-form-item>
                    <el-form-item label="作业id">
                      <span>{{ props.row.JobID }}</span>
                    </el-form-item>
                    <el-form-item label="UUID">
                      <span>{{ props.row.UUID }}</span>
                    </el-form-item>
                    <el-form-item label="作业组">
                      <span>{{ props.row.JobGroup }}</span>
                    </el-form-item>
                    <el-form-item label="队列名">
                      <span>{{ props.row.QueueName }}</span>
                    </el-form-item>
                    <el-form-item label="项目名">
                      <span>{{ props.row.ProjectName }}</span>
                    </el-form-item>
                    <el-form-item label="用户名">
                      <span>{{ props.row.UserName }}</span>
                    </el-form-item>
                    <el-form-item label="作业状态">
                      <span>
                        <el-tag size="mini" :type="statusMap[props.row.JobStatus].type">
                          <i :class="statusMap[props.row.JobStatus].icon" />
                          {{ props.row.JobStatus | JobStatus }}
                        </el-tag>
                      </span>
                    </el-form-item>
                    <el-form-item label="作业提交主机">
                      <span>{{ props.row.SubmissionHostName }}</span>
                    </el-form-item>
                    <el-form-item label="开始时间">
                      <span>{{ props.row.StartTime }}</span>
                    </el-form-item>
                    <el-form-item label="运行时间">
                      <span>{{ props.row.ExecuteDuration }}</span>
                    </el-form-item>
                    <el-form-item label="结束时间">
                      <span>{{ props.row.EndTime }}</span>
                    </el-form-item>
                    <el-form-item label="退出原因" class="form-item-exit">
                      <span>{{ props.row.ExitReason }}</span>
                    </el-form-item>
                    <el-form-item label="描述" class="form-item-exit">
                      <span>{{ props.row.JobDescription }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
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
                  <span>{{ row.StartTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="运行时间">
                <template v-slot="{row}">
                  <span>{{ row.ExecuteDuration }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交用户" width="140">
                <template v-slot="{row}">
                  <span>{{ row.UserName }}</span>
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
              @pagination="getFinishList"
            />
          </el-footer>
        </el-container>
      </el-tab-pane> -->
      <el-tab-pane name="FINISH">
        <span slot="label" class="tab-label">
          <i class="el-icon-finished" /> 已完成
        </span>
        <el-container>
          <el-main>
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
              <search :items="selected.items" @change="searchChanged" />
              <el-button type="primary" size="mini" @click="getFinishList">
                <i class="el-icon-refresh-right" /> 刷新
              </el-button>
            </div>
            <el-table
              v-loading="loading"
              element-loading-text="作业同步中，请稍后..."
              :data="devices"
              fit
              highlight-current-row
              style="width: 100%"
              max-height="610px"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="作业名">
                      <span>{{ props.row.JobName }}</span>
                    </el-form-item>
                    <el-form-item label="作业id">
                      <span>{{ props.row.JobID }}</span>
                    </el-form-item>
                    <el-form-item label="UUID">
                      <span>{{ props.row.UUID }}</span>
                    </el-form-item>
                    <el-form-item label="作业组">
                      <span>{{ props.row.JobGroup }}</span>
                    </el-form-item>
                    <el-form-item label="队列名">
                      <span>{{ props.row.QueueName }}</span>
                    </el-form-item>
                    <el-form-item label="项目名">
                      <span>{{ props.row.ProjectName }}</span>
                    </el-form-item>
                    <el-form-item label="用户名">
                      <span>{{ props.row.UserName }}</span>
                    </el-form-item>
                    <el-form-item label="作业状态">
                      <span>
                        <el-tag size="mini" :type="statusMap[props.row.JobStatus].type">
                          <i :class="statusMap[props.row.JobStatus].icon" />
                          {{ props.row.JobStatus | JobStatus }}
                        </el-tag>
                      </span>
                    </el-form-item>
                    <el-form-item label="作业提交主机">
                      <span>{{ props.row.SubmissionHostName }}</span>
                    </el-form-item>
                    <el-form-item label="开始时间">
                      <span>{{ props.row.StartTime }}</span>
                    </el-form-item>
                    <el-form-item label="运行时间">
                      <span>{{ props.row.ExecuteDuration }}</span>
                    </el-form-item>
                    <el-form-item label="结束时间">
                      <span>{{ props.row.EndTime }}</span>
                    </el-form-item>
                    <el-form-item label="描述" class="form-item-finish">
                      <span>{{ props.row.JobDescription }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
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
                  <span>{{ row.StartTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="运行时间">
                <template v-slot="{row}">
                  <span>{{ row.ExecuteDuration }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交用户" width="140">
                <template v-slot="{row}">
                  <span>{{ row.UserName }}</span>
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
              @pagination="getFinishList"
            />
          </el-footer>
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
  GetJobNameList,
  GetJobIDList,
  GetJobIDHost
} from '@/api/monitor'
import { syncHost } from '@/api/sync'

import { formatDate } from '@/utils/format'

/* import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { initFirst, connection, disconnect } from "@/utils/sockJS"; */

import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Dropdown from '@/components/Dropdown'

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
    Dropdown
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
      // 计时器
      setTime: null,
      // 查询数据
      selected: {
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
      devices: [],
      loading: false,
      ID: '',
      stompClient: ''
    }
  },
  watch: {
    dateTime() {
      this.getFinishList()
    }
  },
  created() {
    console.log(this.$route.params.Status)
    if (this.$route.params.Status) {
      const tab = {}
      tab.name = this.$route.params.Status
      this.activeName = tab.name
      console.log(this.activeName)
      this.handleClick(tab)
    } else {
      this.getList()
    }
  },
  beforeDestroy() {
    if (this.stompClient) {
      this.disconnect()
    }
  },
  methods: {
    getList() {
      const _this = this
      _this.loading = true
      const params = {
        PageSize: _this.page.pageSize,
        PageNumber: _this.page.currentPage
      }
      GetRunTaskList(params)
        .then(res => {
          _this.devices = res.Inventory.ResultData.map(function(item, index) {
            item.StartTime = formatDate(item.StartTime, 'yyyy-MM-dd hh:mm:ss')
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
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
          // _this.page.pageCount = res.Inventory.totalCount;
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
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

    // 获取等待中作业
    getPendList() {
      const _this = this
      _this.loading = true
      const params = {
        PageSize: _this.page.pageSize,
        PageNumber: _this.page.currentPage
      }
      GetPendTaskList(params)
        .then(res => {
          _this.devices = res.Inventory.ResultData.map(function(item, index) {
            item.SubmitTime = formatDate(item.SubmitTime, 'yyyy-MM-dd hh:mm:ss')
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
          // _this.page.pageCount = res.Inventory.totalCount;
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
        })
    },

    getFinishList() {
      const _this = this
      _this.loading = true
      const params = {
        page: {
          PageSize: _this.page.pageSize,
          PageNumber: _this.page.currentPage
        },
        query: {},
        time: {
          StartTime: formatDate(_this.dateTime[0], 'yyyy-MM-dd hh:mm:ss'),
          EndTime: formatDate(_this.dateTime[1], 'yyyy-MM-dd hh:mm:ss')
        }
      }
      console.log(params)
      GetTaskList(params)
        .then(res => {
          _this.devices = res.Inventory.ResultData.map(function(item, index) {
            item.StartTime = formatDate(item.StartTime, 'yyyy-MM-dd hh:mm:ss')
            item.EndTime = formatDate(item.EndTime, 'yyyy-MM-dd hh:mm:ss')
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
          // _this.page.pageCount = res.Inventory.totalCount;
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
        })
    },

    // tab点击事件
    handleClick(tab, event) {
      if (tab.name === 'RUN') {
        this.getList()
      } else if (tab.name === 'PEND') {
        this.getPendList()
      } else if (tab.name === 'EXIT') {
        this.getFinishList()
      } else if (tab.name === 'FINISH') {
        this.getFinishList()
      }
    },

    // tongbu
    sync() {
      syncHost()
        .then(res => {
          console.log(res)
        })
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

    // 搜索
    searchChanged(data) {
      const _this = this
      if (data.select === 'name') {
        _this.loading = true
        const params = {
          page: {
            PageSize: _this.page.pageSize,
            PageNumber: _this.page.currentPage
          },
          query: {
            job_name: data.value
          }
        }
        GetJobNameList(params)
          .then(res => {
            _this.devices = res.Inventory.ResultData.map(function(item, index) {
              // 保存一份原始数据，便于取消编辑的时候还原数据
              const original = _this._.cloneDeep(item)
              item.original = original
              _this.$set(item, 'edit', false)
              return item
            })
            _this.page.total = res.Inventory.TotalNumber
            _this.loading = false
          })
          .catch(res => {
            console.log(res)
          })
      } else if (data.select === 'JobID') {
        _this.loading = true
        GetJobIDList(data.value)
          .then(res => {
            _this.devices = []
            _this.devices.push(res.Inventory)
            _this.devices = _this.devices.map(function(item, index) {
              // 保存一份原始数据，便于取消编辑的时候还原数据
              const original = _this._.cloneDeep(item)
              item.original = original
              _this.$set(item, 'edit', false)
              return item
            })
            /* _this.page.total = res.data.pageResultData.totalDataNumber;
          _this.page.pageCount = res.data.pageResultData.totalCount; */
            _this.loading = false
          })
          .catch(res => {
            console.log(res)
          })
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
  float: right;
  margin-left: 10px;
}

.hasten .refreshBut {
  float: right;
}

.hasten .headBut {
  margin-right: 10px;
  margin-left: 0px;
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
</style>
