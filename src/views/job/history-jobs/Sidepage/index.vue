<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="pane-part">
          <el-col>
            <div class="left-head">
              <div class="left-head-name">
                <span class="headName">{{ sidepagedata.list.job_id }}</span>
              </div>
            </div>
            <div class="left-body">
              <div class="left-head-title">
                <i class="el-icon-notebook-1" />
                <span class="head-title">概览</span>
              </div>
              <div class="detail-row">
                <div class="left-title">用户名:</div>
                <span class="headName">{{ sidepagedata.list.user_name }}</span>
              </div>
              <div class="detail-row">
                <div class="left-title">队列名:</div>
                <span class="headName">{{ sidepagedata.list.queue_name }}</span>

              </div>
              <div class="detail-row">
                <div class="left-title">运行节点:</div>
                <div class="right-content">
                  <span>{{ `${sidepagedata.list.exec_hosts[0].num_slots}*${sidepagedata.list.exec_hosts[0].host_name}` }}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="left-title">作业提交主机:</div>
                <div class="right-content">{{ sidepagedata.list.submission_host_name }}</div>
              </div>
              <div class="detail-row">
                <div class="left-title">作业提交时间:</div>
                <div class="right-content">{{ sidepagedata.list.submit_time }}</div>
              </div>
              <div class="detail-row">
                <div class="left-title">作业结束时间:</div>
                <div class="right-content">{{ sidepagedata.list.end_time }}</div>
              </div>
              <div class="detail-row">
                <div class="left-title">作业耗时:</div>
                <div class="right-content">{{ sidepagedata.list.total_time }}</div>
              </div>
              <div class="detail-row">
                <div class="left-title">费用:</div>
                <div class="right-content">{{ sidepagedata.list.cost }}</div>
              </div>
              <div class="detail-row">
                <div class="left-title">指令:</div>
                <div class="right-content">{{ sidepagedata.list.command }}</div>
              </div>
            </div>
          </el-col>
        </div>
      </el-tab-pane>
    </el-tabs>
  </table-sidepage>
</template>
<script>
import TableSidepage from '@/components/TableSidepage'

export default {
  name: 'HistorySidepage',
  components: {
    TableSidepage
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          list: {},
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      activeName: 'BasicAttribute',
      loading: false
    }
  },
  methods: {
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
