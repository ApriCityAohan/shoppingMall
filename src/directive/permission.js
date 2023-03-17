import store from '~/store/index.js'
function hasPermission(el, value) {
    // console.log(value)
    if (!Array.isArray(value)) {
        throw new Error('需要配置权限')
    }
    const hasAuth = value.findIndex(v => store.state.ruleNames.includes(v)) !== -1
    if (el && !hasAuth) {
        el.parentNode && el.parentNode.removeChild(el)
    }
    return hasAuth
}
export default {
    install(app) {
        app.directive('permission', (el, binding) => {
            hasPermission(el, binding.value)
        })
    }
}
