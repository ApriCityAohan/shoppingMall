<template>
    <div class="f-tab" :style="{ left: $store.state.menuWidth }">
        <el-tabs
            v-model="activeTab"
            type="card"
            style="min-width: 100px"
            @tab-remove="removeTab"
            @tab-change="changeTab"
        >
            <el-tab-pane
                v-for="item in tabList"
                :key="item.path"
                :label="item.title"
                :name="item.path"
                :closable="item.path !== '/'"
            >
            </el-tab-pane>
        </el-tabs>
        <span class="tag-btn">
            <el-dropdown>
                <span>
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>Action 1</el-dropdown-item>
                        <el-dropdown-item>Action 2</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height: 44px"></div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'

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
</script>

<style scoped>
.f-tab {
    @apply fixed bg-gray-100 flex items-center px-2;
    top: 64px;
    right: 0;
    height: 44px;
    z-index: 100;
    transition: all 0.5s;
}
.tag-btn {
    @apply flex items-center justify-center bg-white rounded ml-auto;
    height: 32px;
    width: 32px;
}
:deep(.el-tabs__header) {
    margin: 0;
}
:deep(.el-tabs--card > .el-tabs__header) {
    border: 0 !important;
}
:deep(.el-tabs__nav) {
    border: 0 !important;
    line-height: 40px;
}
:deep(.el-tabs__item) {
    border: 0 !important;
    height: 32px;
    line-height: 32px;
    @apply bg-white mx-1 rounded;
}
:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
    line-height: 44px;
}
</style>
