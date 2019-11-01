import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */
const v = 'v1'

/**
 * 获取作业状态数目
 */
export function GetTaskNum() {
  return request({
    url: `/api/${v}/jobs/statistics`,
    method: 'get'
  })
}

/**
 * 获取运行中作业信息
 * @param {*} params 查询参数
 */
export function GetRunTaskList(params) {
  return request({
    url: `/api/${v}/jobs/status/run`,
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
    url: `/api/${v}/jobs/status/pend`,
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
    url: `/api/${v}/jobs`,
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
    url: `/api/${v}/jobs/top/15?status=pend`,
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
    url: `/api/${v}/jobs/top/15?status=run`,
    method: 'get',
    params
  })
}

/**
 * 根据作业名获取作业信息
 * @param {*} param 作业名
 */
export function GetJobNameList(params) {
  return request({
    url: `/api/${v}/jobs/test`,
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
    url: `/api/${v}/jobs/${jobID}`,
    method: 'get'
  })
}

/**
 * 根据jobID获取作业所在节点
 * @param {*} jobID 作业ID
 */
export function GetJobIDHost(jobID) {
  return request({
    url: `/api/${v}/jobs/${jobID}/host`,
    method: 'get'
  })
}

/**
 * 获取报警信息
 * @param {*} params 查询参数
 */
export function GetAlarmList(params) {
  return request({
    url: `/api/${v}/jobs/test`,
    method: 'get',
    params
  })
}

/**
 * 删除报警
 * @param {*} params 报警参数
 */
export function DeleteAlarm(params) {
  return request({
    url: `/api/${v}/jobs/test`,
    method: 'get',
    params
  })
}

/**
 * 编辑报警备注
 * @param {*} params 报警参数
 */
export function ChangeAlarm(params) {
  return request({
    url: `/api/${v}/jobs/test`,
    method: 'get',
    params
  })
}
