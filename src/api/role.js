import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */

/**
 * 获取用户信息
 * @param {*} params 查询参数
 */
export function GetUserList(params) {
  return request({
    url: `/users`,
    method: 'get',
    params
  })
}

/**
 * 根据ID查询用户(无用)
 * @id {*} id 查询ID
 */
export function GetIDUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

/**
 * 根据ID查询用户所属用户组
 * @id {*} id 查询ID
 */
export function GetIDUserGroup(id) {
  return request({
    url: `/users/${id}/groups`,
    method: 'get'
  })
}

/**
 * 根据ID查询用户所属计费组
 * @id {*} id 查询ID
 */
export function GetIDUserBill(id) {
  return request({
    url: `/users/${id}/chargedgroups`,
    method: 'get'
  })
}

/**
 * 创建用户
 * @param {*} data 用户参数
 */
export function CreateUser(data) {
  return request({
    url: `/hosts`,
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param {*} uuid 用户ID
 */
export function DeleteUser(uuid) {
  return request({
    url: `/hosts/${uuid}`,
    method: 'delete'
  })
}

/**
 * 修改用户
 * @param {*} params 用户参数
 */
export function ChangeUser(data) {
  return request({
    url: `/hosts`,
    method: 'post',
    data
  })
}

/**
 * 获取计费组信息
 * @param {*} params 查询参数
 */
export function GetBillList(params) {
  return request({
    url: `/chargedgroups`,
    method: 'get',
    params
  })
}

/**
 * 创建计费组
 * @param {*} data 计费组参数
 */
export function CreateBill(data) {
  return request({
    url: `/chargedgroups`,
    method: 'post',
    data
  })
}

/**
 * 根据计费组UUID查询其所有的用户
 * @param {*} uuid 计费组uuid
 * @param {*} params 用户参数
 */
export function GetBillUser(uuid, params) {
  return request({
    url: `/chargedgroups/${uuid}/users`,
    method: 'get',
    params
  })
}

/**
 * 修改用户所在计费组
 * @param {*} data 修改参数
 */
export function ChangeBillUser(data) {
  return request({
    url: `/chargedgroups/user`,
    method: 'post',
    data
  })
}

/**
 * 删除计费组
 * @param {*} uuid 计费组uuid
 */
export function DeleteBillGroup(uuid) {
  return request({
    url: `/chargedgroups/${uuid}`,
    method: 'delete'
  })
}

/**
 * 删除计费组中的用户
 * @param {*} id 用户ID
 */
export function DeleteBillGroupUser(id) {
  return request({
    url: `/chargedgroups/user/${id}`,
    method: 'delete'
  })
}

/**
 * 获取用户组信息
 * @param {*} params 查询参数
 */
export function GetUserGroupList(params) {
  return request({
    url: `/groups`,
    method: 'get',
    params
  })
}

/**
 * 根据ID获取用户组信息(无用)
 * @id {*} id 用户组id
 */
export function GetGroupIDList(id) {
  return request({
    url: `/groups/${id}`,
    method: 'get'
  })
}

/**
 * 根据ID获取用户信息
 * @id {*} id 用户组id
 * @param {*} params 用户参数
 */
export function GetGroupIDUser(id, params) {
  return request({
    url: `/groups/${id}/users`,
    method: 'get',
    params
  })
}

/**
 * 创建用户组
 * @param {*} data 用户组参数
 */
export function CreateUserGroup(data) {
  return request({
    url: `/hosts`,
    method: 'post',
    data
  })
}

/**
 * 删除用户组
 * @param {*} uuid 用户组id
 */
export function DeleteUserGroup(uuid) {
  return request({
    url: `/hosts/${uuid}`,
    method: 'delete'
  })
}

/**
 * 修改用户组
 * @param {*} data 用户组参数
 */
export function ChangeUserGroup(data) {
  return request({
    url: `/hosts`,
    method: 'post',
    data
  })
}
