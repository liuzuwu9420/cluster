import request from '@/utils/request'
//import {fetch} from '@/utils/request'
/**
 * 获取所有节点简单信息
 * @param {*} params 查询参数
 */
export function GetList(data) {
  return request({
    url: '/selectNodeEntityPage',
    method: 'post',
    data
  })
  //return fetch('/selectNodeEntityPage', params)
}
/**
 * 获取单个节点所有信息
 * @param {*} id 节点ID
 */
export function GetNodeList(id) {
  return request({
    url: `/getNodeInfo/${id}`,
    method: 'get'
  })
  //return fetch('/queryNodeInfo', params)
}

/**
 * 添加节点
 * @param {*} params 节点参数
 */
export function SaveNodeEntity(params) {
  return request({
    url: '/saveNodeEntity',
    method: 'post',
    params
  })
  //return fetch('/saveNodeEntity', params)
}


/**
 * 删除节点
 * @param {*} params 节点ID
 */
export function DeleteEntityOne(params) {
  return request({
    url: '/deleteNodeEntityOne',
    method: 'post',
    params
  })
  //return fetch('/deleteNodeEntityOne', params)
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
  //return fetch('/updateNodeEntityOne', params)
}


