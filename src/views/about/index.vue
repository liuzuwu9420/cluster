<template>
  <div
    class="wrapper content"
    style="position: relative; height: 100%; padding-top: 60px; min-width: 600px;"
  >
    <div class="body">
      <div class="container">
        <div class="curr-node">
          <div class="buttons">
            <span
              class="button"
              style="margin-right: 30px; color: rgb(60, 115, 185);"
              @click="up"
            >上传许可证</span>
          </div>
          <div class="basic" style="border-radius: 6px;">
            <div class="basic_license_info">
              <div class="basic_license_left">
                <div
                  class="basic_license_icon enterprise"
                  style="width: 141px; height: 115px; margin: 0px auto;
     font-size: 165px;"
                >
                  <svg-icon icon-class="certification" />
                </div>
                <div class="basic_license_title">
                  <h4 class="basic_license_name">
                    企业版
                    <span class="basic_license_status valid">有效</span>
                  </h4>
                </div>
                <div class="basic_license_details"><div class="basic_license_detail"><span class="basic_license_detail-num">
                  {{ lsf.authorization }}
                </span> <span class="basic_license_detail-title">授权物理机数量</span></div><div class="basic_license_detail"><span class="basic_license_detail-num">
                  {{ lsf.used }}
                </span> <span class="basic_license_detail-title">已用物理机数量</span></div> <div class="basic_license_detail"><span class="basic_license_detail-num">1.0.0</span> <span class="basic_license_detail-title">版本</span></div></div>
              </div>
            </div>
            <div class="basic_license_introduction">
              <div class="license_intro_item">
                <i class="el-icon-check check_icon" />
                <span class="license_intro_item-text">可使用ClusterMom的全部功能</span>
              </div>
              <div class="license_intro_item">
                <i class="el-icon-check check_icon" />
                <span class="license_intro_item-text">付费授权使用</span>
              </div>
              <div class="license_intro_item">
                <i class="el-icon-check check_icon" />
                <span class="license_intro_item-text">在许可证授权期限内使用</span>
              </div>
              <div class="license_intro_item">
                <i class="el-icon-check check_icon" />
                <span class="license_intro_item-text">可管理的计算节点数量按购买的物理机数量</span>
              </div>
              <div class="license_intro_item">
                <i class="el-icon-check check_icon" />
                <span class="license_intro_item-text">在售后服务期内可获得官方售后技术支持服务</span>
              </div>
              <div class="license_intro_item">
                <i class="el-icon-check check_icon" />
                <span class="license_intro_item-text">该版本适于企业部署生产环境的集群</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span class="about-buttom">
        <p class="about-buttom-warn">
          ClusterMom ©
          南京信易达计算技术有限公司
          保留所有权利。
        </p>
      </span>
    </div>
    <el-dialog :title="titleHead" :visible.sync="dialogFormVisible" width="600px">
      <el-upload class="upload-demo" drag action multiple>
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetPrometheus } from '@/api/prometheus'
export default {
  data() {
    return {
      lsf: {
        authorization: 1400,
        used: 0
      },
      titleHead: '',
      dialogFormVisible: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const _this = this
      const paramsNodeTotal = { query: 'cluster:node:sum' }
      const NodeTotal = await _this.getPrometheus(paramsNodeTotal)
      _this.lsf.used = +NodeTotal
    },
    getPrometheus(params) {
      return new Promise((resolve) => {
        GetPrometheus(params)
          .then(res => {
            if (res.data.result.length !== 0) {
              const value = res.data.result[0].value[1]
              resolve(value)
            } else {
              resolve(0)
            }
          })
          .catch(res => {
            console.log(res)
          })
      })
    },
    up() {
      this.titleHead = '上传许可证'
      this.dialogFormVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: #f0f4f9;
  background-image: url(../../assets/about_images/timg.jpg);
  .body {
    width: 100%;
    height: 100%;
    min-width: 600px;
    font-size: 14px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .container {
    position: relative;
    margin: 0 auto;
    .buttons {
      position: absolute;
      z-index: 1;
      top: 40px;
      right: 40px;
      width: 200px;
      height: 24px;
      color: #5e6978;
      text-align: right;
      vertical-align: middle;
      line-height: 24px;
      .button {
        cursor: pointer;
        vertical-align: middle;
      }
    }
    .basic {
      position: relative;
      background: hsla(0, 0%, 100%, 0.95);
      border-radius: 6px;
      box-shadow: 0 1px 10px rgba(224, 228, 233, 0.6);
      padding: 60px 6% 40px;
      .basic_license_info {
        position: relative;
        height: 300px;
        width: 100%;
        border-bottom: 1px solid #dae0e6;
        padding: 0 24px 50px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: distribute;
        justify-content: space-around;
        .basic_license_left {
          height: 240px;
        }
        .basic_license_title {
          position: relative;
          width: 100%;
          height: 30px;
          margin: 12px 0 44px;
          .basic_license_name {
            text-align: center;
            font-size: 24px;
            line-height: 30px;
            font-weight: 500;
            transform: translateX(35px);
          }
          .basic_license_status {
            position: relative;
            bottom: 3px;
            display: inline-block;
            border-radius: 100px;
            height: 24px;
            line-height: 22px;
            width: 50px;
            font-size: 14px;
            text-align: center;
            margin-left: 20px;
          }
          .valid {
            color: #45bb79;
            border: 1px solid #45bb79;
          }
        }
        .basic_license_details {
          width: 100%;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-pack: justify;
          justify-content: space-between;
          .basic_license_detail {
            width: 120px;
            height: 60px;
            margin: 0 auto;
          }
          .basic_license_detail-num {
            display: inline-block;
            width: 120px;
            font-size: 20px;
            color: #1a2736;
            text-align: center;
            line-height: 30px;
          }
          .basic_license_detail-title {
            display: inline-block;
            width: 120px;
            font-size: 12px;
            color: #5e6978;
            text-align: center;
            line-height: 20px;
          }
        }
      }
      .basic_license_introduction {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin-top: 40px;
        .license_intro_item {
          width: 360px;
          height: 24px;
          color: #5e6978;
          line-height: 24px;
          margin-bottom: 24px;
        }
        .check_icon {
          display: inline-block;
          margin-right: 16px;
          width: 24px;
          height: 24px;
          text-align: center;
          vertical-align: middle;
        }
      }
    }
  }
  .about-buttom-warn {
    font-size: 12px;
    color: #5e6978;
    text-align: center;
    margin-bottom: 28px;
  }
  .el-dialog .upload-demo {
    text-align: center;
  }
}
@media screen and (max-width: 1505px) {
  .wrapper .container {
    min-width: 600px;
    margin: 0 40px;
  }
  .basic_license_left {
    width: 370px;
  }
}
@media screen and (min-width: 1505px) {
  .wrapper .container {
    max-width: 1425px;
  }
  .basic_license_left {
    width: 370px;
  }
}
</style>
