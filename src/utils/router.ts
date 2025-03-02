import type { RouteRecordRaw } from 'vue-router'

// 路由合并处理器
export function combineModuleRoutes(modules: Record<string, any>): RouteRecordRaw[] {
  return Object.values(modules)
    .map(module => module.default)
    .flat()
    .sort((a, b) => (a.meta?.order || 0) - (b.meta?.order || 0))
}

// 自动生成路由名称（可选）
export function generateRouteName(path: string): string {
  return path.split('/').filter(Boolean).join('-') || 'root'
}
