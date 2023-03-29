import axios from '~/axios'
import { queryParse } from '~/utils/util'
export function getGoodsList(page, query = {}) {
    const r = queryParse(query)
    return axios.get(`/admin/goods/${page}${r}`)
}

export function updateGoodsStatus(ids, status) {
    return axios.post(`/admin/goods/changestatus`, { ids, status })
}

export function createGoods(data) {
    return axios.post(`/admin/goods`, data)
}

export function updateGoods(id, data) {
    return axios.post(`/admin/goods/${id}`, data)
}

export function deleteGoods(ids) {
    return axios.post(`/admin/goods/delete_all`, { ids })
}
