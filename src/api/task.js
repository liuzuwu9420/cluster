import {fetch} from '@/utils/request'

/**
 * 获取作业ID
 * @param {*} params 查询参数
 */
export function GetID(params) {
  return fetch('/queryJobInfo', params)
}

/**
 * 获取作业信息
 * @param {*} params 查询ID
 */
export function GetList(params) {
  return fetch('/queryJobInfoASK', params)
}
