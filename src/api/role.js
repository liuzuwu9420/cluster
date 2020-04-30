import request from '@/utils/request'
const lsfAgentUrl = `/lsfagent/api/v1/ladp`

/**
 * 获取用户信息
 * @param {*} params 查询参数
 */
export function GetUserList(params) {
  return request({
    url: `${lsfAgentUrl}/users`,
    method: 'get',
    params
  })
}
