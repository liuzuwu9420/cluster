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
 * 获取未完成作业信息
 * @param {*} params 查询参数
 */
export function GetRunTaskList(params) {
  return request({
    url: `/api/${v}/jobs/run?PageSize=${params.PageSize}&PageNumber=${params.PageNumber}`,
    method: 'get'
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
