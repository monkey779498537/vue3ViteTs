import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { combineModuleRoutes } from '@/utils/router'

// 自动加载模块路由（Vite专属方式）
const moduleRoutes = import.meta.glob<{ default: RouteRecordRaw[] }>('./modules/*.ts', {
  eager: true
})

const routes = combineModuleRoutes(moduleRoutes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 统一配置滚动行为
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

const isLoggedIn = () => localStorage.getItem('token')

const checkUserRoles = (roles: string[]) => {
  // 这是测试代码 真实判断逻辑 按照业务来
  const role = localStorage.getItem('roles') || ''
  return roles.includes(role)
}

// 全局路由守卫
router.beforeEach(to => {
  // 处理未匹配路由
  if (!to.matched.length) return '/404'

  // 身份验证逻辑
  if (to.meta.requiresAuth && !isLoggedIn()) return '/login'

  // 权限校验逻辑
  if (to.meta.roles?.length) {
    return checkUserRoles(to.meta.roles) ? true : '/403'
  }
})

export default router
