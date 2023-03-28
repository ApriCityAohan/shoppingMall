import axios from '~/axios'
export function getCouponList(page) {
    return axios.get(`/admin/coupon/${page}`)
}
export function createCoupon(data) {
    return axios.post(`/admin/coupon`, data)
}
export function updateCoupon(id, data) {
    return axios.post(`/admin/notice/${id}`, data)
}
export function deleteCoupon(id) {
    return axios.post(`/admin/notice/${id}/delete`)
}
export function updateSkuStatus(id, status) {
    return axios.post(`/admin/coupon/${id}/update_status`, { status })
}
