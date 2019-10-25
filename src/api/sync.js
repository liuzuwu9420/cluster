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

// 同步用户组数据
export function syncGroup() {
  return request({
    url: `/api/${v}/groups/sync`,
    method: 'post'
  })
}

// 同步作业任务数据
export function syncTask() {
  return request({
    url: `/api/${v}/jobs/sync`,
    method: 'post'
  })
}
