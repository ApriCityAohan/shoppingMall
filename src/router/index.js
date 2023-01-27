import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '~/pages/index.vue'
import NotFound from '~/pages/404/404.vue'
import Login from '~/pages/login/Login.vue'
const routes = [
    {
        path: '/',
        name: 'admin',
        component: Index
    },
    { path: '/login', name: 'Login', component: Login, meta: { title: '登入页' } },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: '404' } }
]
const routeVlaue = [
    {
        path: '/',
        name: '/',
        component: () => import('~/pages/home/Home.vue'),
        meta: { title: '后台首页' }
    },
    {
        path: '/goods/list',
        name: '/goods/list',
        component: () => import('~/pages/goods/List.vue'),
        meta: { title: '商品管理' }
    }
]
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export function addRoutes(menus) {
    let hasNewRoute = false
    const findAddRoute = arr => {
        arr.forEach(i => {
            const item = routeVlaue.find(j => j.path === i.frontpath)
            if (item && !router.hasRoute(item.path)) {
                router.addRoute('admin', item)
                hasNewRoute = true
            }
            if (i.child && i.child.length > 0) {
                findAddRoute(i.child)
            }
        })
    }
    findAddRoute(menus)
    console.log(router.getRoutes())
    return hasNewRoute
}
