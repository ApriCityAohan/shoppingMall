import { ref } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'

export function useTabList() {
    const route = useRoute()
    const router = useRouter()
    const activeTab = ref(route.path)
    const cookies = useCookies()
    const tabList = ref([
        {
            title: '后台首页',
            path: '/'
        }
    ])
    function initTabList() {
        const tabs = cookies.get('tabList')
        if (tabs) {
            tabList.value = tabs
        }
    }
    initTabList()
    function addTab(tab) {
        const index = tabList.value.findIndex(item => item.path === tab.path) === -1
        if (index) {
            tabList.value.push(tab)
        }
        cookies.set('tabList', tabList.value)
    }
    onBeforeRouteUpdate((to, from) => {
        activeTab.value = to.path
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })
    const removeTab = t => {
        const tabs = tabList.value
        const active = activeTab.value
        if (active === t) {
            tabs.forEach((tab, index) => {
                if (tab.path === t) {
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        activeTab.value = nextTab.path
                        router.push({ path: nextTab.path })
                    }
                }
            })
        }
        tabList.value = tabs.filter(tab => tab.path !== t)
        cookies.set('tabList', tabList.value)
    }
    const changeTab = t => {
        console.log(t)
        activeTab.value = t
        router.push({ path: t })
    }

    const handleClose = command => {
        if (command === 'clearAll') {
            // 清空所有
            activeTab.value = '/'
            tabList.value = [
                {
                    title: '后台首页',
                    path: '/'
                }
            ]
        } else if (command === 'clearOther') {
            // 清空其他
            tabList.value = tabList.value.filter(
                item => item.path === '/' || item.path === activeTab.value
            )
        }
        cookies.set('tabList', tabList.value)
    }
    return {
        activeTab,
        tabList,
        removeTab,
        changeTab,
        handleClose
    }
}
