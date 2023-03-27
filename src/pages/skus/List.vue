<template>
    <el-card shadow="never">
        <ListHeader layout="create,delete,refresh" @create="handleAdd" @refresh="getData" />
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="规格名称" width="150" />
            <el-table-column prop="default" label="规格值" width="250" />
            <el-table-column prop="order" label="排序" width="120" align="center" />
            <el-table-column label="状态" width="120" align="center">
                <template #default="{ row }">
                    <el-switch
                        v-model="row.status"
                        :active-value="1"
                        :inactive-value="0"
                        :loading="row.statusLoading"
                        @change="handleStatusChange($event, row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="right">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click="handleEdit(scope.row)">
                        修改
                    </el-button>
                    <el-popconfirm
                        title="是否要删除公告?"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        @confirm="handleDelete(scope.row.id)"
                    >
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-center items-center mt-5">
            <el-pagination
                v-model:current-page="currentPage"
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="limit"
                @current-change="getData"
            />
        </div>
        <Drawer ref="drawerRef" destroy-on-close :title="drawerTitle" @submit="handleSubmit">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="规格名称" prop="name">
                    <el-input v-model="form.name" placeholder="规格名称"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="10000" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="规格值" prop="default">
                    <TagInput v-model="form.default" />
                </el-form-item>
            </el-form>
        </Drawer>
    </el-card>
</template>

<script setup>
import { getSkuList, createSku, updateSku, deleteSku, updateSkuStatus } from '~/api/skus.js'
import Drawer from '~/components/Drawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import TagInput from '~/components/TagInput.vue'
import { initTableData, initForm } from '~/utils/useCommon.js'
const { tableData, loading, currentPage, total, limit, getData, handleDelete, handleStatusChange } =
    initTableData({
        getListFun: getSkuList,
        delete: deleteSku,
        updateStatus: updateSkuStatus
    })
const { drawerRef, formRef, form, rules, drawerTitle, handleAdd, handleEdit, handleSubmit } =
    initForm({
        getData,
        form: {
            name: '',
            default: '',
            order: 50,
            status: 1
        },
        rules: {
            name: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
            default: [{ required: true, message: '规格值必填', trigger: 'blur' }]
        },
        create: createSku,
        update: updateSku,
        loading
    })
</script>

<style scoped></style>
