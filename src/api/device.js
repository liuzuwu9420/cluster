import request from '@/utils/request'
const masteragentUrl = `/masteragent/api/v1`

/**
 * 获取所有节点简单信息
 * @param {*} params 节点参数
 */
export function GetList(params) {
  return request({
    url: `${masteragentUrl}/hosts`,
    method: 'get',
    params
  })
}

/**
 * 根据节点名获取节点详细信息
 * @param {*} name 节点名
 */
export function GetNodeInfo(name) {
  return request({
    url: `${masteragentUrl}/hosts/${name}/info`,
    method: 'get'
  })
}

/**
 * 根据节点名获取节点详细信息
 * @param {*} name 节点名
 */
export function GetXcatInfo() {
  return request({
    url: `/xcatws/nodes/all`,
    method: 'get'
  })
}

/**
 * 根据节点名获取节点详细信息
 * @param {*} name 节点名
 */
export function GetNodeXcatInfo(name, param) {
  if (param) {
    param = `/${param}`
  }
  return request({
    url: `/xcatws/nodes/${name}/vitals${param}`,
    method: 'get'
  })
}
