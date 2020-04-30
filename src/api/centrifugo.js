import request from '@/utils/request'
const masteragentUrl = `/masteragent/api/v1`

/**
 * centrifuge Token
 */
export function centrifugeToken() {
  return request({
    url: `${masteragentUrl}/centrifugo/token`,
    method: 'post'
  })
}
