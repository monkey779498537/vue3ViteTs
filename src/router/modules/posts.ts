import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/posts',
    name: 'PostList',
    component: () => import('@/views/PostListView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['admin']
    }
  }
]

export default routes
