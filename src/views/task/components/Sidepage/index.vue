<template>
  <div v-if="sidepagedata.sidepageShow" :class="[&quot;tableInfo&quot;,TaskShow ? &quot;tableInfoEvents&quot; : &quot;&quot;]">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="close">
        <span slot="label" @click="sidepagedata.sidepageShow=false">
          <i class="el-icon-close" />
        </span>
      </el-tab-pane>
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="container el-scrollbar">
          <el-row v-show="TaskShow" class="basic-container">
            <el-col :xs="24" :sm="24" :lg="10">
              <div class="left-head">
                <div class="left-head-name">
                  <span class="HostName">{{ sidepagedata.list.JobName }}</span>
                </div>
              </div>
              <div class="left-body">
                <div class="left-head-title">
                  <i class="el-icon-notebook-1" />
                  <span class="head-title">概览</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">ID:</div>
                  <span class="right-content">{{ sidepagedata.list.JobID }}</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">UUID:</div>
                  <div class="right-content" @mouseover="over($event)" @mouseout="out($event)" @mousemove="move($event)">{{ sidepagedata.list.UUID }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">用户名:</div>
                  <el-tooltip class="item" effect="dark" content="跳转用户" placement="top-start">
                    <div class="right-content jumpLink" @click="jumpUser(sidepagedata.list.UserName)">{{ sidepagedata.list.UserName }}</div>
                  </el-tooltip>
                </div>
                <div class="detail-row">
                  <div class="left-title">队列名:</div>
                  <el-tooltip class="item" effect="dark" content="跳转队列" placement="top-start">
                    <div class="right-content jumpLink" @click="jumpQueue(sidepagedata.list.QueueName)">{{ sidepagedata.list.QueueName }}</div>
                  </el-tooltip>
                </div>
                <div class="detail-row">
                  <div class="left-title">项目名:</div>
                  <div class="right-content">{{ sidepagedata.list.ProjectName }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">费用:</div>
                  <div class="right-content">￥ {{ sidepagedata.list.TotalCost }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">运行时长:</div>
                  <div class="right-content">{{ sidepagedata.list.time }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">运行节点:</div>
                  <div class="right-content">
                    <span
                      v-for="(item, index) in sidepagedata.list.Host"
                      :key="index"
                    >&nbsp;&nbsp;{{ item.NumSlots }}*{{ item.HostName }}</span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="left-title">作业组:</div>
                  <div class="right-content">{{ sidepagedata.list.JobGroup }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">作业提交主机:</div>
                  <div class="right-content">{{ sidepagedata.list.SubmissionHostName }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">作业提交时间:</div>
                  <div class="right-content">{{ sidepagedata.list.SubmitTime }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">作业开始执行时间:</div>
                  <div class="right-content">{{ sidepagedata.list.ExecuteTime }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">作业结束时间:</div>
                  <div class="right-content">{{ sidepagedata.list.EndTime }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">描述:</div>
                  <div class="right-content">{{ sidepagedata.list.JobDescription }}</div>
                </div>
              </div>
            </el-col>
            <el-col v-show="eventsShow" :xs="24" :sm="24" :lg="14">
              <div class="right-body">
                <div class="right-head-title">
                  <i class="el-icon-notebook-2" />
                  <span class="head-title">历史事件</span>
                </div>
                <div style="height: 300px; max-height: 690px; padding-top: 20px;">
                  <el-steps direction="vertical" :active="activeEvents">
                    <el-step
                      v-for="(item, index) in events"
                      :key="index"
                      :title="item.CurrentStatus"
                      :description="item.description"
                      :icon="item.Icon"
                    />
                  </el-steps>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row v-show="!TaskShow" class="basic-container">
            <el-col :xs="24" :sm="24" :lg="10">
              <div class="left-head">
                <div class="left-head-name">
                  <span class="HostName">{{ sidepagedata.list.QUEUE_NAME }}</span>
                </div>
              </div>
              <div class="left-body">
                <div class="left-head-title">
                  <i class="el-icon-notebook-1" />
                  <span class="head-title">概览</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">RUN:</div>
                  <span class="right-content">{{ sidepagedata.list.RUN }}</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">PEND:</div>
                  <div class="right-content">{{ sidepagedata.list.PEND }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">SUSP:</div>
                  <div class="right-content">{{ sidepagedata.list.SUSP }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">NJOBS:</div>
                  <div class="right-content">{{ sidepagedata.list.NJOBS }}</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="14">
              <div class="right-body">
                <div class="right-head-title">
                  <i class="el-icon-notebook-2" />
                  <span class="head-title">配置</span>
                </div>
                <div
                  v-for="(item, index) in sidepagedata.list.conf"
                  :key="index"
                  class="detail-row"
                >
                  <div class="left-title" @mouseover="over($event)" @mouseout="out($event)" @mousemove="move($event)">{{ item.label }}:</div>
                  <div class="right-content" @mouseover="over($event)" @mouseout="out($event)" @mousemove="move($event)">{{ item.value }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="!TaskShow" label="作业" name="taskData">
        <div class="container el-scrollbar">
          <div class="hasten">
            <div class="headBut">
              <el-tooltip class="item" effect="dark" content="作业" placement="top">
                <dropdown
                  :selected="dropdown.selected"
                  :items="dropdown.items"
                  @change="dropdownChanged"
                />
              </el-tooltip>
            </div>
            <search :items="selected.items" @change="searchChanged" />
            <div class="pagination">
              <pagination
                v-show="page.total>0"
                :total="page.total"
                :page.sync="page.currentPage"
                :limit.sync="page.pageSize"
                @pagination="getQueueTask"
              />
            </div>
          </div>
          <div class="table-info el-scrollbar">
            <el-table
              v-loading="loading"
              :data="tasksData"
              element-loading-text="Loading"
              fit
              style="width: 100%; background-color: #e8f4ff;"
              row-class-name="table-row-class"
              height="100%"
            >
              <el-table-column label="ID" width="120">
                <template v-slot="{row}">
                  <el-tooltip class="item" effect="dark" content="跳转作业" placement="top">
                    <span class="userLink" @click="getJobID(row)">{{ row.JobID }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column label="名称" width="160">
                <template v-slot="{row}">
                  <span>{{ row.JobName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="作业状态" width="140">
                <template v-slot="{row}">
                  <el-tag size="mini" :type="statusMap[row.JobStatus].type">
                    <i :class="statusMap[row.JobStatus].icon" />
                    {{ row.JobStatus | JobStatus }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column v-if="dropdown.selected.value==='RUN'?true:false" label="开始时间" show-overflow-tooltip>
                <template v-slot="{row}">
                  <span>{{ row.ExecuteTime }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="dropdown.selected.value==='RUN'?true:false" label="运行时长">
                <template v-slot="{row}">
                  <span>{{ row.time }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="dropdown.selected.value==='PEND'?true:false" label="提交时间">
                <template v-slot="{row}">
                  <span>{{ row.SubmitTime }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="dropdown.selected.value==='PEND'?true:false" label="等待时长">
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
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { GetJobIDEvents, GetTaskList, GetJobIDHost } from '../../../../api/task'
import { formatDate, formatDiff } from '../../../../utils/format'
import { mouseover, mouseout, mousemove } from '../../../../utils/hover'

// import Tags from '@/components/Tags'
import Pagination from '@/components/Pagination'
import Dropdown from '@/components/Dropdown'
import Search from '@/components/Search'

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
  name: 'TasksSidepage',
  components: {
    Pagination,
    Dropdown,
    Search
    // Tags
  },
  filters: {
    JobStatus(JobStatus) {
      return statusMap[JobStatus].name
    }
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          list: {},
          tabName: '',
          sidepageShow: false,
          TaskShow: true
        }
      }
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: 'BasicAttribute',
      eventsShow: false,
      events: [],
      activeEvents: 0,
      TaskShow: true,
      // 下拉选择数据
      dropdown: {
        selected: {
          key: 'RUN',
          value: 'RUN'
        },
        items: {
          RUN: 'RUN',
          PEND: 'PEND'
        }
      },
      // 查询数据
      selected: {
        items: [
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
      loading: false,
      tasksData: []
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val) {
        if (val.sidepageShow && val.TaskShow) {
          if (val.tabName === 'FINISH') {
            this.eventsShow = true
          } else {
            this.eventsShow = false
          }
          this.getEvents()
        } else if (val.sidepageShow && !val.TaskShow) {
          this.getQueueTask()
        }
        this.TaskShow = val.TaskShow
      },
      deep: true
    }
  },
  methods: {
    handleClick(tabs) {
      const _this = this
      if (tabs.name === 'close') {
        _this.sidepagedata.sidepageShow = false
        _this.activeName = 'BasicAttribute'
      }
    },
    getEvents() {
      const _this = this
      GetJobIDEvents(_this.sidepagedata.list.JobID)
        .then(res => {
          _this.events = res.Inventory.map(item => {
            item.ChangeTime = formatDate(item.ChangeTime, 'yyyy-MM-dd hh:mm:ss')
            item.description = item.ChangeTime + ' ' + item.ChangeReason
            if (item.CurrentStatus === 'PEND') {
              _this.$set(item, 'Icon', 'el-icon-video-play')
            } else if (item.CurrentStatus === 'RUN') {
              _this.$set(item, 'Icon', 'el-icon-refresh')
            } else if (item.CurrentStatus === 'EXIT') {
              _this.$set(item, 'Icon', 'el-icon-circle-close')
            } else if (item.CurrentStatus === 'DONE') {
              _this.$set(item, 'Icon', 'el-icon-circle-check')
            } else if (item.CurrentStatus === 'DONE+PDONE') {
              _this.$set(item, 'Icon', 'el-icon-success')
            } else {
              _this.$set(item, 'Icon', 'el-icon-remove')
            }
            return item
          })
          _this.activeEvents = _this.events.length
        }).catch(res => {
          console.log(res)
        })
    },
    // 下拉选择发生改变触发事件
    dropdownChanged(data) {
      const _this = this
      _this.getQueueTask()
      /* if (data.key === 'RUN') {
      } else if (data.key === 'PEND') {
        _this.getQueueTask()
      } */
    },
    getQueueTask(query) {
      const _this = this
      _this.loading = true
      const queryObj = {}
      const timeObj = {
        StartTime: '1970-10-01 00:00:00',
        EndTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      }
      if (query) {
        queryObj.JobID = query.value
      }
      queryObj.QueueName = _this.sidepagedata.list.QUEUE_NAME
      queryObj.JobStatus = _this.dropdown.selected.value
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
          _this.tasksData = res.Inventory.ResultData.map(function(item, index) {
            item.SubmitTime = formatDate(item.SubmitTime, 'yyyy-MM-dd hh:mm:ss')
            if (item.ExecuteTime) {
              item.ExecuteTime = formatDate(item.ExecuteTime, 'yyyy-MM-dd hh:mm:ss')
              item.time = formatDiff(item.ExecuteTime)
            } else {
              item.time = formatDiff(item.SubmitTime)
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
          _this.loading = false
        })
        .catch(res => {
          console.log(res)
          _this.taskData = []
          _this.loading = false
        })
    },
    // 搜索
    searchChanged(data) {
      const _this = this
      if (data.select === 'JobID') {
        if (data.value === '') {
          _this.getQueueTask()
        } else {
          _this.getQueueTask(data)
        }
      }
    },
    // 跳转作业
    getJobID(data) {
      const _this = this
      _this.$router.push({
        name: 'task.taskList',
        params: {
          select: 'JobID',
          value: data.JobID,
          Status: _this.dropdown.selected.value
        }
      })
    },
    // 跳转队列
    jumpQueue(data) {
      const _this = this
      _this.$router.push({
        name: 'task.queueList',
        params: {
          select: 'name',
          value: data
        }
      })
    },
    // 跳转用户
    jumpUser(data) {
      const _this = this
      _this.$router.push({
        name: 'role.user',
        params: {
          select: 'name',
          value: data
        }
      })
    },
    /*
			 *隐藏字体显示
			 * */
    over(e) {
      mouseover(e)
    },
    out(e) {
      mouseout(e)
    },
    move(e) {
      mousemove(e)
    }
  }
}
</script>
<style lang="scss" scoped>
.tableInfo {
  left: 130px;
  position: absolute;
  top: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border-right: 1px solid #fff;
  z-index: 1500;
  background: #fff;
  .el-tabs {
    background-color: #eff9ff;
  }
  .el-tab-pane {
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
    font-size: 16px;
    background-color: #e8f4ff;
    padding: 0 10px;
  }
  .basic-container {
    padding-left: 60px;
  }
  .left-head {
    margin-top: 20px;
    line-height: 20px;
    font-size: 0;
    color: #1a2736;
    .HostName {
      font-size: 24px;
      line-height: 26px;
      height: 26px;
      padding: 0 0 0 1px;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .left-head-name {
      margin-bottom: 5px;
    }
    .hosts-tags {
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .left-body {
    margin-top: 30px;
    .left-head-title {
      border-bottom: 1px solid #5e6978;
      padding-bottom: 8px;
      color: #1a2736;
      font-size: 18px;
      margin-right: 60px;
      margin-bottom: 5px;
    }
  }
  .head-title {
    margin-left: 5px;
  }
  .right-head-title {
    border-bottom: 1px solid #5e6978;
    padding-bottom: 8px;
    color: #1a2736;
    font-size: 18px;
    margin-right: 60px;
    margin-bottom: 5px;
    margin-top: 40px;
  }
  .detail-row {
    padding-top: 20px;
    height: 40px;
    font-size: 14px;
    line-height: 24px;
    margin-right: 60px;
  }
  .left-title {
    width: 130px;
    color: #5e6978;
    float: left;
    margin-right: 5px;
    overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
  }
  .left-content {
    color: #1a2736;
    overflow: auto;
  }
  .right-content {
    overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
  }
  .jumpLink {
    cursor: pointer;
    color: #49b0f9;
  }
  .hasten {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    padding: 5px 10px;
    .el-button {
      height: 36px;
      line-height: 0;
      float: left;
      margin-right: 0px;
      margin-left: 0px;
    }
    .headBut {
      margin-right: 0px;
      margin-left: 10px;
      float: left;
    }
  }

  .pagination {
    float: right;
  }

  .table-info {
    height: calc(100vh - 234px);
    overflow: auto;
  }

  .el-table .userLink {
    cursor: pointer;
    color: #49b0f9;
  }
  .foot-table-users {
    width: 100%;
    height: 40px;
    padding: 5px 10px;
    text-align: center;
  }
}
</style>
