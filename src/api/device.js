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

/**
 * 对单个主机绑定标签
 * @param  uuid 主机uuid
 * @param data 标签uuid和资源类别 {{LabelUUID,ResourceType}}
 */
export function StickLabelToHost(uuid, data) {
  return request({
    url: `/hosts/${uuid}/labels`,
    method: 'post',
    data
  })
}

/**
 * 获取单个主机所有绑定标签信息
 * @param  uuid hostUUID
 */
export function GetTagOfHost(uuid) {
  return request({
    url: `/hosts/${uuid}/labels`,
    method: 'get'
  })
}

/**
 * 取消单个主机下某个标签的绑定关系
 * @param hostUUID 主机uuid
 * @param labelUUID 标签uuid
 */
export function DeleteTagOfHost(hostUUID, labelUUID) {
  return request({
    url: `/hosts/${hostUUID}/labels/${labelUUID}`,
    method: 'delete'
  })
}

