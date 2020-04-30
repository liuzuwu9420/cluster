import request from '@/utils/request'
const xcatagentUrl = `/masteragent/api/v1`

/**
 * 远程开关机
 * @param {*} data 节点参数
 */
export function hostRemote(data) {
  return request({
    url: `${xcatagentUrl}/exec/rpomer`,
    method: 'post',
    data
  })
}
/**
 * 并行shell
 * @param {*} data 节点参数
 */
export function parallelShell(data) {
  return request({
    url: `${xcatagentUrl}/exec/psh`,
    method: 'post',
    data
  })
}
/**
 * 并行拷贝
 * @param {*} data 节点参数
 */
export function parallelCopy(data) {
  return request({
    url: `${xcatagentUrl}/exec/xdcp`,
    method: 'post',
    data
  })
}
