import axios from '~/axios'
import { queryParse } from '~/utils/util'
export function getStatistics() {
    return axios.get('/admin/agent/statistics')
}

export function getAgentList(page, query = {}) {
    const r = queryParse(query)
    return axios.get(`/admin/agent/${page}${r}`)
}

export function getAgentOrderList(page, query = {}) {
    const r = queryParse(query)
    return axios.get(`/admin/user_bill/${page}${r}`)
}

// 获取配置
export function getAgentConfig() {
    return axios.get('/admin/distribution_setting/get')
}
// 更新配置
export function updateAgentConfig(data) {
    return axios.post('/admin/distribution_setting/set', data)
}
