<template>
  <div class="app-container">
    <section>
      <div class="content">
        <el-card style="padding:20px 20px 0 0;">
          <el-form v-model="query" :rules="rule" label-position="right" label-width="80px">
            <el-form-item label="时间" prop="date">
              <el-date-picker
                v-model="query.date"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item v-model="query.user_name" label="用户名" prop="user_name">
              <el-input v-model="query.user_name" placeholder="请输入真实用户名，多个用户名用空格隔开，不输入代表所有用户" />
            <!-- <el-select v-model="query.user_name" filterable multiple>
              <el-option
                v-for="item in users"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            </el-form-item>
            <el-form-item label="队列名">
              <el-input v-model="query.queue_name" placeholder="请输入真实队列，多个队列用空格隔开，不输入代表所有队列" />
            <!-- <el-select v-model="query.queue_name" filterable multiple>
              <el-option
                v-for="item in queues"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="head-button" @click="handleClick">生成</el-button>
              <el-button class="head-button">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card>
          <p>计费周期：{{ query.date[0] }}至{{ query.date[1] }}，用户：{{ query.user_name|emptyUserOrQueue }}，队列：{{ query.queue_name|emptyUserOrQueue }}
          </p>
          <p>
            总费用:<count-to :start-val="0" :end-val="cost" :decimals="2" :duration="1000" />元
          </p>
        </el-card>
      </div>
      <div class="content">
        <Pie v-if="pie.config.data.length" :config="pie.config" />
      </div>
    </section>
    <section>
      <column v-if="column.config.data.length" :config="column.config" />
    </section>
  </div>
</template>

<script>
import optionMixin from '@/mixin/options'
import { getEsDataByDSL } from '@/api/elasticsearch'
import { formatDate } from '@/utils/format'
import Column from '@/components/Chart/column'
import Pie from '@/components/Chart/pie'
import CountTo from 'vue-count-to'

export default {
  name: 'BillingStatistics',
  filters: {
    emptyUserOrQueue(v) {
      return v === '' ? 'all' : v
    }
  },
  components: {
    Column,
    Pie,
    CountTo
  },
  mixins: [optionMixin],
  data() {
    return {
      query: {
        date: [],
        user_name: '',
        queue_name: ''
      },
      rule: {
        user_name: [{ message: '请输入真实用户名，多个用户名用空格隔开', trigger: 'blur', pattern: /^(\w )*$/ }],
        date: [{ message: '请输入真实队列，多个队列用空格隔开', trigger: 'blur', pattern: /^(\w )*$/ }]
      },
      // queues: [],
      // users: [],
      cost: '',
      objDSL: {
        'from': 0,
        'size': 0,
        query: { bool: {
          must: [],
          should: [],
          must_not: [],
          filter: []
        }},
        sort: {},
        aggs: {}
      },
      column: {
        config: { data: [] }
      },
      pie: {
        config: { data: [] }
      }
    }
  },
  mounted() {
    const now = new Date()
    this.query.date.push(formatDate(now, 'yyyy-MM-dd'))
    this.query.date.unshift(formatDate(now.getTime() - 3600 * 1000 * 24 * 7, 'yyyy-MM-dd'))
    this.getList()
  },
  methods: {
    getList() { this.handleClick() },

    handleClick() {
      this.getRes(this.getEsSumStr())
    },

    async getRes(objDSL) {
      const res = await getEsDataByDSL('lsf-acct-cost', objDSL)
      const { sum_cost, cost_on_time, sum_by_queue } = res.aggregations
      this.cost = sum_cost.value
      const column = this.getColumnConfig()
      column.data = cost_on_time.buckets.map(item => {
        return {
          name: formatDate(item.key_as_string, 'yyyy-MM-dd'),
          value: (Math.round(item.sum_cost.value * 10000) / 10000)
        }
      })
      const pie = this.getPieConfig()
      pie.data = sum_by_queue.buckets.map(item => {
        return {
          name: item.key,
          value: (Math.round(item.sum_cost.value * 10000) / 10000)
        }
      })

      this.column.config = column
      this.pie.config = pie
    },

    getColumnConfig() {
      const config = JSON.parse(JSON.stringify(this.column.config))
      config.title = { text: '总费用' }
      config.description = {
        visible: true,
        text: '基于时间查看总费用，输入用户和队列后点击生成更新数据'
      }
      config.meta = {
        name: { alias: '日期' },
        value: { alias: '费用(元)' }
      }
      return config
    },

    getPieConfig() {
      const config = JSON.parse(JSON.stringify(this.pie.config))
      config.title = { text: '队列费用占比' }
      config.description = {
        visible: true,
        text: '查看各队列在总费用中的占比，输入用户和队列后点击生成更新数据'
      }
      config.meta = {
        name: { alias: '日期' },
        value: { alias: '费用(元)' }
      }
      return config
    },

    getEsSumStr() {
      const { date, user_name, queue_name } = this.query
      const dsl = JSON.parse(JSON.stringify(this.objDSL))
      dsl.query.bool.filter.push({
        range: {
          '@timestamp':
          { lte: date[1], gte: date[0] }
        }
      })
      dsl.aggs.sum_cost = { sum: { field: 'job_cost' }}
      dsl.aggs.cost_on_time = {
        date_histogram: {
          field: '@timestamp',
          calendar_interval: 'day'
        },
        aggs: {
          sum_cost: {
            sum: { field: 'job_cost' }
          }
        }
      }
      dsl.aggs.sum_by_queue = {
        terms: {
          field: 'queue_name.keyword'
        },
        aggs: {
          sum_cost: {
            sum: {
              field: 'job_cost'
            }
          }
        }
      }
      if (user_name) {
        dsl.query.bool.filter.push([{ match: { user_name: { query: user_name, operator: 'or' }}}])
      }
      if (queue_name) {
        dsl.query.bool.filter.push([{ match: { queue_name: { query: queue_name, operator: 'or' }}}])
      }
      return dsl
    }

  }
}
</script>
<style scoped lang="scss">
.datePicker{
  margin-right: 10px;
}
section{
  display: flex;
  flex-flow: row;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px 15px;
  margin-bottom: 20px;
  height: 50%;
  &:last-child{
    margin-bottom: 0;
    flex-flow: column;
  }
  .content{
    width: 50%;
    flex-grow: 1;
    &:first-child{
      display: flex;
      flex-flow: column;
      justify-content: space-evenly;
    }
    >ul{
      display: flex;
      list-style: none;
      padding: 0;
      justify-content: space-around;
    }
  }
}

</style>
