/**
 * ①添
 * @@新增 定义初始化菜单
 */
import lazyLoading from './lazy-loading'
import Main from '@/components/main' // Main 是架构组件，不在后台返回，在文件里单独引入

// 加载路由菜单,从localStorage拿到路由,在创建路由时使用
export const dynamicRouterAdd = () => {
  let data = sessionStorage.getItem('dynamicRouter')
  if (!data) {
    return []
  }
  return filterAsyncRouter(JSON.parse(data))
}

// @函数: 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (asyncRouterMap) => {
  let accessedRouters = []
  if (asyncRouterMap) {
    asyncRouterMap.filter(route => {
      if (route.show === 1) {
        let accessedRouter = {}
        accessedRouter.path = route.router
        accessedRouter.name = route.title
        accessedRouter.meta = {
          icon: route.icon,
          title: route.title,
          hideInMenu: false
        }
        if (route.component === '') {
          accessedRouter.component = Main
        } else {
          let allowsRoute = ['interface/request','interface/response','saas/request','saas/response']
          if (allowsRoute.includes(route.component)) {
            accessedRouter.meta.hideInMenu = true
          }
          accessedRouter.component = lazyLoading(route.component)
        }
        if (route.children && route.children.length) {
          accessedRouter.children = filterAsyncRouter(route.children)
        }
        if (route.router === 'interfaceList' || route.router === 'appsList') {
          accessedRouter.meta.keepAlive = true
        }
        accessedRouters.push(accessedRouter)
      }
    })
  }
  return accessedRouters
}
