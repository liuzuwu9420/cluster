<template>
  <div class="app-container">
    <el-container>
      <el-form :inline="true">
        <div class="filter">
          <div class="filterTop">
            <span class="left">查询条件</span>
            <span class="right">
              <el-button type="primary" @click="getList()">查询</el-button>
              <el-button @click="clearAll">重置</el-button>
            </span>
          </div>

          <div class="row">
            <label>状态</label>
            <el-select v-model="Status" clearable placeholder="请选择">
              <el-option
                v-for="item in StatusArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <label>等级</label>
            <el-select v-model="level" clearable placeholder="请选择">
              <el-option
                v-for="item in levelArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="row">
            <label>选择日期</label>
            <el-date-picker
              v-model="dateTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              value-format="yyyy-MM-dd,HH-mm-ss"
            ></el-date-picker>
          </div>
        </div>
      </el-form>
      <el-main>
        <div class="hasten">
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
              <el-tag size="mini" :type="gradeMap[row.grade].type">
                {{row.grade | grade}}
              </el-tag>
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
								<el-button v-if="row.edit" type="warning" size="mini" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">确定</el-button>
								<!-- 编辑模式：取消 -->
								<el-button v-if="row.edit" type="success" size="mini" icon="el-icon-circle-check-outline" @click="cancelEdit(row)">取消</el-button>

								<!-- 查看详情 -->
								<el-tooltip class="item" effect="dark" content="查看" placement="top-end">
									<el-button v-if="!row.edit" type="success" icon="el-icon-view" size="mini" @click="info(row)"></el-button>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
									<el-button v-if="!row.edit" type="warning" size="mini" icon="el-icon-edit" @click="row.edit=!row.edit"></el-button>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" content="删除" placement="top-end">
									<el-button v-if="!row.edit" type="danger" size="mini" icon="el-icon-delete" @click="deleteItem(row)"></el-button>
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
    Pagination
  },
  filters: {
    status(type) {
      return gradeMap[type].name;
    }
  },
  data() {
    return {
      gradeMap: gradeMap,
      //查询条件
      Status: "",
      StatusArr: [
        {
          value: "INFO",
          label: "未确认"
        },
        {
          value: "WARNING",
          label: "确认"
        }
      ],
      level: "",
      levelArr: [
        {
          value: "INFO",
          label: "严重"
        },
        {
          value: "WARNING",
          label: "警告"
        },
        {
          value: "DANGER",
          label: "致命"
        }
      ],
      dateTime: "",
      pickerOptions: {
          shortcuts: [{
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 5,
        total: 1
      },
      devices: [],
      loading: false
    };
  },
  created() {
    //this.getList();
  },
  methods: {
    getList() {
      let _this = this;
      let params = {
        
      };
      GetAlarmList(params)
        .then(body => {
          
        })
        .catch(res => {
          console.log(res);
        });
    },

    //重置按钮
    clearAll() {
      //状态
      this.Status = "";
      //级别
      this.level = "";
      //时间
      this.dateTime = "";
    },

    // 查看设备详情
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
				_this.$confirm('此操作将删除该报警, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						_id: row._id
					};
					DeleteAlarm(params).then(res => {
						_this.getList();
						_this.$message({
							type: 'success',
							message: '删除成功!'
						});
					}).catch((res) => {
						_this.$message({
							type: 'error',
							message: '删除失败'
						});
					});;
				}).catch(() => {
					_this.$message({
						type: 'info',
						message: '已取消删除'
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
				if(row.name !== '') {
					params.newOption.remark = row.remark
				};

				await ChangeAlarm(params);
				row.original.remark = row.remark;
				row.edit = false;
			}
  }
};
</script>

<style scoped>
.filter {
  border: 1px solid #e8e8e8;
  height: 170px;
}

.filterTop {
  width: 100%;
  height: 40px;
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  line-height: 40px;
}

.filterTop .left {
  display: inline-block;
  width: 49%;
  text-align: left;
  margin-left: 1%;
  color: #747474;
  font-size: 14px;
}

.filterTop .right {
  display: inline-block;
  width: 45%;
  text-align: right;
}

.filterTop .right .el-button {
  width: 82px;
  height: 28px;
  padding: 0 0;
}

.filter .row {
  margin-top: 20px;
}
.filter .row .el-date-editor--datetimerange {
  width: 78%;
}

.filter .row label {
  display: inline-block;
  width: 15%;
  text-align: right;
  margin-right: 2%;
  font-weight: 400;
}

.filter .row .el-input {
  width: 30%;
  height: 28px;
}

.filter .row .el-input__icon {
  line-height: 1 !important;
}

.filter .row .el-select {
  width: 30%;
  height: 28px;
}

.filter .row .el-autocomplete {
  width: 30%;
  height: 28px;
}

.filter .row .el-input__inner {
  height: 100%;
}

.filter .row .el-select .el-input--suffix {
  width: 100% !important;
}

.hasten {
  width: 100%;
  background-color: #fafafa;
  height: 40px;
  border: 1px solid #e8e8e8;
  margin-top: 20px;
  margin-bottom: 10px;
  line-height: 40px;
  padding: 5px 10px;
}

.hasten .el-button {
  margin-left: 2%;
  height: 28px;
  line-height: 0;
  float: right;
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