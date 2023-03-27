<template>
    <el-card shadow="never">
        <ListHeader @create="handleAdd" @refresh="getData" />
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="title" label="规格名称" />
            <el-table-column prop="create_time" label="规格值" />
            <el-table-column prop="create_time" label="排序" />
            <el-table-column prop="create_time" label="状态">
                <template #default="{ row }">
                    <el-switch v-model="row.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
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
        <Drawer ref="drawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input
                        v-model="form.content"
                        :rows="5"
                        type="textarea"
                        placeholder="公告内容"
                    />
                </el-form-item>
            </el-form>
        </Drawer>
    </el-card>
</template>

<script setup>
import { getSkuList, createSku, updateSku, deleteSku, updateSkuStatus } from '~/api/skus.js'
import Drawer from '~/components/Drawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import { initTableData, initForm } from '~/utils/useCommon.js'
const { tableData, loading, currentPage, total, limit, getData, handleDelete } = initTableData({
    getListFun: getSkuList,
    delete: deleteSku,
    updateStatus: updateSkuStatus
})
const { drawerRef, formRef, form, rules, drawerTitle, handleAdd, handleEdit, handleSubmit } =
    initForm({
        getData,
        form: {
            title: '',
            content: ''
        },
        rules: {
            title: [
                {
                    required: true,
                    message: '请输入公告标题',
                    trigger: 'blur'
                }
            ],
            content: [
                {
                    required: true,
                    message: '请输入公告内容',
                    trigger: 'blur'
                }
            ]
        },
        create: createSku,
        update: updateSku,
        loading
    })
</script>

<style scoped></style>
