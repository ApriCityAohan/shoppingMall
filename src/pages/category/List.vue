<!-- eslint-disable vue/no-unused-vars -->
<template>
    <el-card shadow="never">
        <ListHeader @refresh="getData" @create="handleAdd" />
        <el-tree
            v-loading="loading"
            :data="tableData"
            :props="{ label: 'name', children: 'child' }"
            node-key="id"
            :expand-on-click-node="false"
        >
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <span class="ml-2">{{ data.name }}</span>
                    <div class="ml-auto">
                        <el-button text type="primary" size="small" @click="addChild(data.id)"
                            >推荐商品</el-button
                        >
                        <el-switch
                            :model-value="data.status"
                            :active-value="1"
                            :inactive-value="0"
                            @change="handleStatusChange($event, data)"
                        >
                        </el-switch>
                        <el-button text type="primary" size="small" @click="handleEdit(data)">
                            修改
                        </el-button>
                        <el-popconfirm
                            title="是否要删除该菜单?"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            @confirm="handleDelete(data.id)"
                        >
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </template>
        </el-tree>
        <Drawer ref="drawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form ref="formRef" :model="form" label-width="80px" :inline="false">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="分类名称" />
                </el-form-item>
            </el-form>
        </Drawer>
    </el-card>
</template>

<script setup>
// import { ref } from 'vue'
import ListHeader from '~/components/ListHeader.vue'
import Drawer from '~/components/Drawer.vue'
// eslint-disable-next-line no-unused-vars
import {
    getCategoryList,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory
} from '~/api/category'
import { initTableData, initForm } from '~/utils/useCommon'

const { loading, tableData, getData, handleDelete, handleStatusChange } = initTableData({
    getListFun: getCategoryList,
    onGetListSuccess: res => {
        tableData.value = res
    },
    delete: deleteCategory,
    updateStatus: updateCategoryStatus
})
const { drawerRef, formRef, form, drawerTitle, handleAdd, handleEdit, handleSubmit } = initForm({
    getData,
    form: {
        name: ''
    },
    create: updateCategory,
    update: createCategory,
    loading
})
// 添加子节点
const addChild = id => {
    handleAdd()
    form.rule_id = id
    form.status = 1
}
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
