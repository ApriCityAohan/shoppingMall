import axios from '~/axios'

export function getImagesClass(page) {
    return axios.get('/admin/image_class/' + page)
}
