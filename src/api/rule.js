import request from '@/utils/request'

/**
 * 获取计费规则信息
 * @param {*} params 查询参数
 */
export function GetBillingRuleList(params) {
  return request({
    url: `/billing/rules`,
    method: 'get',
    params
  })
}
/**
 * 查询规则绑定的组
 * @param {*} uuid 计费规则uuid
 * @param {*} params 查询参数
 */
export function GetBillingRuleGroup(uuid, params) {
  return request({
    url: `/billing/rules/${uuid}/groups`,
    method: 'get',
    params
  })
}

/**
 * 添加计费规则
 * @param {*} data 计费参数
 */
export function CreateBillRule(data) {
  return request({
    url: `/billing/rules`,
    method: 'post',
    data
  })
}

/**
 * 修改计费规则
 * @param {*} data 计费参数
 */
export function ChangeBillRule(data) {
  return request({
    url: `/billing/rules`,
    method: 'put',
    data
  })
}
/**
 * 删除计费规则
 * @param {*} uuid 计费规则uuid
 */
export function DeleteBillRule(uuid) {
  return request({
    url: `/billing/rules/${uuid}`,
    method: 'delete'
  })
}

