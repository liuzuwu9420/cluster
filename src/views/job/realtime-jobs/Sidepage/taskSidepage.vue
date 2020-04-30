<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="pane-part">
          <div class="left-head">
            <div class="left-head-name">
              <span class="headName">{{ sidepagedata.list.JOBID }}</span>
            </div>
          </div>
          <div class="left-body">
            <div class="left-head-title">
              <i class="el-icon-notebook-1" />
              <span class="head-title">概览</span>
            </div>
            <div class="detail-row">
              <div class="left-title">ID:</div>
              <span class="right-content">{{ sidepagedata.list.JOBID }}</span>
            </div>
            <div class="detail-row">
              <div class="left-title">用户名:</div>
              <el-tooltip class="item" effect="dark" content="跳转用户" placement="top-start">
                <div class="right-content jumpLink" @click="jumpUser(sidepagedata.list.USER)">{{ sidepagedata.list.USER }}</div>
              </el-tooltip>
            </div>
            <div class="detail-row">
              <div class="left-title">队列名:</div>
              <el-tooltip class="item" effect="dark" content="跳转队列" placement="top-start">
                <div class="right-content jumpLink" @click="jumpQueue(sidepagedata.list.QUEUE)">{{ sidepagedata.list.QUEUE }}</div>
              </el-tooltip>
            </div>
            <div class="detail-row">
              <div class="left-title">运行节点:</div>
              <div class="right-content">
                <span>{{ sidepagedata.list.EXEC_HOST }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="left-title">作业提交主机:</div>
              <div class="right-content">{{ sidepagedata.list.FROM_HOST }}</div>
            </div>
            <div class="detail-row">
              <div class="left-title">作业提交时间:</div>
              <div class="right-content">{{ sidepagedata.list.SUBMIT_TIME }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </table-sidepage>
</template>
<script>
import { mouseover, mouseout, mousemove } from '@/utils/hover'

import TableSidepage from '@/components/TableSidepage'

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
  name: 'TaskSidepage',
  components: {
    TableSidepage
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
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: 'BasicAttribute',
      loading: false
    }
  },
  methods: {
    // 跳转队列
    jumpQueue(data) {
      const _this = this
      _this.$router.push({
        name: 'Job of queue',
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
        name: 'Job of user',
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
  .pane-part {
    padding: 0 10px;
    flex-grow:1;
    display: flex;
    flex-flow: column;
  }
  .left-head {
    margin-top: 20px;
    line-height: 20px;
    font-size: 0;
    color: #1a2736;
    .headName {
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
</style>
