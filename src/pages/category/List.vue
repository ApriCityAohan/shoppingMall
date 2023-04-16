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
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="上级菜单" prop="rule_id">
                    <el-cascader
                        v-model="form.rule_id"
                        :options="options"
                        :props="{
                            value: 'id',
                            label: 'name',
                            children: 'child',
                            checkStrictly: true,
                            emitPath: false,
                            expandTrigger: 'hover'
                        }"
                        placeholder="选择上级菜单"
                    />
                </el-form-item>
                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" border>菜单</el-radio>
                        <el-radio :label="0" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name" style="width: 30%">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item v-if="form.menu === 1" label="菜单图标" prop="icon">
                    <IconSelect v-model="form.icon" />
                </el-form-item>
                <el-form-item v-if="form.menu === 0" label="后端规则" prop="frontpath">
                    <el-input v-model="form.frontpath" placeholder="后端规则"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="form.menu === 1 && form.rule_id > 0"
                    label="前端路由"
                    prop="condition"
                >
                    <el-input v-model="form.condition" placeholder="前端路由路径"></el-input>
                </el-form-item>
                <el-form-item v-if="form.menu === 0" label="请求方式" prop="method">
                    <el-select v-model="form.method" placeholder="请选择请求方式">
                        <el-option
                            v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
                            :key="item"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="10000" />
                </el-form-item>
            </el-form>
        </Drawer>
    </el-card>
</template>

<script setup>
// import { ref } from 'vue'
import ListHeader from '~/components/ListHeader.vue'
import Drawer from '~/components/Drawer.vue'
import IconSelect from '~/components/IconSelect.vue'
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
const { drawerRef, formRef, form, rules, drawerTitle, handleAdd, handleEdit, handleSubmit } =
    initForm({
        getData,
        form: {
            rule_id: 0,
            menu: 0,
            name: '',
            condition: '',
            method: '',
            status: 1,
            order: 20,
            icon: '',
            frontpath: ''
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
