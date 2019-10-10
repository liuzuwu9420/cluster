<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤1" description="配置生成规则"></el-step>
      <el-step title="步骤2" description="补充数据"></el-step>
      <el-step title="步骤3" description="提交数据"></el-step>
    </el-steps>

    <el-container v-if="active == 0">
      <el-main>
        <el-form
          ref="form"
          :model="spec"
          label-width="80px"
          label-position="top"
          style="width:500px"
        >
          <el-form-item label="批次">
            <el-input v-model="spec.batch" />
          </el-form-item>

          <!-- <el-form-item v-if="false" label="类目">
            <el-select v-model="spec.type" placeholder="请选择" style="width:500px">
              <el-option v-for="(val,key) in device_types" :key="key" :label="val" :value="key">
                <span>{{ val }}</span>
              </el-option>
            </el-select>
          </el-form-item>-->

          <el-form-item label="产品">
            <el-select v-model="spec.product" placeholder="请选择" style="width:500px">
              <el-option
                v-for="product in products"
                :key="product.productName"
                :label="product.productName"
                :value="product.value"
                :disabled="product.disabled"
              >
                <span>
                  <strong>类型：</strong>
                  {{ product.nodeType==0?"设备":"网关" }}
                </span>
                <span style="margin-left:20px">
                  <strong>名称：</strong>
                  {{ product.productName }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="数量">
            <el-slider v-model="spec.total" show-input :step="10" :min="10" :max="100"></el-slider>
          </el-form-item>

          <el-form-item>
            <el-button style="margin-top: 12px;float: left" @click="next" :loading="loading">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>

    <el-container v-if="active == 1">
      <el-main>
        <span>
          <strong>批次：</strong>
          {{spec.batch}}
        </span>
        <span>
          <strong>产品：</strong>
          {{spec.product}}
        </span>
        <el-divider></el-divider>
        <el-table :data="devices" border fit highlight-current-row>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="备注名">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.nickName" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.nickName }}</span>
            </template>
          </el-table-column>

          <!-- 写卡终端需要填写 物业代码 -->
          <el-table-column label="物业代码">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.propertyCode" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.propertyCode }}</span>
            </template>
          </el-table-column>

          <el-table-column label="安装电梯">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.lift" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.lift }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标签">
            <template v-slot="{row}">
              <!-- 编辑模式 -->
              <template v-if="row.edit">
                <tags :tags="row.tags" size="mini" />
              </template>
              <!-- 查看模式 -->
              <template v-else>
                <el-tag size="mini" :key="tag" v-for="tag in row.tags">{{tag}}</el-tag>
              </template>
            </template>
          </el-table-column>
          <!-- 
          <el-table-column label="密钥" prop="secret"></el-table-column>
          <el-table-column label="二维码">
            <template v-slot="{row}">
              <el-image :src="row.qrcode" style="width: 80px; height: 80px"></el-image>
            </template>
          </el-table-column>
          -->
          <el-table-column fixed="right" label="操作">
            <template v-slot="{row}">
              <el-button
                v-if="row.edit"
                type="success"
                size="small"
                icon="el-icon-circle-check-outline"
                :loading="loading"
                @click="confirmEdit(row)"
              >确定</el-button>
              <el-button
                v-if="row.edit"
                type="success"
                size="small"
                icon="el-icon-circle-check-outline"
                :loading="loading"
                @click="cancelEdit(row)"
              >取消</el-button>

              <el-button
                v-if="!row.edit"
                type="warning"
                size="small"
                icon="el-icon-edit"
                @click="row.edit=!row.edit"
                :loading="loading"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button style="margin-top: 12px;float: left" @click="onSubmit" :loading="loading">下一步</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getProductList } from "@/api/product";
import { batchRegisterDevice } from "@/api/device";

import moment from "moment";
//import QRCode from "qrcode";

import Pagination from "@/components/Pagination";
import Tags from "@/components/Tags";
// 生成二维码
/*const GenerateQR = async text => {
  try {
    const qrcode = await QRCode.toDataURL(text);
    console.log(qrcode);
    return qrcode;
  } catch (err) {
    console.error(err);
  }
};*/

