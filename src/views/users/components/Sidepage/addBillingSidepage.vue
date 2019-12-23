<template>
  <div v-show="sidepagedata.sidepageShow" class="tableInfo">
    <el-tabs v-model="activeName" :before-leave="beforeLeave">
      <el-tab-pane name="close">
        <span slot="label">
          <i class="el-icon-close" />
        </span>
      </el-tab-pane>
      <el-tab-pane label="计费规则" name="billingRuleData">
        <div class="container el-scrollbar">
          <div class="hasten">
            <el-button type="primary" size="mini" @click="getList">
              <i class="el-icon-refresh-right" /> 刷新
            </el-button>
            <search :items="selected.items" @change="searchChanged" />
            <div class="pagination">
              <pagination
                v-show="page.total>0"
                :total="page.total"
                :page.sync="page.currentPage"
                :limit.sync="page.pageSize"
                @pagination="getList"
              />
            </div>
          </div>
          <div class="table-info el-scrollbar">
            <el-table
              v-loading="loading"
              :data="billingRulesData"
              element-loading-text="Loading"
              fit
              style="width: 100%"
              height="100%"
              highlight-current-row
              @cell-click="handleCurrentChange"
            >
              <el-table-column label="名称">
                <template v-slot="{row}">
                  <span>{{ row.RuleName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="类型" width="160">
                <template v-slot="{row}">
                  <span>{{ row.RuleType }}</span>
                </template>
              </el-table-column>
              <el-table-column label="价格" width="230">
                <template v-slot="{row}">
                  <span>￥ {{ row.CostRate }} / {{ row.ChargeUnit }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" show-overflow-tooltip>
                <template v-slot="{row}">
                  <span>{{ row.CreatedAt }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="更新时间" show-overflow-tooltip>
                <template v-slot="{row}">
                  <span>{{ row.UpdatedAt }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { GetBillingRuleList } from '@/api/rule'
import { formatDate } from '../../../../utils/format'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'

export default {
  name: 'AddBillingSidepage',
  components: {
    Pagination,
    Search
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      activeName: 'billingRuleData',
      loading: false,
      billingRulesData: [],
      // 查询数据
      selected: {
        items: [
          {
            value: 'name',
            label: '名称'
          }
        ]
      },
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 1
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    beforeLeave(tab) {
      const _this = this
      if (tab === 'close') {
        _this.sidepagedata.sidepageShow = false
        return false
      } else if (tab === 'billingRuleData') {
        _this.getList()
      }
    },
    getList(query) {
      const _this = this
      const obj = {}
      if (query) {
        if (query.select === 'name') {
          obj.RuleName = query.value
        } else if (query.select === 'UUID') {
          obj.UUID = query.value
        }
      }
      const params = {
        page: {
          PageNumber: _this.page.currentPage, // 当前页数
          PageSize: _this.page.pageSize // 每一页显示条数
        },
        query: obj
      }
      GetBillingRuleList(params)
        .then(res => {
          _this.billingRulesData = res.Inventory.ResultData.map(function(item, index) {
            item.CreatedAt = formatDate(item.CreatedAt, 'yyyy-MM-dd hh:mm:ss')
            item.UpdatedAt = formatDate(item.UpdatedAt, 'yyyy-MM-dd hh:mm:ss')
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
          _this.page.pageCount = res.Inventory.PageNumber
        })
        .catch(res => {
          console.log(res)
        })
    },

    // 搜索
    searchChanged(data) {
      const _this = this
      if (data.value === '') {
        _this.getList()
      } else {
        _this.getList(data)
      }
    },
    handleCurrentChange(row) {
      this.$emit('handle-billing-rule-data', row)
    }
  }
}
</script>
<style lang="scss" scoped>
.tableInfo {
  left: 330px;
  position: absolute;
  top: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border-right: 1px solid #fff;
  border-left: 1px solid rgb(218, 224, 230);
  z-index: 1500;
  background: #fff;
  .el-tabs {
    background-color: #eff9ff;
  }
  .el-tab-pane {
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
    font-size: 16px;
    background-color: #ffffff;
  }
  .basic-container {
    padding-left: 60px;
  }
  .left-head {
    margin-top: 20px;
    line-height: 20px;
    font-size: 0;
    color: #1a2736;
    .HostName {
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
    width: 110px;
    color: #5e6978;
    float: left;
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
  .right-content-usergroup {
    overflow: auto;
  }
  .GroupLink {
    cursor: pointer;
    color: #49b0f9;
  }
  .hasten {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    padding: 5px 10px;
    .el-button {
      height: 36px;
      line-height: 0;
      float: left;
      margin-right: 0px;
      margin-left: 0px;
    }
    .headBut {
      margin-right: 0px;
      margin-left: 10px;
      float: left;
    }
  }

  .pagination {
    float: right;
  }

  .table-info {
    height: calc(100vh - 234px);
    overflow: auto;
  }
}

</style>
