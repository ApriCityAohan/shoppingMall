import axios from '~/axios'

export function getStatistics1() {
    return axios.get('/admin/statistics1')
}
export function getStatistics3(type) {
    return axios.get('/admin/statistics3?type=' + type)
}
