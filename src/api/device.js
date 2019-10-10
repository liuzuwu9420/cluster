import {fetch} from '@/utils/request'

/**
 * 获取节点信息
 * @param {*} params 查询参数
 */
export function GetList(params) {
  return fetch('/selectNodeEntityPage', params)
}

/**
 * 添加节点
 * @param {*} params 节点参数
 */
export function SaveNodeEntity(params) {
  return fetch('/saveNodeEntity', params)
}


/**
 * 删除节点
 * @param {*} params 节点ID
 */
export function DeleteEntityOne(params) {
  return fetch('/deleteNodeEntityOne', params)
}

/**
 * 修改节点信息
 * @param {*} params 节点参数
 */
export function UpdateEntityOne(params) {
  return fetch('/updateNodeEntityOne', params)
}


