<template>
  <div class="ExportExcel headBut">
    <el-dropdown @command="handleDropdownCommand">
      <span class="el-dropdown-link">
        <i class="el-icon-download" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(val,key) in items" :key="key" :command="key" v-text="val" />
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog :title="titleHead" :visible.sync="dialogExport" width="40%">
      <el-form
        ref="export"
        :model="exportExcel"
        label-width="100px"
        class="export-ruleForm"
        label-position="top"
      >
        <el-form-item label="文件名" prop="filename">
          <el-input v-model="exportExcel.filename" placeholder="excel-list" class="formInp" />
        </el-form-item>
        <el-form-item label="文件类型" prop="bookType">
          <el-radio-group v-model="exportExcel.bookType" class="formRadio">
            <el-radio-button label="xlsx"><svg-icon icon-class="xlsx" /></el-radio-button>
            <el-radio-button label="csv"><svg-icon icon-class="csv" /></el-radio-button>
            <el-radio-button label="txt"><svg-icon icon-class="txt" /></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="from-footer">
          <el-button type="primary" @click="submitForm('export')">下载</el-button>
          <el-button @click="resetForm('export')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ExportExcel',
  props: {
    selected: {
      required: true,
      type: Object,
      default() {
        return { key: '', value: '' }
      }
    },
    items: {
      required: true,
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
    filterVal: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
    tHeader: {
      required: true,
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogExport: false,
      titleHead: '',
      exportExcel: {
        filename: '',
        bookType: 'xlsx',
        autoWidth: true
      }
    }
  },
  methods: {
    handleDropdownCommand(command) {
      if (command !== this.selected.key) {
        this.selected.key = command
        this.selected.value = this.items[command]
        this.$emit('change', this.selected)
      }
      this.dialogExport = true
      this.titleHead = '导出报表'
    },

    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          import('@/vendor/Export2Excel').then(excel => {
            const list = _this.list
            const data = _this.formatJson(_this.filterVal, list)
            excel.export_json_to_excel({
              header: _this.tHeader,
              data,
              filename: _this.exportExcel.filename,
              autoWidth: _this.exportExcel.autoWidth,
              bookType: _this.exportExcel.bookType
            })
          })
        } else {
          _this.$message({
            type: 'error',
            message: '下载失败'
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
.el-dropdown {
  padding: 7px 14px;
  border-radius: 4px;
  text-align: center;
  border: 1px solid #1890ff;
  background-color: #1890ff;
}
.el-dropdown:hover {
  background-color: #46a6ff;
}
.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
  font-size: 18px
}

.el-dialog__wrapper:nth-child(4) .el-dialog {
  background: red;
}

.el-dialog__wrapper:nth-child(4) .el-dialog .el-dialog__header {
  text-align: center;
}

.export-ruleForm {
  padding: 0 20px;
}

.el-dialog .formInp {
  width: 95%;
}
.from-footer {
  padding-top: 20px;
  text-align: center;
}
</style>
