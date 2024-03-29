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
// 审核商品
export function auditGoods(id, ischeck) {
    return axios.post(`/admin/goods/${id}/check`, { ischeck })
}

export function deleteGoods(ids) {
    ids = Array.isArray(ids) ? ids : [ids]
    return axios.post(`/admin/goods/delete_all`, { ids })
}
// 恢复商品
export function restoreGoods(ids) {
    ids = Array.isArray(ids) ? ids : [ids]
    return axios.post(`/admin/goods/restore`, { ids })
}
// 恢复商品
export function destroyGoods(ids) {
    ids = Array.isArray(ids) ? ids : [ids]
    return axios.post(`/admin/goods/destroy`, { ids })
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
// 创建多规格商品规格选项
export function createGoodSku(data) {
    return axios.post(`/admin/goods_skus_card`, data)
}
// 修改商品规格选项
export function updateGoodSkuCard(id, data) {
    return axios.post(`/admin/goods_skus_card/${id}`, data)
}
// 删除商品规格选项
export function deleteGoodSkuCard(id) {
    return axios.post(`/admin/goods_skus_card/${id}/delete`)
}
// 排序商品规格选项
export function sortGoodSkuCard(data) {
    return axios.post(`/admin/goods_skus_card/sort`, data)
}
// 创建多规格商品规格值
export function createGoodSkuValue(data) {
    return axios.post(`/admin/goods_skus_card_value`, data)
}
// 修改商品规格值
export function updateGoodSkuCardValue(id, data) {
    return axios.post(`/admin/goods_skus_card_value/${id}`, data)
}
// 删除商品规格值
export function deleteGoodSkuCardValue(id) {
    return axios.post(`/admin/goods_skus_card_value/${id}/delete`)
}
// 选择设置商品规格选项和值
export function chooseGoodSkuCardValue(id, data) {
    return axios.post(`/admin/goods_skus_card/${id}/set`, data)
}
