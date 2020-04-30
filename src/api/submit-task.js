import request from '@/utils/request'
const lsfAgentUrl = `/lsfagent/api/v1`

/**
 * 模板提交作业
 * @param {*} data lsfserver参数
 */
export function addLsfserver(data) {
  return request({
    url: `${lsfAgentUrl}/lsf/exec/bsub`,
    method: 'post',
    data
  })
}

/**
 * 命令行提交作业
 * @param {*} data lsfserver参数
 */
export function addLsfserverShell(data) {
  return request({
    url: `${lsfAgentUrl}/exec`,
    method: 'post',
    data
  })
}
