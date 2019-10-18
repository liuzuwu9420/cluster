<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="hasten">
          <el-button class="headBut" type="primary" size="mini" @click="saveEntity">
            <i class="el-icon-plus"></i> 创建用户
          </el-button>
          <search :items="selected.items" @change="searchChanged" />
          <el-button type="primary" size="mini" @click="getList">
            <i class="el-icon-refresh-right"></i> 刷新
          </el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="devices"
          element-loading-text="Loading"
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="ID" width="120">
            <template v-slot="{row}">
              <span>{{ row.uid }}</span>
            </template>
          </el-table-column>

          <el-table-column label="用户">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.username" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色" width="110">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.role" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.role }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="用户组">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.group" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.group }}</span>
            </template>
          </el-table-column>-->
          <!-- <el-table-column label="登录时间" width="110">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.logTime" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.logTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="解冻时间" width="110">
            <template v-slot="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.thawingTime" class="edit-input" size="small" />
              </template>
              <span v-else>{{ row.thawingTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="冻结状态">
            <template v-slot="{row}">
              <el-switch v-model="row.type" active-color="#13ce66"></el-switch>
            </template>
          </el-table-column>-->
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
        <el-dialog :title="titleHead" :visible.sync="dialogCreating" width="50%">
          <el-form
            :model="create"
            :rules="rules"
            ref="create"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="name">
              <el-input class="formInp" v-model="create.name"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-select class="formInp" v-model="create.role" clearable placeholder="请选择">
                <el-option
                  v-for="item in create.roles"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计费组" prop="billing">
              <el-select class="formInp" v-model="create.billing" clearable placeholder="请选择">
                <el-option
                  v-for="item in create.billings"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户组" prop="usergroup">
              <el-select class="formInp" v-model="create.usergroup" clearable placeholder="请选择">
                <el-option
                  v-for="item in create.usersgroup"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input class="formInp" type="password" v-model="create.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                class="formInp"
                type="password"
                v-model="create.checkPass"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('create')">立即创建</el-button>
              <el-button @click="resetForm('create')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
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
import { GetUserList, CreateUser, DeleteUser, ChangeUser } from "@/api/role";

import Pagination from "@/components/Pagination";
import Search from "@/components/Search";

export default {
  components: {
    Pagination,
    Search
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
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
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 5,
        total: 1
      },
      devices: [],
      loading: false,
      dialogCreating: false,
      titleHead: "",
      // 节点添加信息
      create: {
        name: "",
        role: "",
        roles: [
          {
            value: "admin",
            label: "管理员"
          },
          {
            value: "user",
            label: "用户"
          }
        ],
        billing: "",
        billings: [
          {
            value: "default",
            label: "default"
          },
          {
            value: "compute",
            label: "compute"
          }
        ],
        usergroup: "",
        usersgroup: [
          {
            value: "login01",
            label: "login01"
          },
          {
            value: "login02",
            label: "login02"
          }
        ],
        pass: "",
        checkPass: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change"
          }
        ],
        billing: [
          {
            required: true,
            message: "请选择计费组",
            trigger: "change"
          }
        ],
        usergroup: [
          {
            required: true,
            message: "请选择用户组",
            trigger: "change"
          }
        ],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let _this = this;
      _this.loading = true;
      let params = {
        pageOption: {
          pageNumber: _this.page.currentPage, //当前页数
          pageSize: _this.page.pageSize //每一页显示条数
        },
        selectOption: {}
      };
      if (_this.name !== "") {
        params.selectOption.name = _this.name;
      }
      if (_this.statustype !== "") {
        params.selectOption.type = _this.statustype;
      }
      GetUserList()
        .then(res => {
          //_this.devices = []
          _this.devices = res.data.result.dataList.map(function(item, index) {
            // 保存一份原始数据，便于取消编辑的时候还原数据
            const original = _.cloneDeep(item);
            item.original = original;
            _this.$set(item, "role", "用户");
            _this.$set(item, "edit", false);
            return item;
          });
          /* _this.page.total = res.data.pageResultData.totalDataNumber;
          _this.page.pageCount = res.data.pageResultData.totalCount; */
          _this.loading = false;
        })
        .catch(res => {
          console.log(res);
        });
    },

    //搜索
    searchChanged(data) {
      console.log(data);
    },

    saveEntity() {
      this.dialogCreating = true;
      this.titleHead = "添加用户";
    },
    //添加节点
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this;
          let params = {
            name: _this.create.name,
            role: _this.create.role,
            billing: _this.create.billing,
            usergroup: _this.create.usergroup,
            pass: _this.create.pass
          };
          CreateUser(params)
            .then(res => {
              _this.getList();
              _this.dialogCreating = false;
              _this.$message({
                type: "success",
                message: "添加成功!"
              });
            })
            .catch(res => {
              _this.$message({
                type: "error",
                message: "添加失败"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 查看用户详情
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
        .$confirm("此操作将删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            _id: row._id
          };
          DeleteUser(params)
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
      row.name = row.original.name;
      row.role = row.original.role;
      row.logTime = row.original.logTime;
      row.thawingTime = row.original.thawingTime;
      row.type = row.original.type;
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
        params.newOption.name = row.name;
      }
      if (row.role !== "") {
        params.newOption.role = row.role;
      }
      if (row.logTime !== "") {
        params.newOption.logTime = row.logTime;
      }
      if (row.thawingTime !== "") {
        params.newOption.thawingTime = row.thawingTime;
      }
      if (row.type !== "") {
        params.newOption.type = row.type;
      }

      await ChangeUser(params);
      row.original.name = row.name;
      row.original.role = row.role;
      row.original.logTime = row.logTime;
      row.original.thawingTime = row.thawingTime;
      row.original.type = row.type;
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
/*.hasten .el-form-item__content {
		width: 300px;
	}*/

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

.app-container .el-dialog .el-row .size {
  line-height: 40px;
  padding-left: 12px;
}

.app-container .el-dialog__wrapper:nth-child(4) .el-dialog {
  background: red;
}

.app-container .el-dialog__wrapper:nth-child(4) .el-dialog .el-dialog__header {
  text-align: center;
}

.app-container .el-dialog .formInp {
  width: 95%;
}
</style>