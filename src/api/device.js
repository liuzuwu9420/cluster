import request from '@/utils/request'

//版本
let v = "v1"

/**
 * 获取所有节点简单信息
 * 
 */
export function GetList() {
  return request({
    url: `/api/${v}/hosts`,
    method: 'get'
  })
}
/**
 * 根据uuid获取节点信息
 * @param {*} uuid 节点uuid
 */
export function GetNodeList(uuid) {
  return request({
    url: `/api/${v}/hosts/${uuid}`,
    method: 'get'
  })
}

/**
 * 添加节点
 * @param {*} data 节点参数
 */
export function SaveNodeEntity(data) {
  return request({
    url: `/api/${v}/hosts`,
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
    url: `/api/${v}/hosts/${uuid}`,
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


