import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */

/**
 * 获取所有节点简单信息
 * @param {*} params 节点参数
 */
export function GetList(params) {
  return request({
    url: `/hosts`,
    method: 'get',
    params
  })
}
/**
 * 根据uuid获取单个节点(无用)
 * @param {*} uuid 节点uuid
 */
export function GetNodeList(uuid) {
  return request({
    url: `/hosts/${uuid}`,
    method: 'get'
  })
}

/**
 * 根据uuid获取节点详细信息
 * @param {*} uuid 节点uuid
 */
export function GetNodeInfo(uuid) {
  return request({
    url: `/hosts/${uuid}/info`,
    method: 'get'
  })
}

/**
 * 添加节点
 * @param {*} data 节点参数
 */
export function SaveNodeEntity(data) {
  return request({
    url: `/hosts`,
    method: 'post',
    data
  })
}

/**
 * 删除节点
 * @param {*} uuid 节点UUID
 */
export function DeleteEntityOne(uuid) {
  return request({
    url: `/hosts/${uuid}`,
    method: 'delete'
  })
}

/**
 * 修改节点信息
 * @param {*} params 节点参数
 */
export function UpdateEntityOne(params) {
  return request({
    url: '/updateNodeEntityOne',
    method: 'post',
    params
  })
}

