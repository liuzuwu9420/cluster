import Jsrsasign from 'jsrsasign'
// Header
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
    'UUID': '@guid',
    'UserHomeDir': /\w{4,8}/,
    'GroupID': '@increment(120)',
    'GroupName': /\w{3,6}/,
    'Message': '同步开始',
    'Status': 'success',
    'ResultID': '@guid'
  }))
}

var oHeader = { alg: 'HS256', typ: 'JWT' }
// Payload
var oPayload = {}
var tNow = Jsrsasign.KJUR.jws.IntDate.get('now')
var tEnd = Jsrsasign.KJUR.jws.IntDate.get('now + 1day')
oPayload.nbf = tNow
oPayload.iat = tNow
oPayload.exp = tEnd
var sHeader = JSON.stringify(oHeader)
var sPayload = JSON.stringify(oPayload)
var sJWT = Jsrsasign.KJUR.jws.JWS.sign('HS256', sHeader, sPayload, { b64: 'MTIzNDU2Nzg=' })
export default [
  // user login
  {
    url: '/users/login',
    type: 'post',
    response: config => {
      return {
        'Success': true,
        'Message': '',
        'Code': '',
        'Inventory': sJWT
      }
    }
  },
  // user sync
  {
    url: '/users/sync',
    type: 'post',
    response: config => {
      const mockList = formatMockData(list, ['Message', 'Status', 'ResultID'])
      return { 'Success': true, 'Message': '', 'Code': '', 'Inventory': mockList }
    }
  },
  // get user Info by userId
  {
    url: '/users/\d{1,10}',
    type: 'post',
    response: config => {
      return { 'Success': true, 'Msg': '', 'Code': '', 'Inventory': {}}
    }
  },
  // get groups by userId
  {
    url: '/users/[0-9]+/groups',
    type: 'get',
    response: config => {
      const mockList = formatMockData(list, ['UpdatedAt', 'CreatedAt', 'UUID', 'GroupID', 'GroupName'])
      return { 'Success': true, 'Message': '', 'Code': '', 'Inventory': mockList[0] }
    }
  },
  // get user chargedGroups by userId
  {
    url: '/users/[0-9]+/chargedGroups',
    type: 'get',
    response: config => {
      const mockList = formatMockData(list, ['UpdatedAt', 'CreatedAt', 'UUID', 'GroupID', 'GroupName'])
      return {
        'Success': true, 'Message': '', 'Code': '',
        'Inventory': mockList[0]
      }
    }
  },
  // get user Info
  {
    url: '/users\?.*',
    type: 'get',
    response: config => {
      const { PageNumber, PageSize } = JSON.parse(config.query.page)
      const mockList = formatMockData(list, ['UpdatedAt', 'CreatedAt', 'UserID', 'UserName', 'UUID', 'UserHomeDir'])
      const pageList = mockList.filter((item, index) => index < PageNumber * PageSize && index >= PageSize * (PageNumber - 1))
      return {
        'Success': true, 'Message': '', 'Code': '',
        'Inventory':
          {
            'TotalNumber': mockList.length,
            PageNumber,
            PageSize,
            'ResultData': pageList
          }
      }
    }
  }
]
