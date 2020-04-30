import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () =>
        import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () =>
      import('@/views/login/index'),
  hidden: true
},
{
  path: '/auth-redirect',
  component: () =>
      import('@/views/login/auth-redirect'),
  hidden: true
},
{
  path: '/overview',
  component: () =>
      import('@/components/overview')
},
{
  path: '/404',
  component: () =>
      import('@/views/error-page/404'),
  hidden: true
},
{
  path: '/401',
  component: () =>
      import('@/views/error-page/401'),
  hidden: true
},
{
  path: '',
  component: Layout,
  redirect: 'dashboard',
  children: [{
    path: 'dashboard',
    component: () =>
        import('@/views/dashboard/index'),
    name: 'Dashboard',
    meta: {
      title: 'dashboard',
      icon: 'dashboard',
      affix: true
    }
  }]
}
]

import jobRouter from './modules/job'

export const asyncRoutes = [
  jobRouter,
  {
    path: '/host',
    component: Layout,
    meta: {
      title: '主机',
      icon: 'host',
      roles: ['admin']
    },
    children: [{
      path: 'list',
      component: () =>
          import('@/views/host/list'),
      name: 'Host list',
      meta: { title: '主机列表' }
    },
    {
      path: 'frame',
      component: () =>
          import('@/views/host/frame'),
      name: 'Host frame',
      meta: { title: '机房视图' }
    },
    {
      path: 'deploy',
      component: () =>
          import('@/views/host/deploy'),
      name: 'Host deploy',
      meta: { title: '节点部署' }
    },
    {
      path: 'parallel',
      component: () =>
          import('@/views/host/parallel'),
      name: 'Host parallel processing',
      meta: { title: '并行处理' }
    },
    {
      path: 'info',
      component: () =>
          import('@/views/host/info'),
      name: 'Host info',
      hidden: true,
      meta: { title: '设备详情' }
    }
    ]
  },

  {
    path: '/billing',
    component: Layout,
    meta: {
      title: '计费',
      icon: 'table',
      roles: ['admin']
    },
    children: [{
      path: 'list',
      component: () =>
          import('@/views/billing/list'),
      name: 'billing list',
      meta: { title: '费用列表' }
    },
    {
      path: 'rule',
      component: () =>
          import('@/views/billing/rule'),
      name: 'billing rule',
      meta: { title: '计费规则' }
    },
    {
      path: 'statistics',
      component: () =>
          import('@/views/billing/statistics'),
      name: 'billing statistics',
      meta: { title: '费用统计' }
    }
    ]
  },

  {
    path: '/alarm',
    component: Layout,
    meta: {
      title: '告警',
      icon: 'bell',
      roles: ['admin']
    },
    children: [{
      path: 'list',
      component: () =>
          import('@/views/alarm/list'),
      name: 'Alarm list',
      meta: { title: '告警列表' }
    },
    {
      path: 'rule',
      component: () =>
          import('@/views/alarm/rule'),
      name: 'Alarm rule',
      meta: { title: '告警规则' }
    },
    {
      path: 'notification',
      component: () =>
          import('@/views/alarm/notification'),
      name: 'Notification',
      meta: { title: '接入通知' }
    },
    {
      path: 'addRule',
      component: () =>
          import('@/views/alarm/add-rule'),
      name: 'Add alarm rule',
      hidden: true,
      meta: { title: '添加告警规则' }
    }
    ]
  },

  {
    path: '/user',
    component: Layout,
    meta: {
      title: '用户',
      icon: 'user',
      roles: ['admin']
    },
    children: [{
      path: 'list',
      component: () =>
          import('@/views/user/list'),
      name: 'User list',
      meta: { title: '用户列表' }
    }]
  },

  {
    path: '/about',
    component: Layout,
    children: [{
      path: '/',
      component: () =>
              import('@/views/about/index'),
      name: 'About',
      hidden: true
    }]
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
