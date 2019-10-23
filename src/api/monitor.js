import request from '@/utils/request'

//版本
let v = "v1"

/**
 * 获取作业ID
 * @param {*} params 查询参数
 */
export function GetTaskID(params) {
  //return fetch('/queryJobInfo', params)
}

/**
 * 获取作业信息
 * 
 */
export function GetTaskNum() {
  return request({
    url: `/api/${v}/jobs/statistics`,
    method: 'get'
  })
}


/**
 * 获取作业信息
 * @param {*} params 查询ID
 */
export function GetTaskList(params) {
  return request({
    url: '/getJobRedisData',
    method: 'get',
    params
  })
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 获取报警信息
 * @param {*} params 查询参数
 */
export function GetAlarmList(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 删除报警
 * @param {*} params 报警参数
 */
export function DeleteAlarm(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 编辑报警备注
 * @param {*} params 报警参数
 */
export function ChangeAlarm(params) {
  //return fetch('/queryJobInfoASK', params)
}