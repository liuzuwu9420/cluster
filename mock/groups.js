import Mock from 'mockjs'
import { formatMockData } from '../src/utils/format.js'

const list = []
const count = 30
for (let i = 0; i < count; i++) {
  list.push(Mock.mock({
    'UserID': '@increment(1020)',
    'UserName': '@first',
    'CreatedAt': '@datetime()',
    'UpdatedAt': '@datetime()',
    'GroupID': '@integer(100,1000)',
    'UUID': '@guid',
    'GroupName': '@last',
    'CostRate': '@integer(1,10)',
    'Desc': '@cword(2,8)'
  }))
}

export default [
  // groups sync
  {
    url: '/groups/sync',
    type: 'post',
    response: config => {
      return { 'Success': true, 'Msg': '', 'Code': '', 'Inventory': { 'Message': '同步完成', 'Status': 'success' }}
    }
  },
  //  get user by group id
  {
    url: '/groups/[0-9]+/users',
    type: 'get',
    response: config => {
      const mockList = formatMockData(list, ['UserID', 'UserName'])
      return {
        'Success': true, 'Message': '', 'Code': '',
        'Inventory': [
          ...mockList
        ]
      }
    }
  },
  // groups info
  {
    url: '/groups\?.*',
    type: 'get',
    response: config => {
      const { PageNumber, PageSize } = JSON.parse(config.query.page)
      const mockList = formatMockData(list, ['UpdatedAt', 'CreatedAt', 'GroupID', 'GroupName', 'UUID'])
      const pageList = mockList.filter((item, index) => index < PageNumber * PageSize && index >= PageSize * (PageNumber - 1))
      return {
        'Success': true, 'Message': '', 'Code': '',
        'Inventory':
          {
            'TotalNumber': mockList.length,
            'PageSize': PageSize,
            'PageNumber': PageNumber,
            'ResultData': pageList
          }
      }
    }
  },
  //  get chargedGroups Info
  {
    url: '/chargedGroups\?\.*',
    type: 'get',
    response: config => {
      const { PageNumber, PageSize } = JSON.parse(config.query.page)
      const mockList = formatMockData(list, ['UpdatedAt', 'CreatedAt', 'GroupID', 'GroupName', 'UUID', 'CostRate', 'Desc'])
      const pageList = mockList.filter((item, index) => index < PageNumber * PageSize && index >= PageSize * (PageNumber - 1))
      return {
        'Success': true, 'Message': '', 'Code': '',
        'Inventory':
          {
            'TotalNumber': mockList.length,
            'PageSize': PageSize,
            'PageNumber': PageNumber,
            'ResultData': pageList
          }
      }
    }
  },
  //  get chargedGroups Info
  {
    url: '/chargedGroups',
    type: 'post',
    response: config => {
      const mockList = formatMockData(list, ['UpdatedAt', 'CreatedAt', 'GroupID', 'GroupName', 'UUID', 'CostRate', 'Desc'])
      return {
        'Success': true, 'Message': '', 'Code': '',
        'Inventory':
          {
            'TotalNumber': mockList.length,
            'ResultData': mockList
          }
      }
    }
  }

]
