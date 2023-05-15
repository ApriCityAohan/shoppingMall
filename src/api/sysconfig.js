import axios from '~/axios'
// 获取系统配置
export function getSysConfig() {
    return axios.get('/admin/sysconfig')
}
// 更新系统配置
export function updateSysConfig() {
    return axios.post('/admin/sysconfig')
}

// 上传文件
export const uploadAction = '/api/admin/sysconfig/upload'
