import request from '@/utils/request'
const prometheusUrl = `/prometheus/api/v1/query`
const prometheusTimeUrl = `/prometheus/api/v1/query_range`

/**
 * 获取prometheus数据
 * @param {*} params prometheus参数
 */
export function GetPrometheus(params) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取prometheus区间数据
 * @param {*} params prometheus参数
 */
export function GetPrometheusInterval(params) {
  return request({
    url: `${prometheusTimeUrl}`,
    method: 'get',
    params
  })
}

/**
 * 获取内存总数
 * @param {*} params 查询语句
 */
export function GetAllMem(params = { query: 'cluster:memory_total_size_bytes:sum' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}

/**
 * 获取可用内存用量
 * @param {*} params 查询语句
 */
export function GetUnusedMem(params = { query: 'cluster:memory_available_size_bytes:sum' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}

/**
 * 获取集群节点总量
 * @param {*} params 查询语句
 */
export function GetAllNode(params = { query: 'cluster:node:sum' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}

/**
 * 获取集群节点开机数
 * @param {*} params 查询语句
 */
export function GetUsedNode(params = { query: 'cluster:node_up:sum' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}

/**
 * 获取集群存储总量
 * @param {*} params 查询语句
 */
export function GetAllFs(params = { query: 'cluster:filesystem_total_size_bytes:sum' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}

/**
 * 获取集群存储用量
 * @param {*} params 查询语句
 */
export function GetUnusedFs(params = { query: 'cluster:filesystem_available_size_bytes:sum' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}

/**
 * 获取队列运行中作业数
 * @param {*} params 查询语句
 */
export function GetQueueRunJobs(params = { query: 'sort_desc(lsf_queue_rjobs)' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取队列等待中作业数
 * @param {*} params 查询语句
 */
export function GetQueuePendJobs(params = { query: 'sort_desc(lsf_queue_pjobs)' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取节点等待中作业数
 * @param {*} params 查询语句
 */
export function GetHostRunJobs(params = { query: 'sort_desc(lsf_host_rjobs)' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取总节点数量
 * @param {*} params 查询语句
 */
export function GetAllHosts(params = { query: 'count(lsf_host_status)' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取可用节点数量
 * @param {*} params 查询语句
 */
export function GetUnusedHosts(params = { query: 'count(lsf_host_status == 1)' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取最大可使用cpu核数
 * @param {*} params 查询语句
 */
export function GetAllCpu(params = { query: 'sum(lsf_host_max)' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取被使用的cpu核数
 * @param {*} params 查询语句
 */
export function GetUsedCpu(params = { query: 'sum(lsf_host_njobs)' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取运行中的作业数
 * @param {*} params 查询语句
 */
export function GetRunJobs(params = { query: 'lsf_job_rjobs' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取等待中的作业数
 * @param {*} params 查询语句
 */
export function GetPendJobs(params = { query: 'lsf_job_pjobs' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取所有的作业数
 * @param {*} params 查询语句
 */
export function GetTotalJobs(params = { query: 'lsf_jobs_total' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
/**
 * 获取正常完成的作业数
 * @param {*} params 查询语句
 */
export function GetDoneJobs(params = { query: 'lsf_jobs_total{"job_status"="DONE"}' }) {
  return request({
    url: `${prometheusUrl}`,
    method: 'get',
    params
  })
}
