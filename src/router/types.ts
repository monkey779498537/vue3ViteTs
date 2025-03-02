import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 扩展路由元信息
    requiresAuth?: boolean
    roles?: string[]
    // 添加更多自定义元字段...
  }
}