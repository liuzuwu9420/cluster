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

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 用户
  {
    path: '/role',
    component: Layout,
    redirect: '/role/user',
    name: 'role',
    meta: {
      title: '用户',
      icon: 'user'
    },
    children: [{
      path: 'userGroup',
      name: 'role.userGroup',
      component: () =>
          import('@/views/users/userGroup'),
      meta: {
        title: '用户组',
        icon: 'peoples'
      }
    },
    {
      path: 'user',
      name: 'role.user',
      component: () =>
          import('@/views/users/user'),
      meta: {
        title: '用户',
        icon: 'people'
      }
    },
    {
      path: 'billing',
      name: 'role.billing',
      component: () =>
          import('@/views/users/billing'),
      meta: {
        title: '计费组',
        icon: 'money'
      }
    }
    ]
  },

  // 设备
  {
    path: '/device',
    component: Layout,
    redirect: '/device/list',
    name: 'device',
    meta: {
      title: '设备管理',
      icon: 'iot'
    },
    children: [{
      path: 'list',
      name: 'device.list',
      component: () =>
          import('@/views/device/list'),
      meta: {
        title: '主机',
        icon: 'table'
      }
    },
    {
      path: 'info',
      name: 'device.info',
      component: () =>
          import('@/views/device/info'),
      hidden: true,
      meta: {
        title: '设备详情'
      }
    }
    ]
  },

  // 监控列表
  {
    path: '/task',
    component: Layout,
    redirect: '/task/taskList',
    name: 'task',
    meta: {
      title: '作业',
      icon: 'form'
    },
    children: [{
      path: 'taskList',
      component: () => import('@/views/task/taskList'),
      name: 'task.taskList',
      meta: {
        title: '作业信息',
        icon: 'skill'
      }
    },
    {
      path: 'queueList',
      component: () => import('@/views/task/queueList'),
      name: 'task.queueList',
      meta: {
        title: '队列信息',
        icon: 'queue'
      }
    }
    ]
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
