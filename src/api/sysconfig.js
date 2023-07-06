import axios from '~/axios'
// 获取系统配置
export function getSysConfig() {
    return axios.get('/admin/sysconfig')
}
// 更新系统配置
export function updateSysConfig(data) {
    return axios.post('/admin/sysconfig', data)
}

// 上传文件
export const uploadAction = import.meta.env.VITE_APP_BASE_API + '/admin/sysconfig/upload'
