import { createStore } from 'vuex'
import { getInfo, login } from '~/api/manager'
import { setToken, removeToken } from '~/utils/auth'

// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            // 保存用户信息
            user: {},
            // 侧边栏宽度
            menuWidth: '250px'
        }
    },
    mutations: {
        // 修改用户信息
        SET_USER(state, user) {
            state.user = user
        },
        SET_MENU_WIDTH(state) {
            state.menuWidth = state.menuWidth === '250px' ? '60px' : '250px'
        }
    },
    actions: {
        // 获取用户信息
        getUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getInfo()
                    .then(res => {
                        commit('SET_USER', res)
                        resolve(res)
                    })
                    .catch(err => reject(err))
            })
        },
        // 登录
        login({ commit }, { username, password }) {
            return new Promise((resolve, reject) => {
                login(username, password)
                    .then(res => {
                        // 设置cookie
                        setToken(res.token)
                        resolve(res)
                    })
                    .catch(err => reject(err))
            })
        },
        // 退出登录
        logout({ commit }) {
            // 移除cookie
            removeToken()
            // 清空用户信息
            commit('SET_USER', {})
        }
    }
})
export default store
