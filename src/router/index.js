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
    },
    {
        path: '/category/list',
        name: '/category/list',
        component: () => import('~/pages/category/List.vue'),
        meta: { title: '商品分类' }
    },
    {
        path: '/user/list',
        name: '/user/list',
        component: () => import('~/pages/user/List.vue'),
        meta: { title: '用户列表' }
    },
    {
        path: '/order/list',
        name: '/order/list',
        component: () => import('~/pages/order/List.vue'),
        meta: { title: '订单列表' }
    },
    {
        path: '/manager/list',
        name: '/manager/list',
        component: () => import('~/pages/manager/List.vue'),
        meta: { title: '管理员管理' }
    },
    {
        path: '/comment/list',
        name: '/comment/list',
        component: () => import('~/pages/comment/List.vue'),
        meta: { title: '评价列表' }
    },
    {
        path: '/image/list',
        name: '/image/list',
        component: () => import('~/pages/image/List.vue'),
        meta: { title: '图库列表' }
    },
    {
        path: '/notice/list',
        name: '/notice/list',
        component: () => import('~/pages/notice/List.vue'),
        meta: { title: '公告列表' }
    },
    {
        path: '/coupon/list',
        name: '/coupon/list',
        component: () => import('~/pages/coupon/List.vue'),
        meta: { title: '优惠券列表' }
    },
    {
        path: '/setting/base',
        name: '/setting/base',
        component: () => import('~/pages/setting/Base.vue'),
        meta: { title: '设置列表' }
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
    // console.log(router.getRoutes())
    return hasNewRoute
}
