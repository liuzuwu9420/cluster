import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */

/**
 * 获取作业状态数目
 */
export function GetTaskNum() {
  return request({
    url: `/jobs/statistics`,
    method: 'get'
  })
}

/**
 * 获取运行中作业信息
 * @param {*} params 查询参数
 */
export function GetRunTaskList(params) {
  return request({
    url: `/jobs/status/run`,
    method: 'get',
    params
  })
}

/**
 * 获取等待中作业信息
 * @param {*} params 查询参数
 */
export function GetPendTaskList(params) {
  return request({
    url: `/jobs/status/pend`,
    method: 'get',
    params
  })
}

/**
 * 获取作业信息
 * @param {*} params 查询参数
 */
export function GetTaskList(params) {
  return request({
    url: `/jobs`,
    method: 'get',
    params
  })
}

/**
 * 获取部分等待作业信息
 * @param {*} params 查询参数
 */
export function GetPendTaskTOPList(params) {
  return request({
    url: `/jobs/top/15?status=pend`,
    method: 'get',
    params
  })
}

/**
 * 获取部分运行作业信息
 * @param {*} params 查询参数
 */
export function GetRunTaskTOPList(params) {
  return request({
    url: `/jobs/top/15?status=run`,
    method: 'get',
    params
  })
}

/**
 * 根据jobID获取作业信息
 * @param {*} jobID 作业ID
 */
export function GetJobIDList(jobID) {
  return request({
    url: `/jobs/${jobID}`,
    method: 'get'
  })
}

/**
 * 根据jobID获取作业所在节点
 * @param {*} jobID 作业ID
 */
export function GetJobIDHost(jobID) {
  return request({
    url: `/jobs/${jobID}/hosts`,
    method: 'get'
  })
}

/**
 * 根据jobID获取作业历史信息
 * @param {*} jobID 作业ID
 */
export function GetJobIDEvents(jobID) {
  return request({
    url: `/jobs/${jobID}/events`,
    method: 'get'
  })
}

/**
 * 获取命令行的队列信息
 * @param {*} params 查询参数
 */
export function GetCmdQueueList(params) {
  return request({
    url: `/queue/cmd`,
    method: 'get',
    params
  })
}

/**
 * 根据名字查询命令行的队列信息
 * @param {*} name 队列名
 */
export function GetCmdQueueName(name) {
  return request({
    url: `/queue/cmd/${name}`,
    method: 'get'
  })
}

/**
 * 获取配置的队列信息
 * @param {*} params 查询参数
 */
export function GetConfQueueList(params) {
  return request({
    url: `/queue/conf`,
    method: 'get',
    params
  })
}

/**
 * 根据名字查询命令行的队列信息
 * @param {*} name 队列名
 */
export function GetConfQueueName(name) {
  return request({
    url: `/queue/conf/${name}`,
    method: 'get'
  })
}
