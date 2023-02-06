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
            <el-dropdown @command="handleClose">
                <span>
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height: 44px"></div>
</template>

<script setup>
import { useTabList } from '~/utils/useTabList'
const { tabList, activeTab, removeTab, changeTab, handleClose } = useTabList()
// console.log(tabList.value.filter(item => item.path === '/' || item.path === activeTab.value))
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
