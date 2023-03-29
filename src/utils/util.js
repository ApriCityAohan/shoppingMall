import { ElNotification, ElMessageBox } from 'element-plus'
import nprogress from 'nprogress'
// 显示右上提示信息
export function toast(message, type = 'success', dangerouslyUseHTMLString = true) {
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000
    })
}
// 提示框
export function showToastBox(content = '提示内容', title = 'warning', type = 'warning') {
    return ElMessageBox.confirm(content, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type
    })
}
// 显示全屏Loading
export function showLoading() {
    nprogress.start()
}
// 隐藏全屏Loading
export function hideLoading() {
    nprogress.done()
}
// 显示输入框
export function showPrompt(title, value = '') {
    return ElMessageBox.prompt(title, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: value
    })
}
export function queryParse(query) {
    const q = []
    for (const key in query) {
        if (query[key]) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r = q.join('&')
    r = r ? '?' + r : ''
    return r
}
