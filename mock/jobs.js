import Mock from 'mockjs'

const list = []
const count = 30
for (let i = 0; i < count; i++) {
  list.push(Mock.mock({
    'QUEUE_NAME': /\w{3,8}/,
    'PEND': '@integer(0,10)',
    'RUN': '@integer(0,10)',
    'NJOBS': '@integer(10,30)',
    'SUSP': '@integer(0,10)',
    'STATUS': 'Open:Active',
    'MAX': '@integer(30,50)',
    'CreatedAt': '@datetime()',
    'Desc': '',
    'HostDetails': '',
    'HostIP': '@ip',
    'HostName': 'node-arm02',
    'State': '',
    'Tags': '',
    'UUID': '@uuid',
    'UpdatedAt': '@datetime()'
  }))
}

export default [
  // queues info
  {
    url: '/lsf/jobs\?',
    type: 'get',
    response: config => {
      const { PageNumber, PageSize } = JSON.parse(config.query.page)
      const pageList = list.filter((item, index) => index < PageNumber * PageSize && index >= PageSize * (PageNumber - 1))
      return {
        'Success': true, 'Message': '', 'Code': '', 'Inventory': {
          'TotalNumber': list.length,
          PageSize,
          PageNumber,
          'ResultData': pageList
        }
      }
    }
  },
  // jobs sync
  {
    url: '/jobs/sync/10',
    type: 'post',
    response: config => {
      return { 'Success': true, 'Message': '', 'Code': '', 'Inventory': '' }
    }
  }
]
