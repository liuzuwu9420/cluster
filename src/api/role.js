import request from '@/utils/request'

//版本
let v = "v1"

/**
 * 获取用户信息
 * 
 */
export function GetUserList() {
  return request({
    url: `/api/${v}/users`,
    method: 'get'
  })
}

/**
 * 根据ID查询用户
 * @id {*} id 查询ID
 */
export function GetIDUser(id) {
  return request({
    url: `/api/${v}/users/${id}`,
    method: 'get'
  })
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
 * 
 */
export function GetUserGroupList() {
  return request({
    url: `/api/${v}/groups`,
    method: 'get'
  })
}

/**
 * 根据ID获取用户组信息
 * @id {*} id 用户组id
 */
export function GetGroupIDList(id) {
  return request({
    url: `/api/${v}/groups/${id}`,
    method: 'get'
  })
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