import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */
const v = 'v1'

// 同步用户数据
export function syncUser() {
  return request({
    url: `/api/${v}/users/sync`,
    method: 'post'
  })
}

// 同步作业
export function syncHost() {
  return request({
    url: `/api/${v}/jobs/sync/10`,
    method: 'post'
  })
}

// 同步作业
export function syncDevices() {
  return request({
    url: `/api/${v}/hosts/sync`,
    method: 'post'
  })
}
