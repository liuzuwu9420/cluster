<template>
  <el-row :gutter="10" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <el-row>
          <el-col :span="9">
            <div class="card-panel-icon-wrapper icon-cpu">
              <div class="card-panel-text">CPU</div>
              <i class="el-icon-cpu card-panel-icon" />
            </div>
          </el-col>
          <el-col :span="15">
            <el-row class="card-panel-description">
              <el-col :span="8">
                <div class="card-iframe">
                  <iframe :src="CPUUseSrc" width="100%" height="100%" frameborder="0"></iframe>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="segmentationCPU">/</div>
              </el-col>
              <el-col :span="10">
                <div class="card-iframe">
                  <iframe :src="CPUAllSrc" width="100%" height="100%" frameborder="0"></iframe>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="nuclear">核</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <el-row>
          <el-col :span="9">
            <div class="card-panel-icon-wrapper icon-coin">
              <div class="card-panel-text">内存</div>
              <i class="el-icon-coin card-panel-icon" />
            </div>
          </el-col>
          <el-col :span="15">
            <el-row class="card-panel-description">
              <el-col :span="11">
                <div class="card-iframe">
                  <iframe :src="RAMUseSrc" width="100%" height="100%" frameborder="0"></iframe>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="segmentationRAM">/</div>
              </el-col>
              <el-col :span="11">
                <div class="card-iframe">
                  <iframe :src="RAMAllSrc" width="100%" height="100%" frameborder="0"></iframe>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('RUN')">
        <div class="card-panel-icon-wrapper icon-loading">
          <div class="card-panel-text">运行作业</div>
          <i class="el-icon-loading card-panel-icon card-task-icon" />
        </div>
        <div class="card-panel-task-description">
          <count-to :start-val="0" :end-val="9280" :duration="1200" class="card-panel-runnum" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('PEND')">
        <div class="card-panel-icon-wrapper icon-time">
          <div class="card-panel-text">等待作业</div>
          <i class="el-icon-time card-panel-icon card-task-icon" />
        </div>
        <div class="card-panel-task-description">
          <count-to :start-val="0" :end-val="13600" :duration="1400" class="card-panel-waitnum" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";
export default {
  components: {
    CountTo
  },
  data() {
    return {
      CPUAllSrc: "",
      CPUUseSrc: "",
      RAMAllSrc: "",
      RAMUseSrc: ""
    };
  },
  created() {
    this.iframeTime();
  },
  methods: {
    handleSetLineChartData(type) {
      this.$router.push({
        name: "monitor.taskList",
        params: {
          status: type
        }
      });
    },
    iframeTime() {
      let _this = this;
      let httpUrl =
        "http://16.16.18.61:3000/d-solo/fafSLghZz/dashboard?orgId=1";
      let timeInterval = "&from=now-30m&to=now";
      let CPUAllId = "&panelId=12";
      let CPUUseId = "&panelId=14";
      let RAMAllId = "&panelId=16";
      let RAMUseId = "&panelId=18";
      _this.CPUAllSrc = httpUrl + timeInterval + CPUAllId;
      _this.CPUUseSrc = httpUrl + timeInterval + CPUUseId;
      _this.RAMAllSrc = httpUrl + timeInterval + RAMAllId;
      _this.RAMUseSrc = httpUrl + timeInterval + RAMUseId;
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 16px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-cpu {
        background: #40c9c6;
      }
      .icon-coin {
        background: #36a3f7;
      }
      .icon-loading {
        background: #f4516c;
      }
      .icon-time {
        background: #34bfa3;
      }
    }
    .icon-cpu {
      color: #40c9c6;
    }
    .icon-coin {
      color: #36a3f7;
    }
    .icon-loading {
      color: #f4516c;
    }
    .icon-time {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin-top: 10px;
      margin-left: 14px;
      padding: 10px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      .card-panel-text {
        text-align: center;
        line-height: 18px;
        font-size: 18px;
      }
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
      margin-top: 4px;
    }
    .card-task-icon {
      margin-left: 10px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin-left: 0px;
      .segmentationCPU {
        font-size: 35px;
        color: #40c9c6;
        margin-top: 55px;
      }
      .segmentationRAM {
        font-size: 40px;
        color: #36a3f7;
        margin-top: 50px;
      }
      .nuclear {
        margin-top: 68px;
        font-size: 16px;
        color: #40c9c6;
      }
    }
    .card-panel-task-description {
      width: 54%;
      text-align: center;
      margin-top: 50px;
      float: right;
      font-weight: bold;
      .card-panel-runnum {
        font-size: 36px;
        color: #f4516c;
      }
      .card-panel-waitnum {
        font-size: 36px;
        color: #34bfa3;
      }
    }
  }
}
@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>