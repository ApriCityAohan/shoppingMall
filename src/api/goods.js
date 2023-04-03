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
    ids = Array.isArray(ids) ? ids : [ids]
    return axios.post(`/admin/goods/delete_all`, { ids })
}
// 获取商品详情
export function readGoods(id) {
    return axios.get(`/admin/goods/read/${id}`)
}
// 设置商品Banner
export function setGoodsBanner(id, data) {
    return axios.post(`/admin/goods/banners/${id}`, data)
}
// 修改商品规格
export function updateGoodSku(id, data) {
    return axios.post(`/admin/goods/updateskus/${id}`, data)
}