export default {
  components: { Pagination, Tags },
  data() {
    return {
      loading: false,
      // 设备分类
      device_types: {
        "0": "刷卡设备",
        "1": "网关设备",
        "2": "写卡终端"
      },
      active: 0,
      tagInputVisible: false,
      tagInputValue: "",
      // 生成规则
      spec: {
        // 批次
        batch: moment().format("YYYYMMDDHHmmSS"),
        type: "",
        // 所属产品
        product: "",
        // 时间戳
        timestamp: moment().format("YYYYMMDDHHmmSS"),
        // 数量
        total: 10
      },
      products: [],
      devices: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 下一步
    async next() {
      if (this.active++ > 2) this.active = 0;
      // 生成设备列表
      await this.genDeviceList();
    },

    // 确定提交
    async onSubmit() {
      let product = this.spec.product.split("-");
      const data = {
        batchNo: this.spec.batch,
        // type: this.spec.type,
        productName: product[0],
        productKey: product[1],
        nodeType: product[2],
        deviceInfo: []
      };
      for (let index = 0; index < this.devices.length; index++) {
        const element = this.devices[index];
        data.deviceInfo.push({
          name: element.name,
          nickName: element.nickName,
          lift: element.lift,
          // qrcode: element.qrcode,
          // secret: element.secret,
          tags: element.tags.join("|"),
          propertyCode: element.propertyCode ? element.propertyCode : ""
        });
      }
      this.loading = true;
      batchRegisterDevice(data).then(response => {
        this.loading = false;
        this.$notify.success({
          title: "成功",
          message: "添加成功"
        });
      });
    },

    onCancel() {
      this.goBack();
    },

    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },

    // 获取产品列表
    async fetchData() {
      this.products = await getProductList();
      for (let index = 0; index < this.products.length; index++) {
        const element = this.products[index];
        //                      产品名-产品Key-节点类型
        element.value = `${element.productName}-${element.productKey}-${element.nodeType}`;
        this.products[index] = element;
      }
    },

    // 生成随机密码
    getRandomCode(length) {
      if (length > 0) {
        var data = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z"
        ];
        var nums = "";
        for (var i = 0; i < length; i++) {
          var r = parseInt(Math.random() * 61);
          nums += data[r];
        }
        return nums;
      } else {
        return false;
      }
    },

    // 生成 设备列表
    async genDeviceList() {
      let product = this.spec.product.split("-");
      let productName = product[0];
      let productKey = product[1];
      for (let index = 0; index < this.spec.total; index++) {
        const device = {
          batch: this.spec.batch,
          //   产品名_时间戳_序列
          //   由于设备名不能带中文 所有不能使用productName参与设备名，此处选择使用productKey
          name: `${productKey}_${this.spec.timestamp}_${index}`,
          // secret: this.getRandomCode(32),
          // qrcode: "",
          nickName: "",
          lift: "",
          tags: [],
          original: {},
          edit: false
        };
        // 生成二维码
        // const qrcode = await GenerateQR(
        //   JSON.stringify({
        //     secret: device.secret,
        //     product_name: `${this.spec.product}`,
        //     device_name: device.name
        //   })
        // );
        // device.qrcode = qrcode;
        // 保存一份原始数据，便于取消编辑的时候还原数据
        device.original.nickName = device.nickName;
        device.original.lift = device.lift;
        device.original.tags = device.tags;
        // 写卡设备 物业代码
        device.original.propertyCode = device.propertyCode = "";

        this.devices.push(device);
      }
    },
    // 取消编辑
    cancelEdit(row) {
      row.edit = false;
      // 还原数据
      row.nickName = row.original.nickName;
      row.tags = row.original.tags;
      row.lift = row.original.lift;
      // 写卡设备 物业代码
      row.propertyCode = row.original.propertyCode;
    },
    // 确认编辑
    async confirmEdit(row) {
      row.edit = false;
      row.original.nickName = row.nickName;
      row.original.tags = row.tags;
      row.original.lift = row.lift;
      // 写卡设备 物业代码
      row.original.propertyCode = row.propertyCode;
    }
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
