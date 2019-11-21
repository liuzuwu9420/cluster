import Mock from 'mockjs'

const list = []
const count = 30
for (let i = 0; i < count; i++) {
  list.push(Mock.mock({
    'CreatedAt': '@datetime()',
    'UpdatedAt': '@datetime()',
    'UUID': '@guid',
    'HostName': /\w{3,5}\d{1,2}/,
    'HostIP': '@ip',
    'State': /pend|run/,
    'Desc': '@cword(2,8)',
    'Tags': '',
    'HostDetails': ''
  }))
}
export default [
  // get hosts by UUID
  {
    url: '/hosts/.*/info',
    type: 'get',
    response: config => {
      return {
        'Success': true, 'Message': '', 'Code': '',
        'Inventory':
          Mock.mock({
            'ansible_architecture': /arch\d{1,3}/,
            'ansible_default_ipv4': {
              'address': /192\.168\.\d{1,3}\.\d{1,3}/,
              'alias': 'enahisic2i0',
              'broadcast': /192\.168\.\d{1,3}\.\d{1,3}/,
              'gateway': /192\.168\.\d{1,3}\.\d{1,3}/,
              'interface': 'enahisic2i0',
              'macaddress': '2c:97:b1:7c:55:81',
              'mtu': 1500,
              'netmask': '255.255.255.0',
              'network': /192\.168\.\d{1,3}\.\d{1,3}/,
              'type': 'ether'
            },
            'ansible_distribution': 'CentOS',
            'ansible_distribution_file_variety': 'RedHat',
            'ansible_distribution_version': '7.7.1908',
            'ansible_lsb': {
              'codename': 'AltArch',
              'description': 'CentOS Linux release 7.7.1908 (AltArch)',
              'id': 'CentOS',
              'major_release': '7',
              'release': '7.7.1908'
            },
            'ansible_memtotal_mb': /\d{3,6}/,
            'ansible_processor_vcpus': /64|32/,
            'ansible_product_name': 'TaiShan 2280',
            'ansible_system': 'Linux',
            'ansible_system_vendor': 'Huawei',
            'facter_processors': null
          }
          )
      }
    }
  },
  // hosts get all
  {
    url: '/hosts\?.*',
    type: 'get',
    response: config => {
      const { PageNumber, PageSize } = JSON.parse(config.query.page)
      const pageList = list.filter((item, index) => index < PageNumber * PageSize && index >= PageSize * (PageNumber - 1))
      return {
        'Success': true, 'Message': '', 'Code': '',
        'Inventory':
          {
            'TotalNumber': list.length,
            'PageSize': PageSize,
            'PageNumber': PageNumber,
            'ResultData': pageList
          }
      }
    }
  },
  // hosts post
  {
    url: '/hosts',
    type: 'post',
    response: config => {
      return { 'Success': true, 'Msg': '', 'Code': '', 'Inventory': {}}
    }
  },
  // hosts sync
  {
    url: '/hosts/sync',
    type: 'post',
    response: config => {
      return { 'Success': true, 'Msg': '', 'Code': '', 'Inventory': {}}
    }
  },
  // delete host by UUID
  {
    url: '/hosts/\.*',
    type: 'post',
    response: config => {
      return { 'Success': true, 'Msg': '', 'Code': '', 'Inventory': {}}
    }
  },
  {
    url: '/labels/.*',
    type: 'get',
    response: config => {
      return { 'Success': true, 'Message': '', 'Code': '', 'Inventory': [] }
    }
  },
  {
    url: '/labels',
    type: 'post',
    response: config => {
      return { 'Success': true, 'Message': '', 'Code': '', 'Inventory': [] }
    }
  }

]
