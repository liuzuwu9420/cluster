<template>
  <div v-show="sidepagedata.sidepageShow" class="tableInfo">
    <el-tabs v-model="activeName" :before-leave="beforeLeave">
      <el-tab-pane name="close">
        <span slot="label">
          <i class="el-icon-close" />
        </span>
      </el-tab-pane>
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="container el-scrollbar">
          <el-row class="basic-container">
            <el-col :xs="24" :sm="24" :lg="10">
              <div class="left-head">
                <div class="left-head-name">
                  <span class="HostName">{{ sidepagedata.users.UserName }}</span>
                </div>
              </div>
              <div class="left-body">
                <div class="left-head-title">
                  <i class="el-icon-notebook-1" />
                  <span class="head-title">概览</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">ID:</div>
                  <div class="right-content">{{ sidepagedata.users.UserID }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">UUID:</div>
                  <div class="right-content" @mouseover="over($event)" @mouseout="out($event)" @mousemove="move($event)">{{ sidepagedata.users.UUID }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">创建时间:</div>
                  <div class="right-content">{{ sidepagedata.users.CreatedAt }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">最后修改时间:</div>
                  <div class="right-content">{{ sidepagedata.users.UpdatedAt }}</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="14">
              <div class="right-body">
                <div class="right-head-title">
                  <i class="el-icon-notebook-2" /><span class="head-title">组信息</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">计费组:</div>
                  <el-tooltip class="item" effect="dark" content="跳转计费组" placement="top">
                    <span class="right-content GroupLink" @click="jumpBillGroup(sidepagedata.users.billGroup)">{{ sidepagedata.users.billGroup.GroupName }}</span>
                  </el-tooltip>
                </div>
                <div class="detail-row">
                  <div class="left-title">用户组:</div>
                  <span v-for="(item, index) in sidepagedata.users.userGroup" :key="index" class="right-content-usergroup GroupLink">
                    <el-tooltip class="item" effect="dark" content="跳转用户组" placement="top">
                      <span @click="jumpUserGroup(item)">&nbsp;{{ item.GroupName }}</span>
                    </el-tooltip>
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="作业" name="taskData">
        <div class="container el-scrollbar">
          <div class="hasten">
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

              <el-table-column label="名称">
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
              <el-table-column label="提交时间">
                <template v-slot="{row}">
                  <span>{{ row.SubmitTime }}</span>
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
import { GetTaskList } from '@/api/task'
import { formatDate } from '../../../../utils/format'
import { mouseover, mouseout, mousemove } from '../../../../utils/hover'
// import Tags from '@/components/Tags'
import Pagination from '@/components/Pagination'
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
  name: 'UsersSidepage',
  components: {
    // Tags,
    Pagination,
    Search
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
          users: {
            billGroup: {},
            userGroup: []
          },
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: 'BasicAttribute',
      loading: false,
      tasksData: [],
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
        total: 1
      }
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val, oldVal) {
        if (this.activeName === 'taskData') {
          this.getList()
        }
      },
      deep: true
    }
  },
  methods: {
    beforeLeave(tab) {
      const _this = this
      if (tab === 'close') {
        _this.sidepagedata.sidepageShow = false
        return false
      } else if (tab === 'taskData') {
        _this.getList()
      }
    },
    getList(query) {
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
      queryObj.UserName = _this.sidepagedata.users.UserName
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
            return item
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
      if (data.value === '') {
        _this.getList()
      } else {
        _this.getList(data)
      }
    },
    // 跳转作业
    getJobID(data) {
      const _this = this
      let status = ''
      if (data.JobStatus === 'RUN' || data.JobStatus === 'PEND') {
        status = data.JobStatus
      } else {
        status = 'FINISH'
      }
      _this.$router.push({
        name: 'task.taskList',
        params: {
          select: 'JobID',
          value: data.JobID,
          Status: status
        }
      })
    },

    // 跳转用户组
    jumpUserGroup(data) {
      const _this = this
      _this.$router.push({
        name: 'role.userGroup',
        params: {
          select: 'ID',
          value: data.GroupID
        }
      })
    },

    // 跳转计费组
    jumpBillGroup(data) {
      const _this = this
      _this.$router.push({
        name: 'role.billing',
        params: {
          select: 'UUID',
          value: data.UUID
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
  left: 160px;
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
    width: 110px;
    color: #5e6978;
    float: left;
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
  .right-content-usergroup {
    overflow: auto;
  }
  .GroupLink {
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

  .table-info-choose-uses {
    height: calc(100vh - 294px);
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
