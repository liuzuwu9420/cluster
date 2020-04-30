import request from '@/utils/request'
const masteragentUrl = `/masteragent/api/v1`

/**
 * 登录
 * @param {*} data 登录参数
 */
export function login(data) {
  return request({
    url: `${masteragentUrl}/ldap/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
