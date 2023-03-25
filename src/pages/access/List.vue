<!-- eslint-disable vue/no-unused-vars -->
<template>
    <el-card shadow="never">
        <ListHeader @refresh="getData" />
        <el-tree
            v-loading="loading"
            :data="tableData"
            :props="{ label: 'name', children: 'child' }"
            node-key="id"
            :default-expanded-keys="defaultExpandedKeys"
            :expand-on-click-node="false"
        >
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <el-tag :type="data.menu ? '' : 'info'" size="small">{{
                        data.menu ? '菜单' : '权限'
                    }}</el-tag>
                    <el-icon v-if="data.icon" size="16" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <span class="ml-2">{{ data.name }}</span>
                    <div class="ml-auto">
                        <el-switch :model-value="data.status" :active-value="1" :inactive-value="0">
                        </el-switch>
                        <el-button text type="primary" size="small">修改</el-button>
                        <el-button text type="primary" size="small">添加</el-button>
                        <el-button text type="primary" size="small">删除</el-button>
                    </div>
                </div>
            </template>
        </el-tree>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import ListHeader from '~/components/ListHeader.vue'
// eslint-disable-next-line no-unused-vars
import { getRuleList } from '~/api/rule'
import { initTableData } from '~/utils/useCommon'

const defaultExpandedKeys = ref([])

const { loading, tableData, getData } = initTableData({
    getListFun: getRuleList,
    onGetListSuccess: res => {
        tableData.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
    }
})
</script>

<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
}
:deep(.el-tree-node__content) {
    @apply py-5;
}
</style>
