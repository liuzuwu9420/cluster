import {fetch} from '@/utils/request'

/**
 * 获取计费信息
 * @param {*} params 查询参数
 */
export function GetBillList(params) {
  return fetch('/queryJobInfoASK', params)
}

/**
 * 创建计费组
 * @param {*} params 计费组参数
 */
export function CreateBill(params) {
  return fetch('/queryJobInfoASK', params)
}

/**
 * 删除计费组
 * @param {*} params 计费组参数
 */
export function DeleteBill(params) {
  return fetch('/queryJobInfoASK', params)
}

/**
 * 修改计费组
 * @param {*} params 计费组参数
 */
export function ChangeBill(params) {
  return fetch('/queryJobInfoASK', params)
}