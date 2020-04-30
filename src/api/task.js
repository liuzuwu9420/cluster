import request from '@/utils/request'
const lsfAgentUrl = `/lsfagent/api/v1/lsf`

/**
 * 获取作业信息
 * @param {*} params 查询参数
 */
export function GetTaskList(params) {
  return request({
    url: `${lsfAgentUrl}/jobs`,
    method: 'get',
    params
  })
}

/**
 * 获取作业TOP信息
 * @param {*} params 查询参数
 * @param {*} decimals TOP数量
 */
export function GetTaskTOPList(params, decimals) {
  const de = decimals || 5
  return request({
    url: `${lsfAgentUrl}/jobs/top/${de}`,
    method: 'get',
    params
  })
}

/**
 * 获取队列信息
 * @param {*} params 查询参数
 */
export function GetLsfQueueList(params) {
  return request({
    url: `${lsfAgentUrl}/queues`,
    method: 'get',
    params
  })
}

/**
 * 检查queue config同步过程是否出错
 */
export function CheckQueuesConfig() {
  return request({
    url: `${lsfAgentUrl}/queues/conf/ckconfig`,
    method: 'post'
  })
}

/**
 * 重新同步queue config
 */
export function ReloadQueuesConfig() {
  return request({
    url: `${lsfAgentUrl}/queues/conf/reconfig`,
    method: 'post'
  })
}

/**
 * 获取作业主机的信息
 * @param {*} params 查询参数
 */
export function GetLsfHostList(params) {
  return request({
    url: `${lsfAgentUrl}/hosts`,
    method: 'get',
    params
  })
}

/**
 * 获取用户提交过的作业信息
 * @param {*} params 查询参数
 */
export function GetLsfUsersTask(params) {
  return request({
    url: `${lsfAgentUrl}/users`,
    method: 'get',
    params
  })
}

/**
 * 获取某个队列内的主机
 * @param {*} queue 查询参数
 */
export function GetLsfHostInQueue(queue) {
  return request({
    url: `${lsfAgentUrl}/queues/${queue}/hosts`,
    method: 'get'
  })
}
