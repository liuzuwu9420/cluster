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
    url: `/users/sync`,
    method: 'post'
  })
}

// 同步作业
export function syncHost() {
  return request({
    url: `/jobs/sync/10`,
    method: 'post'
  })
}

// 同步作业
export function syncDevices() {
  return request({
    url: `/hosts/sync`,
    method: 'post'
  })
}

// 同步命令行的队列信息
export function syncCmd() {
  return request({
    url: `/queue/cmd/sync`,
    method: 'post'
  })
}

// 同步配置的队列信息
export function syncConf() {
  return request({
    url: `/queue/conf/sync`,
    method: 'post'
  })
}
