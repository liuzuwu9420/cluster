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
    url: `/users/${id}/usergroups`,
    method: 'get'
  })
}

/**
 * 根据ID查询用户所属计费组
 * @id {*} id 查询ID
 */
export function GetIDUserBill(id) {
  return request({
    url: `/users/${id}/billinggroups`,
    method: 'get'
  })
}

/**
 * 获取计费组信息
 * @param {*} params 查询参数
 */
export function GetBillList(params) {
  return request({
    url: `/billing/groups`,
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
    url: `/billing/groups`,
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
    url: `/billing/groups/${uuid}/users`,
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
    url: `/billing/groups/user`,
    method: 'post',
    data
  })
}

/**
 * 绑定计费规则和组
 * @param {*} GroupUUID 计费组UUID
 * @param {*} RuleUUID 计费规则UUID
 */
export function ChangeBillGroupRule(GroupUUID, RuleUUID) {
  return request({
    url: `/billing/groups/${GroupUUID}/rules/${RuleUUID}`,
    method: 'post'
  })
}

/**
 * 删除计费组
 * @param {*} uuid 计费组uuid
 */
export function DeleteBillGroup(uuid) {
  return request({
    url: `/billing/groups/${uuid}`,
    method: 'delete'
  })
}

/**
 * 删除计费组中的用户
 * @param {*} id 用户ID
 */
export function DeleteBillGroupUser(id) {
  return request({
    url: `/billing/groups/user/${id}`,
    method: 'delete'
  })
}

/**
 * 获取用户组信息
 * @param {*} params 查询参数
 */
export function GetUserGroupList(params) {
  return request({
    url: `/usergroups`,
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
    url: `/usergroups/${id}`,
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
    url: `/usergroups/${id}/users`,
    method: 'get',
    params
  })
}

