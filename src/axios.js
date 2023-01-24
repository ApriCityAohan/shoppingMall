import axios from 'axios'
import { toast } from '~/utils/util'
import { getToken } from '~/utils/auth'
import store from '~/store'

const instance = axios.create({ baseURL: '/api' })
// 添加请求拦截器
instance.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        const token = getToken()
        if (token) {
            config.headers.token = token
        }
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response.data.data
    },
    function (error) {
        const msg = error.response.data.msg || '网络错误'
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        if (msg === '非法token，请先登录！') {
            store.dispatch('logout').finally(() => location.reload())
        }
        toast(msg, 'error')
        return Promise.reject(error)
    }
)
export default instance
