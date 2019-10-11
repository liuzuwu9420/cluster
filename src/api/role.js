import {fetch} from '@/utils/request'

/**
 * 获取用户信息
 * @param {*} params 查询参数
 */
export function GetList(params) {
  return fetch('/queryJobInfoASK', params)
}

/**
 * 创建用户
 * @param {*} params 用户参数
 */
export function CreateUser(params) {
  return fetch('/queryJobInfoASK', params)
}

/**
 * 删除用户
 * @param {*} params 用户参数
 */
export function DeleteUser(params) {
  return fetch('/queryJobInfoASK', params)
}

/**
 * 修改用户
 * @param {*} params 用户参数
 */
export function ChangeUser(params) {
  return fetch('/queryJobInfoASK', params)
}