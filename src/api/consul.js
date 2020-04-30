import request from '@/utils/request'
const consulUrl = `/consul/api/v1/kv`

/**
 * 获取consul下prometheus报警数据
 * @param {*} params consul alarm参数
 */
export function getConsulAlarm(params) {
  return request({
    url: `${consulUrl}/prometheus/alerting-rules/groups`,
    method: 'get',
    params
  })
}
/**
 * 添加修改consul数据
 * @param {*} key consul alarm路由参数
 * @param {*} data consul alarm参数
 */
export function changeConsulAlarm(key, data) {
  return request({
    url: `${consulUrl}/${key}`,
    method: 'put',
    data
  })
}
/**
 * 删除consul数据
 * @param {*} key consul alarm路由参数
 */
export function deleteConsulAlarm(key) {
  return request({
    url: `${consulUrl}/${key}`,
    method: 'delete'
  })
}

/**
 * 获取consul下queue计费规则
 */
export function getQueueBill() {
  return request({
    url: `${consulUrl}/lsf/job-meter?recurse=true`,
    method: 'get'
  })
}

/**
 * 添加consul下queue计费规则
 * @param {*} data 新增规则
 */
export function putQueueBill(queueName, data) {
  return request({
    url: `${consulUrl}/lsf/queue/${queueName}`,
    method: 'put',
    data
  })
}

/**
 * 删除consul下queue计费规则
 * @param {*} data 新增规则
 */
export function deleteQueueBill(queueName) {
  return request({
    url: `${consulUrl}/lsf/queue/${queueName}`,
    method: 'delete'
  })
}

/**
 * 获取consul下各种服务器地址
 */
export function getServerAddress() {
  return request({
    url: `${consulUrl}/sofa/sys/settings?recurse=true`,
    method: 'get'
  })
}

/**
 * 获取consul下queue的配置
 */
export function getQueueConfig() {
  return request({
    url: `${consulUrl}/lsf/conf/lsbatch/cluster1/configdir/lsb.queues?recurse=true`,
    method: 'get'
  })
}

/**
 * 添加consul下queue的配置
 * @param {*} path 队列名和地址
 * @param {*} data 修改内容
 */
export function putQueueConfig(path, data) {
  return request({
    url: `${consulUrl}/lsf/conf/lsbatch/cluster1/configdir/lsb.queues/${path}`,
    method: 'put',
    data
  })
}

/**
 * 删除consul下queue的配置
 * @param {*} queueName 删除的队列名
 */
export function deleteQueueConfig(queueName) {
  return request({
    url: `${consulUrl}/lsf/conf/lsbatch/cluster1/configdir/lsb.queues/${queueName}?recurse=true`,
    method: 'delete'
  })
}
