<template>
    <el-card shadow="never">
        <div class="flex justify-between items-center mb-3">
            <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
            <el-button text size="small" @click="getData">
                <el-icon :size="20"><Refresh /></el-icon>
            </el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <el-table-column prop="title" label="公告标题" />
            <el-table-column prop="create_time" label="发布时间" width="320" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button
                        text
                        type="primary"
                        size="small"
                        @click="handleNoticeEdit(scope.row)"
                    >
                        修改
                    </el-button>
                    <el-popconfirm
                        title="是否要删除公告?"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        @confirm="handleNoticeDelete(scope.row.id)"
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
import { ref, reactive, computed } from 'vue'
// eslint-disable-next-line no-unused-vars
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '~/api/notice.js'
import Drawer from '~/components/Drawer.vue'
import { toast } from '~/utils/util.js'
import { initTableData } from '~/utils/useCommon.js'
const { tableData, loading, currentPage, total, limit, getData } = initTableData({
    getListFun: getNoticeList
})
// 抽屉Ref
const drawerRef = ref(null)
// 抽屉标识
const editId = ref(0)
// 抽屉标题
const drawerTitle = computed(() => {
    return editId.value ? '修改' : '新增'
})
// 表单Ref
const formRef = ref(null)
// 表单数据
const form = reactive({
    title: '',
    content: ''
})
// 表单验证规则
const rules = ref({
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
})
function initForm(row = false) {
    if (formRef.value) formRef.value.clearValidate()
    if (row) {
        for (const key in form) {
            form[key] = row[key]
        }
    }
}
// 新增公告
const handleAdd = () => {
    editId.value = 0
    initForm({
        title: '',
        content: ''
    })
    drawerRef.value.open()
}
// 修改公告
const handleNoticeEdit = row => {
    editId.value = row.id
    initForm(row)
    drawerRef.value.open()
}
// 删除公告
const handleNoticeDelete = id => {
    loading.value = true
    deleteNotice(id)
        .then(res => {
            toast('删除成功')
            getData(currentPage.value)
        })
        .finally(() => {
            loading.value = false
        })
}
// 提交表单
const handleSubmit = () => {
    formRef.value.validate(valid => {
        if (!valid) return false
        drawerRef.value.loadOn()
        loading.value = true
        const fun = editId.value ? updateNotice(editId.value, form) : createNotice(form)
        fun.then(res => {
            toast(drawerTitle.value + '成功')
            getData()
            drawerRef.value.close()
        }).finally(() => {
            drawerRef.value.loadOff()
            loading.value = false
        })
    })
}
</script>

<style scoped></style>
