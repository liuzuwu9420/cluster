<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="pane-part">
          <div class="left-head">
            <div class="left-head-name">
              <span class="headName">{{ sidepagedata.list.QUEUE_NAME }}</span>
            </div>
          </div>
          <div class="left-body">
            <div class="left-head-title">
              <i class="el-icon-notebook-1" />
              <span class="head-title">概览</span>
            </div>
            <div v-for="(item,index) in showList" :key="index" class="detail-row">
              <div class="left-title">{{ item.label }}</div>
              <span class="right-content">{{ sidepagedata.list[item.prop]|isEmpty }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </table-sidepage>
</template>
<script>
import TableSidepage from '@/components/TableSidepage'

export default {
  name: 'QueueConfigSidepage',
  components: {
    TableSidepage
  },
  filters: {
    isEmpty(val) {
      if (val === true) { return '启用' } else if (val === false) { return '未启用' } else { return val || '-' }
    }
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
      showList: [
        { prop: 'PRIORITY', label: '优先值' },
        { prop: 'INTERACTIVE', label: '交互式' },
        { prop: 'ENABLED', label: '启用' },
        { prop: 'HOSTS', label: '主机/主机组' },
        { prop: 'USERS', label: '用户/用户组' },
        { prop: 'QJOB_LIMIT', label: '队列最大作业数' },
        { prop: 'UJOB_LIMIT', label: '队列用户最大作业数' },
        { prop: 'CPULIMIT', label: '队列最大运行时间' },
        { prop: 'DESCRIPTION', label: '描述' }
      ]
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
  .head{
    padding: 0 10px;
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
    font-size: 14px;
    line-height: 24px;
    margin-right: 60px;
    display: flex;
  }
  .left-title {
    width: 30%;
    color: #5e6978;
    margin-right: 5px;
    overflow: hidden;
		// text-overflow: ellipsis;
		// white-space: nowrap;
  }
  .left-content {
    color: #1a2736;
    overflow: auto;
  }
  .right-content {
    width: 70%;
  }
  .jumpLink {
    cursor: pointer;
    color: #49b0f9;
  }
</style>
