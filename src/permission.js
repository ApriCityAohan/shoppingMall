import { router, addRoutes } from '~/router'
import { getToken } from '~/utils/auth'
import { toast, showLoading, hideLoading } from '~/utils/util'
import store from './store'
let hasGetInfo = false
router.beforeEach(async (to, from, next) => {
    // 显示全屏Loading
    showLoading()
    const token = getToken()
    // 监测是否有token，没有则跳转到登录页
    if (!token && to.path !== '/login') {
        toast('请先登录', 'error')
        return next({ path: '/login' })
    }
    // 监测重复登入
    if (token && to.path === '/login') {
        toast('请勿重复登入', 'error')
        return next({ path: from.path ? from.path : '/' })
    }
    let hasNewRoute = false
    // 监测是否有token，有则获取用户信息
    if (token && !hasGetInfo) {
        const { menus } = await store.dispatch('getUserInfo')
        hasGetInfo = true
        hasNewRoute = addRoutes(menus)
    }
    const title = (to.meta.title ? to.meta.title : '') + ' - 雷雷商城管理系统'
    document.title = title
    hasNewRoute ? next(to.fullPath) : next()
})
// 全局后置守卫
router.afterEach((to, from) => {
    hideLoading()
})
