import axios from '~/axios'
export function getSkuList(page) {
    return axios.get(`/admin/skus/${page}`)
}
export function createSku(data) {
    return axios.post(`/admin/skus`, data)
}
export function updateSku(id, data) {
    return axios.post(`/admin/skus/${id}`, data)
}
export function deleteSku(ids) {
    return axios.post(`/admin/skus/delete_all`, { ids })
}
export function updateSkuStatus(id, status) {
    return axios.post(`/admin/skus/${id}/update_status`, { status })
}
