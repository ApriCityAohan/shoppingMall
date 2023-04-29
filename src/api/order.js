import axios from '~/axios'
import { queryParse } from '~/utils/util'
export function getOrderList(page, query = {}) {
    const r = queryParse(query)
    return axios.get(`/admin/order/${page}${r}`)
}
export function deleteOrder(ids) {
    ids = Array.isArray(ids) ? ids : [ids]
    return axios.post(`/admin/goods/delete_all`, { ids })
}
export function exportOrder(query = {}) {
    const r = queryParse(query)
    return axios.post(`/admin/order/excelexport${r}`, {}, { responseType: 'blob' })
}
export function getOrderShip(id) {
    return axios.get(`/admin/order/${id}/get_ship_info`)
}
export function refundOrder(id, data) {
    return axios.post(`/admin/order/${id}/handle_refund`, data)
}
