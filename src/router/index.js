import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '~/pages/index.vue'
import NotFound from '~/pages/404/404.vue'
import Login from '~/pages/login/Login.vue'
const routes = [
    {
        path: '/',
        component: Index,
        children: [
            {
                path: '',
                component: () => import('~/pages/home/Home.vue'),
                meta: { title: '后台首页' }
            },
            {
                path: '/goods/list',
                component: () => import('~/pages/goods/List.vue'),
                meta: { title: '商品管理' }
            }
        ]
    },
    { path: '/login', name: 'Login', component: Login, meta: { title: '登入页' } },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: '404' } }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router
