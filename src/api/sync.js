import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */

// 同步用户数据
export function syncUser() {
  return request({
    url: `/users/actions/sync`,
    method: 'post'
  })
}

// 同步主机
export function syncDevices() {
  return request({
    url: `/hosts/actions/sync`,
    method: 'post'
  })
}
