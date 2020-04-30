import Layout from '@/layout'

const jobRouter = {
  path: '/job',
  component: Layout,
  meta: {
    title: '作业',
    icon: 'form',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'submit-job',
      component: () => import('@/views/job/submit-job'),
      name: 'Submit job',
      meta: {
        title: '提交作业',
        roles: ['admin', 'editor']
      }
    },
    {
      path: 'realtime-jobs',
      component: () => import('@/views/job/realtime-jobs/index'),
      name: 'Realtime jobs',
      meta: {
        title: '实时作业',
        roles: ['admin', 'editor']
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/job/realtime-jobs/list'),
          name: 'Job list',
          meta: {
            title: '列表',
            roles: ['admin', 'editor']
          }
        },
        {
          path: 'host',
          component: () => import('@/views/job/realtime-jobs/host'),
          name: 'Job of host',
          meta: {
            title: '主机作业',
            roles: ['admin']
          }
        },
        {
          path: 'queue',
          component: () => import('@/views/job/realtime-jobs/queue'),
          name: 'Job of queue',
          meta: {
            title: '队列作业',
            roles: ['admin']
          }
        },
        {
          path: 'user',
          component: () => import('@/views/job/realtime-jobs/user'),
          name: 'Job of user',
          meta: {
            title: '用户作业',
            roles: ['admin']
          }
        }
      ]
    },
    {
      path: 'history-jobs',
      component: () => import('@/views/job/history-jobs/index'),
      name: 'History jobs',
      meta: {
        title: '历史作业'
      }
    },
    {
      path: 'queue-config',
      component: () => import('@/views/job/config/queue-config'),
      name: 'Queue config',
      meta: {
        title: '队列配置',
        roles: ['admin']
      }
    }
  ]
}

export default jobRouter
