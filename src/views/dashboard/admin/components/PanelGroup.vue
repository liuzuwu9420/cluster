<template>
  <el-row :gutter="10" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <el-card shadow="hover" class="mgb20">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <iframe :src="CPUSrc" width="100%" height="100%" frameborder="0"></iframe>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="card-panel card-panel-foot" @click="handleSetLineChartData('shoppings')">
          <iframe :src="nodeSrc" width="100%" height="100%" frameborder="0"></iframe>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="12">
      <el-row>
        <el-col :xs="12" :sm="12" :lg="12" class="RAM-padding">
          <el-card shadow="hover" class="mgb20">
            <div class="card-panel" @click="handleSetLineChartData('messages')">
              <iframe :src="RAMSrc" width="100%" height="100%" frameborder="0"></iframe>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12" class="sto-padding">
          <el-card shadow="hover" class="mgb20">
            <div class="card-panel" @click="handleSetLineChartData('purchases')">
              <iframe :src="storageSrc" width="100%" height="100%" frameborder="0"></iframe>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="hover">
        <div class="card-panel card-panel-foot">
          <iframe :src="netSrc" width="100%" height="100%" frameborder="0"></iframe>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="6">
      <div class="logContainer">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="el-icon-bell"></i>
            <span>消息：</span>
          </div>
          <div class="logArea el-scrollbar">
            <div
              class="item"
              v-for="(item,index) in logsData"
              :key="index"
              @click="handleSetLineChartData(item.level.value)"
            >
              <p class="timeArea">
                <span>{{item.citem}}</span>
              </p>
              <div class="logContent">
                <span class="title time">{{item.createTime}}</span>
              </div>
              <el-divider></el-divider>
            </div>
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      CPUSrc: "",
      RAMSrc: "",
      storageSrc: "",
      nodeSrc: "",
      nodeSrc: "",
      logsData: [
        {
          citem: "xxxxxx",
          level: {
            value: "INFO",
            label: "严重"
          },
          createTime: "2019-10-01"
        },
        {
          citem: "xxxxxx",
          level: {
            value: "WARNING",
            label: "警告"
          },
          createTime: "2019-10-01"
        },
        {
          citem: "xxxxxx",
          level: {
            value: "DANGER",
            label: "致命"
          },
          createTime: "2019-10-01"
        },
        {
          citem: "xxxxxx",
          level: {
            value: "INFO",
            label: "严重"
          },
          createTime: "2019-10-01"
        },
        {
          citem: "xxxxxx",
          level: {
            value: "DANGER",
            label: "致命"
          },
          createTime: "2019-10-01"
        },
        {
          citem: "xxxxxx",
          level: {
            value: "INFO",
            label: "严重"
          },
          createTime: "2019-10-01"
        },
        {
          citem: "xxxxxx",
          createTime: "2019-10-01"
        },
        {
          citem: "xx1xxx",
          createTime: "2019-10-01"
        },
        {
          citem: "xxx3xxx",
          createTime: "2019-10-01"
        },
        {
          citem: "xxx23xxx",
          createTime: "2019-10-01"
        },
        {
          citem: "xxx22xxx",
          createTime: "2019-10-01"
        },
        {
          citem: "xx12xxxx",
          createTime: "2019-10-01"
        },
        {
          citem: "xxx23xxx",
          createTime: "2019-10-01"
        },
        {
          citem: "xxxxxx",
          createTime: "2019-10-01"
        },
        {
          citem: "1xxxxxx",
          createTime: "2019-10-01"
        },
        {
          citem: "2xxxxxx",
          createTime: "2019-10-01"
        },
        {
          citem: "3xxxxxx",
          createTime: "2019-10-01"
        },
        {
          citem: "4xxxxxx",
          createTime: "2019-10-01"
        },
        {
          citem: "5xxxxxx",
          createTime: "2019-10-01"
        }
      ]
    };
  },
  created() {
    this.iframeTime();
  },
  methods: {
    handleSetLineChartData(level) {
      this.$router.push({
        name: "monitor.alarmList",
        params: {
          level: level
        }
      });
    },
    iframeTime() {
      let _this = this;
      let httpUrl =
        "http://16.16.18.61:3000/d-solo/fafSLghZz/dashboard?orgId=1";
      let timeInterval = "&from=now-30m&to=now";
      let CPUId = "&panelId=2";
      let RAMId = "&panelId=6";
      let storageId = "&panelId=4";
      let nodeId = "&panelId=10";
      let netId = "&panelId=8";
      _this.netSrc = httpUrl + timeInterval + netId;
      _this.CPUSrc = httpUrl + timeInterval + CPUId;
      _this.RAMSrc = httpUrl + timeInterval + RAMId;
      _this.storageSrc = httpUrl + timeInterval + storageId;
      _this.nodeSrc = httpUrl + timeInterval + nodeId;
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-group {
  .mgb20 {
    margin-bottom: 10px;
  }
  .RAM-padding {
    padding-right: 5px;
  }
  .sto-padding {
    padding-left: 5px;
  }
  .card-panel {
    height: 300px;
    cursor: pointer;
    font-size: 16px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
  }
  .card-panel-foot {
    height: 405px;
  }
  .logContainer {
    padding: 10px;
    background: #fff;
    box-sizing: border-box;
    height: 715px;
    max-height: 715px;
    overflow: hidden;
    border-radius: 6px;
    .box-card {
      height: 100%;
    }
    .logArea {
      overflow: auto;
      height: 100%;
      padding: 10px 20px;
    }
    .item {
			cursor: pointer;
      .timeArea {
        margin: 2px;
      }
      .logContent {
        margin-bottom: 5px;
        text-align: right;
      }
      .title {
        font-size: 13px;
      }
      .time {
        color: #87de75;
      }
    }
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
}
</style>