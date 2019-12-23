<template>
  <div v-show="sidepagedata.sidepageShow" class="tableInfo">
    <el-tabs v-model="activeName" :before-leave="beforeLeave">
      <el-tab-pane name="close">
        <span slot="label">
          <i class="el-icon-close" />
        </span>
      </el-tab-pane>
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <div class="container el-scrollbar">
          <el-row class="basic-container">
            <el-col :xs="24" :sm="24" :lg="16">
              <div class="left-head">
                <div class="left-head-name">
                  <span class="HostName">{{ sidepagedata.lists.RuleName }}</span>
                </div>
              </div>
              <div class="left-body">
                <div class="left-head-title">
                  <i class="el-icon-notebook-1" />
                  <span class="head-title">概览</span>
                </div>
                <div class="detail-row">
                  <div class="left-title">UUID:</div>
                  <div class="right-content">{{ sidepagedata.lists.UUID }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">价格:</div>
                  <div class="right-content">￥ {{ sidepagedata.lists.CostRate }}/{{ sidepagedata.lists.ChargeUnit }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">类型:</div>
                  <div class="right-content">{{ sidepagedata.lists.RuleType }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">创建时间:</div>
                  <div class="right-content">{{ sidepagedata.lists.CreatedAt }}</div>
                </div>
                <div class="detail-row">
                  <div class="left-title">最后修改时间:</div>
                  <div class="right-content">{{ sidepagedata.lists.UpdatedAt }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="计费组" name="BillGroupData">
        <div class="container el-scrollbar">
          <div class="hasten">
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
              :data="groupsData"
              element-loading-text="Loading"
              fit
              style="width: 100%; background-color: #e8f4ff;"
              row-class-name="table-row-class"
              height="100%"
            >
              <el-table-column label="计费组" width="120">
                <template v-slot="{row}">
                  <el-tooltip class="item" effect="dark" content="跳转计费组" placement="top">
                    <span class="jumpLink" @click="jumpBilllGroup(row)">{{ row.GroupName }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="创建时间">
                <template v-slot="{row}">
                  <span>{{ row.CreatedAt }}</span>
                </template>
              </el-table-column>
              <el-table-column label="更新时间">
                <template v-slot="{row}">
                  <span>{{ row.UpdatedAt }}</span>
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
import { GetBillingRuleGroup } from '@/api/rule'
import { formatDate } from '../../../../utils/format'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'

export default {
  name: 'BillRuleSidepage',
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
          lists: {},
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      activeName: 'BasicAttribute',
      loading: false,
      groupsData: [],
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
  watch: {
    sidepagedata: {
      handler: function(val, oldVal) {
        if (this.activeName === 'BillGroupData') {
          this.getList()
        }
      },
      deep: true
    }
  },
  methods: {
    beforeLeave(tab) {
      const _this = this
      if (tab === 'close') {
        _this.sidepagedata.sidepageShow = false
        return false
      } else if (tab === 'BillGroupData') {
        _this.getList()
      }
    },
    getList(query) {
      const _this = this
      _this.loading = true
      const UUID = _this.sidepagedata.lists.UUID
      const obj = {}
      if (query) {
        if (query.select === 'name') {
          obj.GroupName = query.value
        }
      }
      const params = {
        page: {
          PageNumber: _this.page.currentPage, // 当前页数
          PageSize: _this.page.pageSize // 每一页显示条数
        },
        query: obj
      }
      GetBillingRuleGroup(UUID, params)
        .then(res => {
          _this.groupsData = res.Inventory.ResultData.map(function(item, index) {
            item.CreatedAt = formatDate(item.CreatedAt, 'yyyy-MM-dd hh:mm:ss')
            item.UpdatedAt = formatDate(item.UpdatedAt, 'yyyy-MM-dd hh:mm:ss')
            return item
          })
          _this.page.total = res.Inventory.TotalNumber
          _this.loading = false
        }).catch(res => {
          console.log(res)
          _this.loading = false
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
    // 跳转计费组
    jumpBilllGroup(data) {
      const _this = this
      _this.$router.push({
        name: 'role.billing',
        params: {
          select: 'name',
          value: data.GroupName
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tableInfo {
  left: 160px;
  position: absolute;
  top: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border-right: 1px solid #fff;
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
    background-color: #e8f4ff;
    padding: 0 10px;
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
  }
  .left-title {
    width: 130px;
    color: #5e6978;
    float: left;
  }
  .left-content {
    color: #1a2736;
    overflow: auto;
  }
  .right-content {
    overflow: auto;
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

  .table-info-choose-uses {
    height: calc(100vh - 294px);
    overflow: auto;
  }
  .el-table .jumpLink {
    cursor: pointer;
    color: #49b0f9;
  }
  .foot-table-users {
    width: 100%;
    height: 40px;
    padding: 5px 10px;
    text-align: center;
  }
}

</style>
