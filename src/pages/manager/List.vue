<template>
    <el-card shadow="never">
        <div class="mb-3">
            <el-form :model="searchForm" label-width="80px" size="small">
                <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item label="关键词">
                            <el-input
                                v-model="searchForm.keyword"
                                placeholder="管理员昵称"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :offset="8">
                        <div class="flex items-center justify-end">
                            <el-button type="primary" @click="getData">搜索</el-button>
                            <el-button @click="handleResetSearch">重置</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="flex justify-between items-center mb-3">
            <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
            <el-button text size="small" @click="getData">
                <el-icon :size="20"><Refresh /></el-icon>
            </el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <el-table-column label="管理员" width="280">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar">
                            <img
                                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                            />
                        </el-avatar>
                        <div class="ml-3">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="所属角色" width="230" align="center">
                <template #default="{ row }">
                    <span>{{ row.role?.name || '-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <el-switch
                        :model-value="row.status"
                        :active-value="1"
                        :inactive-value="0"
                        :loading="row.statusLoading"
                        :disabled="row.super === 1 ?? false"
                        @change="handleStatusChange($event, row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="right">
                <template #default="scope">
                    <small v-if="scope.row.super === 1 ?? false" class="text-sm text-gray-500">
                        暂无操作
                    </small>
                    <div v-else>
                        <el-button
                            text
                            type="primary"
                            size="small"
                            @click="handleNoticeEdit(scope.row)"
                        >
                            修改
                        </el-button>
                        <el-popconfirm
                            title="是否要删除该管理员?"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            @confirm="handleNoticeDelete(scope.row.id)"
                        >
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
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
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <ChooseImage v-model="form.avatar" />
                </el-form-item>
                <el-form-item label="所属角色" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="选择所属角色">
                        <el-option
                            v-for="item in roles"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </Drawer>
    </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
    getManagerList,
    updateManagerStatus,
    createManager,
    updateManager,
    deleteManager
} from '~/api/manager.js'
import Drawer from '~/components/Drawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import { toast } from '~/utils/util.js'
import { initTableData } from '~/utils/useCommon.js'
const { searchForm, handleResetSearch, tableData, loading, currentPage, total, limit, getData } =
    initTableData({
        getListFun: getManagerList,
        searchForm: {
            keyword: ''
        },
        onGetListSuccess: res => {
            tableData.value = res.list.map(o => {
                o.statusLoading = false
                return o
            })
            total.value = res.totalCount
            roles.value = res.roles
        }
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
    username: '',
    password: '',
    avatar: '',
    role_id: null,
    status: 0
})
// 下拉框数据
const roles = ref([])
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
        username: '',
        password: '',
        avatar: '',
        role_id: null,
        status: 1
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
    deleteManager(id)
        .then(res => {
            toast('删除成功')
            getData(currentPage.value)
        })
        .finally(() => {
            loading.value = false
        })
}
// 修改管理员状态
const handleStatusChange = (status, row) => {
    row.statusLoading = true
    updateManagerStatus(row.id, status)
        .then(res => {
            toast('修改状态成功')
            row.status = status
        })
        .finally(() => {
            row.statusLoading = false
        })
}
// 提交表单
const handleSubmit = () => {
    formRef.value.validate(valid => {
        if (!valid) return false
        drawerRef.value.loadOn()
        loading.value = true
        const fun = editId.value ? updateManager(editId.value, form) : createManager(form)
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
