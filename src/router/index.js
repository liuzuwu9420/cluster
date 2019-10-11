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
	},
	/*{
	  path: '/documentation',
	  component: Layout,
	  children: [
	    {
	      path: 'index',
	      component: () => import('@/views/documentation/index'),
	      name: 'Documentation',
	      meta: { title: 'documentation', icon: 'documentation', affix: true }
	    }
	  ]
	},
	{
	  path: '/guide',
	  component: Layout,
	  redirect: '/guide/index',
	  children: [
	    {
	      path: 'index',
	      component: () => import('@/views/guide/index'),
	      name: 'Guide',
	      meta: { title: 'guide', icon: 'guide', noCache: true }
	    }
	  ]
	},*/
	{
		path: '/profile',
		component: Layout,
		redirect: '/profile/index',
		hidden: true,
		children: [{
			path: 'index',
			component: () =>
				import('@/views/profile/index'),
			name: 'Profile',
			meta: {
				title: 'profile',
				icon: 'user',
				noCache: true
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
					title: '所有设备',
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
			},
			{
				path: 'add',
				name: 'device.add',
				component: () =>
					import('@/views/device/add'),
				hidden: false,
				meta: {
					title: '批量添加设备',
					icon: 'edit'
				}
			}
		]
	},
	
	//监控列表
	{
	  path: '/monitor',
		component: Layout,
		redirect: '/monitor/taskList',
		name: 'monitor',
		meta: {
			title: '监控',
			icon: 'example'
		},
	  children: [
	    {
	      path: 'taskList',
	      component: () => import('@/views/monitor/taskList'),
	      name: 'monitor.taskList',
	      meta: { title: '作业信息', icon: 'skill' }
			},
			{
	      path: 'alarmList',
	      component: () => import('@/views/monitor/alarmList'),
	      name: 'monitor.alarmList',
	      meta: { title: '报警信息', icon: 'bug' }
	    }
	  ]
	},

	{
		path: '/icon',
		component: Layout,
		children: [{
			path: 'index',
			component: () =>
				import('@/views/icons/index'),
			name: 'Icons',
			meta: {
				title: 'icons',
				icon: 'icon',
				noCache: true
			}
		}]
	},
	/*{
		path: '/permission',
		component: Layout,
		redirect: '/permission/page',
		alwaysShow: true, // will always show the root menu
		name: 'Permission',
		meta: {
			title: 'permission',
			icon: 'lock',
			roles: ['admin', 'editor'] // you can set roles in root nav
		},
		children: [{
				path: 'page',
				component: () =>
					import('@/views/permission/page'),
				name: 'PagePermission',
				meta: {
					title: 'pagePermission',
					roles: ['admin'] // or you can only set roles in sub nav
				}
			},
			{
				path: 'directive',
				component: () =>
					import('@/views/permission/directive'),
				name: 'DirectivePermission',
				meta: {
					title: 'directivePermission'
					// if do not set roles, means: this page does not require permission
				}
			},
			{
				path: 'role',
				component: () =>
					import('@/views/permission/role'),
				name: 'RolePermission',
				meta: {
					title: 'rolePermission',
					roles: ['admin']
				}
			}
		]
	},

	{
	  path: '/example',
	  component: Layout,
	  redirect: '/example/list',
	  name: 'Example',
	  meta: {
	    title: 'example',
	    icon: 'example'
	  },
	  children: [
	    {
	      path: 'create',
	      component: () => import('@/views/example/create'),
	      name: 'CreateArticle',
	      meta: { title: 'createArticle', icon: 'edit' }
	    },
	    {
	      path: 'edit/:id(\\d+)',
	      component: () => import('@/views/example/edit'),
	      name: 'EditArticle',
	      meta: { title: 'editArticle', noCache: true, activeMenu: '/example/list' },
	      hidden: true
	    },
	    {
	      path: 'list',
	      component: () => import('@/views/example/list'),
	      name: 'ArticleList',
	      meta: { title: 'articleList', icon: 'list' }
	    }
	  ]
	},

	

	{
	  path: '/tab',
	  component: Layout,
	  children: [
	    {
	      path: 'index',
	      component: () => import('@/views/tab/index'),
	      name: 'Tab',
	      meta: { title: 'tab', icon: 'tab' }
	    }
	  ]
	},

	{
		path: '/error',
		component: Layout,
		redirect: 'noRedirect',
		name: 'ErrorPages',
		meta: {
			title: 'errorPages',
			icon: '404'
		},
		children: [{
				path: '401',
				component: () =>
					import('@/views/error-page/401'),
				name: 'Page401',
				meta: {
					title: 'page401',
					noCache: true
				}
			},
			{
				path: '404',
				component: () =>
					import('@/views/error-page/404'),
				name: 'Page404',
				meta: {
					title: 'page404',
					noCache: true
				}
			}
		]
	},

	{
		path: '/error-log',
		component: Layout,
		children: [{
			path: 'log',
			component: () =>
				import('@/views/error-log/index'),
			name: 'ErrorLog',
			meta: {
				title: 'errorLog',
				icon: 'bug'
			}
		}]
	},

	{
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'mergeHeader' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'exportZip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'pdf', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard' }
      }
    ]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/i18n-demo/index'),
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  },
*/
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