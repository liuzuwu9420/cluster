<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <div class="headBut selectDate">
            <el-date-picker
              v-model="dateTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              value-format="yyyy-MM-dd,HH-mm-ss"
            ></el-date-picker>
          </div>
          <search :items="selected.items" @change="searchChanged" />
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right"></i> 刷新
          </el-button>
        </div>
        <el-table
          v-loading="loading"
          element-loading-text="loading"
          :data="devices"
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="ID" width="120">
            <template v-slot="{row}">
              <span>{{ row.ID }}</span>
            </template>
          </el-table-column>

          <el-table-column label="名称" show-overflow-tooltip>
            <template v-slot="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="等级" width="110">
            <template v-slot="{row}">
              <el-tag size="mini" :type="gradeMap[row.grade].type">{{row.grade | grade}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="110">
            <template v-slot="{row}">
              <span>{{ row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column label="时间" width="140">
            <template v-slot="{row}">
              <span>{{ row.time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="节点" width="110">
            <template v-slot="{row}">
              <span>{{ row.node }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="140">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.remark" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template v-slot="{row}">
              <el-button-group>
                <!-- 编辑模式：确定 -->
                <el-button
                  v-if="row.edit"
                  type="warning"
                  size="mini"
                  icon="el-icon-circle-check-outline"
                  @click="confirmEdit(row)"
                >确定</el-button>
                <!-- 编辑模式：取消 -->
                <el-button
                  v-if="row.edit"
                  type="success"
                  size="mini"
                  icon="el-icon-circle-check-outline"
                  @click="cancelEdit(row)"
                >取消</el-button>

                <!-- 查看详情 -->
                <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                  <el-button
                    v-if="!row.edit"
                    type="success"
                    icon="el-icon-view"
                    size="mini"
                    @click="info(row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                  <el-button
                    v-if="!row.edit"
                    type="warning"
                    size="mini"
                    icon="el-icon-edit"
                    @click="row.edit=!row.edit"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                  <el-button
                    v-if="!row.edit"
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteItem(row)"
                  ></el-button>
                </el-tooltip>
              </el-button-group>
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
  </div>
</template>

<script>
import { GetAlarmList, DeleteAlarm, ChangeAlarm } from "@/api/monitor";

import Pagination from "@/components/Pagination";
import Search from "@/components/Search";

const gradeMap = {
  INFO: {
    name: "严重",
    type: "info"
  },
  WARNING: {
    name: "警告",
    type: "warning"
  },
  DANGER: {
    name: "致命",
    type: "danger"
  }
};
export default {
  components: {
    Pagination,
    Search
  },
  filters: {
    status(type) {
      return gradeMap[type].name;
    }
  },
  data() {
    return {
      gradeMap: gradeMap,
      // 查询数据
      selected: {
        items: [
          {
            value: "名称",
            label: "名称"
          },
          {
            value: "UUID",
            label: "UUID"
          }
        ]
      },
      dateTime: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 5,
        total: 0
      },
      devices: [],
      loading: false
    };
  },
  created() {
    //this.getList();
    if (this.$route.params.level) {
      this.level = this.$route.params.level;
    }
  },
  methods: {
    getList() {
      let _this = this;
      let params = {};
      GetAlarmList(params)
        .then(body => {})
        .catch(res => {
          console.log(res);
        });
    },

    //搜索
    searchChanged(data) {
      console.log(data);
    },

    // 查看详情
    info(device) {
      /* this.$router.push({
					name: "device.info",
					params: {
						device: device
					}
				}); */
    },

    // 删除
    async deleteItem(row) {
      let _this = this;
      _this
        .$confirm("此操作将删除该报警, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            _id: row._id
          };
          DeleteAlarm(params)
            .then(res => {
              _this.getList();
              _this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(res => {
              _this.$message({
                type: "error",
                message: "删除失败"
              });
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 取消编辑
    cancelEdit(row) {
      row.edit = false;
      // 还原数据
      row.remark = row.original.remark;
    },

    // 确认编辑
    async confirmEdit(row) {
      let params = {
        oldOption: {
          _id: row._id
        },
        newOption: {}
      };
      if (row.name !== "") {
        params.newOption.remark = row.remark;
      }

      await ChangeAlarm(params);
      row.original.remark = row.remark;
      row.edit = false;
    }
  }
};
</script>

<style scoped>
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
}

.hasten .headBut {
  margin-right: 10px;
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
  width: 50%;
}
</style>