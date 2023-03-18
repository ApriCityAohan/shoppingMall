import axios from '~/axios'
export function getImageList(id, page = 1) {
    return axios.get(`/admin/image_class/${id}/image/${page}`)
}
export function updateImage(id, data) {
    return axios.post(`/admin/image/${id}`, data)
}
export function deleteImage(ids) {
    return axios.get(`/admin/image/delete_all`, { ids })
}
