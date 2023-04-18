<template>
    <el-card shadow="never">
        <div class="mb-3">
            <Search :model="searchForm" @search="getData" @reset="handleResetSearch">
                <SearchItem label="关键词">
                    <el-input
                        v-model="searchForm.keyword"
                        placeholder="手机号/邮箱/会员昵称"
                        clearable
                    ></el-input>
                </SearchItem>
                <template #moreSearch>
                    <SearchItem label="会员等级">
                        <el-select
                            v-model="searchForm.user_level_id"
                            placeholder="请选择会员等级"
                            clearable
                        >
                            <el-option
                                v-for="item in userLevelList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </SearchItem>
                </template>
            </Search>
        </div>
        <ListHeader @create="handleAdd" @refresh="getData" />
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <el-table-column label="会员" width="280">
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
            <el-table-column label="会员等级" align="center">
                <template #default="{ row }">
                    <span>{{ row.user_level?.name || '-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="登录注册" align="center">
                <template #default="{ row }">
                    <span class="text-xs">注册时间：{{ row.create_time }}</span>
                    <br />
                    <span class="text-xs">登录时间：{{ row.last_login_time ?? '无记录' }}</span>
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
            <el-table-column label="操作" align="center" width="180">
                <template #default="scope">
                    <small v-if="scope.row.super === 1 ?? false" class="text-sm text-gray-500">
                        暂无操作
                    </small>
                    <div v-else>
                        <el-button text type="primary" size="small" @click="handleEdit(scope.row)">
                            修改
                        </el-button>
                        <el-popconfirm
                            title="是否要删除该用户?"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            @confirm="handleDelete(scope.row.id)"
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
                    <el-input v-model="form.password" placeholder="密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="昵称"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <ChooseImage v-model="form.avatar" />
                </el-form-item>
                <el-form-item label="会员等级" prop="user_level_id">
                    <el-select v-model="form.user_level_id" placeholder="请选择会员等级">
                        <el-option
                            v-for="item in userLevelList"
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
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" type="email"></el-input>
                </el-form-item>
            </el-form>
        </Drawer>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getUserList, updateUserStatus, createUser, updateUser, deleteUser } from '~/api/user.js'
import Drawer from '~/components/Drawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import ListHeader from '~/components/ListHeader.vue'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'

import { initTableData, initForm } from '~/utils/useCommon.js'

// 下拉框数据
const userLevelList = ref([])
const {
    searchForm,
    handleResetSearch,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = initTableData({
    getListFun: getUserList,
    searchForm: {
        keyword: '',
        user_level_id: ''
    },
    onGetListSuccess: res => {
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })
        total.value = res.totalCount
        userLevelList.value = res.user_level
    },
    delete: deleteUser,
    updateStatus: updateUserStatus
})
const { drawerRef, formRef, form, rules, drawerTitle, handleAdd, handleEdit, handleSubmit } =
    initForm({
        getData,
        form: {
            username: '',
            password: '',
            nickname: '',
            phone: '',
            email: '',
            avatar: '',
            user_level_id: '',
            status: 0
        },
        rules: {
            username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                {
                    min: 6,
                    max: 16,
                    message: '密码长度在 6 到 16 个字符',
                    trigger: 'blur'
                }
            ],
            user_level_id: [{ required: true, message: '请选择会员等级', trigger: 'blur' }],
            phone: [
                {
                    pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
                    message: '请输入正确的手机号',
                    trigger: 'blur'
                }
            ],
            email: [{ type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }]
        },
        create: createUser,
        update: updateUser,
        loading
    })
</script>

<style scoped></style>
