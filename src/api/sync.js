import request from '@/utils/request'

// 同步数据
export function sync() {
  return request({
    url: '/sync',
    method: 'put'
  })
}
