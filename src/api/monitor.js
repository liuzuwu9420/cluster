import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */

/**
 * 获取报警信息
 */
export function GetAlarmList() {
  return request({
    url: `/`,
    method: 'get'
  })
}
