import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/403.vue'),
        meta: { title: '403页面' }
    }
]

export default routes
