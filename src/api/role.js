import request from '@/utils/request'
//import {fetch} from '@/utils/request'

/**
 * 获取用户信息
 * @param {*} data 查询参数
 */
export function GetUserList(data) {
  return request({
    url: '/queryUserData',
    method: 'post',
    data
  })
  //return fetch('/queryUserData', params)
}

/**
 * 创建用户
 * @param {*} params 用户参数
 */
export function CreateUser(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 删除用户
 * @param {*} params 用户参数
 */
export function DeleteUser(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 修改用户
 * @param {*} params 用户参数
 */
export function ChangeUser(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 获取计费信息
 * @param {*} params 查询参数
 */
export function GetBillList(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 创建计费组
 * @param {*} params 计费组参数
 */
export function CreateBill(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 删除计费组
 * @param {*} params 计费组参数
 */
export function DeleteBill(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 修改计费组
 * @param {*} params 计费组参数
 */
export function ChangeBill(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 获取用户组信息
 * @param {*} data 查询参数
 */
export function GetUserGroupList(data) {
  return request({
    url: '/queryGroupData',
    method: 'post',
    data
  })
  //return fetch('/queryGroupData', params)
}

/**
 * 创建用户组
 * @param {*} params 用户组参数
 */
export function CreateUserGroup(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 删除用户组
 * @param {*} params 用户组参数
 */
export function DeleteUserGroup(params) {
  //return fetch('/queryJobInfoASK', params)
}

/**
 * 修改用户组
 * @param {*} params 用户组参数
 */
export function ChangeUserGroup(params) {
  //return fetch('/queryJobInfoASK', params)
}