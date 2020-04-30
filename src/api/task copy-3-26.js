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
    url: `/lsf/jobs/statistics`,
    method: 'get'
  })
}

/**
 * 获取运行中作业信息
 * @param {*} params 查询参数
 */
export function GetRunTaskList(params) {
  return request({
    url: `/lsf/jobs/status/run`,
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
    url: `/lsf/jobs/status/pend`,
    method: 'get',
    params
  })
}
/**
 * 获取已完成作业信息
 * @param {*} params 查询参数
 */
export function GetFinishTaskList(params) {
  return request({
    url: `/lsf/jobs/status/finish`,
    method: 'get',
    params
  })
}
/**
 * 获取所有作业信息
 * @param {*} params 查询参数
 */
export function GetTaskList(params) {
  return request({
    url: `/lsf/jobs`,
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
    url: `/lsf/jobs/top/:${de}`,
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
    url: `/lsf/jobs/:${jobID}`,
    method: 'get'
  })
}

/**
 * 根据jobID获取作业所在节点
 * @param {*} jobID 作业ID
 */
export function GetJobIDHost(jobID) {
  return request({
    url: `/lsf/jobs/:${jobID}/hosts`,
    method: 'get'
  })
}

/**
 * 根据jobID获取作业历史信息
 * @param {*} jobID 作业ID
 */
export function GetJobIDEvents(jobID) {
  return request({
    url: `/lsf/jobs/:${jobID}/events`,
    method: 'get'
  })
}

/**
 * 切换同步状态
 */
export function SwitchAsyncStatus() {
  return request({
    url: `/lsf/jobs/actions/loop`,
    method: 'post'
  })
}

/**
 * 获取任务信息的进程状态
 */
export function GetAsyncStatus() {
  return request({
    url: `/lsf/jobs/loop/status`,
    method: 'get'
  })
}

/**
 * 获取命令行的队列信息
 * @param {*} params 查询参数
 */
export function GetCmdQueueList(params) {
  return request({
    url: `/lsf/queues/status`,
    method: 'get',
    params
  })
}

/**
 * 获取任务数前五的队列
 * @param {*} params 查询参数
 */
export function GetQueueTOPList(params) {
  return request({
    url: `/lsf/queues/top/:5`,
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
    url: `/lsf/queues/:${name}/status`,
    method: 'get'
  })
}

/**
 * 获取配置的队列信息
 * @param {*} params 查询参数
 */
export function GetConfQueueList(params) {
  return request({
    url: `/lsf/queues/spec`,
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
    url: `/lsf/queues/:${name}/spec`,
    method: 'get'
  })
}

/**
 * 获取作业主机的信息
 * @param {*} params 查询参数
 */
export function GetLsfHostList(params) {
  return request({
    url: `/lsf/hosts`,
    method: 'get',
    params
  })
}

/**
 * 根据名字查询作业节点信息
 * @param {*} name 节点名
 */
export function GetLsfHostName(name) {
  return request({
    url: `/lsf/hosts/:${name}`,
    method: 'get'
  })
}

/**
 * 获取作业主机的信息
 * @param {*} params 查询参数
 * @param {*} name 节点名
 */
export function GetLsfHostTask(params, name) {
  return request({
    url: `/lsf/hosts/:${name}/jobs`,
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
    url: `/lsf/users`,
    method: 'get',
    params
  })
}

/**
 * 获取某个用户提交过的作业信息
 * @param {*} name 用户名
 */
export function GetLsfUserTask(name) {
  return request({
    url: `/lsf/users/:${name}`,
    method: 'get'
  })
}

/**
 * 同步用户提交过的作业信息
 */
export function SyncLsfUserTask() {
  return request({
    url: `/lsf/users/actions/sync`,
    method: 'post'
  })
}

