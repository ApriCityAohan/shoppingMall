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
// 上移动
export function isArrayMoveUp(arr, index) {
    swapArray(arr, index, index - 1)
    console.log(arr)
}
// 下移动
export function isArrayMoveDown(arr, index) {
    swapArray(arr, index, index + 1)
}
// 交换数组元素
function swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    return arr
}
export function cartesianProductOf() {
    return Array.prototype.reduce.call(
        arguments,
        function (a, b) {
            const ret = []
            a.forEach(function (a) {
                b.forEach(function (b) {
                    ret.push(a.concat([b]))
                })
            })
            return ret
        },
        [[]]
    )
}
