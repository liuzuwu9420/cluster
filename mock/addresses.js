
const addressList = {
  'grafana.address': 'http://16.16.18.61:3000/',
  'prometheus.address': 'http://16.16.18.61:9090/',
  'centrifugo.address': 'node-dev.xtc.home:8000'
}

export default [
// get all address
  {
    url: '/sys/configs',
    type: 'get',
    response: config => {
      return {
        'Success': true,
        'Message': '',
        'Code': '',
        'Inventory': addressList
      }
    }
  },
  // get address by name
  {
    url: '/sys/configs.*',
    type: 'get',
    response: config => {
      return {
        'Success': true,
        'Message': '',
        'Code': '',
        'Inventory': addressList['grafana.address']
      }
    }
  },
  // modify address
  {
    url: '/sys/configs',
    type: 'post',
    response: config => {
      return {
        'Success': true,
        'Message': '',
        'Code': '',
        'Inventory': null
      }
    }
  }
]
