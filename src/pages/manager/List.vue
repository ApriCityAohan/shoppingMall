<template>
    <el-card shadow="never">
        <div class="mb-3">
            <Search :model="searchForm" @search="getData" @reset="handleResetSearch">
                <SearchItem label="关键词">
                    <el-input
                        v-model="searchForm.keyword"
                        placeholder="管理员昵称"
                        clearable
                    ></el-input>
                </SearchItem>
            </Search>
        </div>
        <ListHeader @create="handleAdd" @refresh="getData" />
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
                        <el-button text type="primary" size="small" @click="handleEdit(scope.row)">
                            修改
                        </el-button>
                        <el-popconfirm
                            title="是否要删除该管理员?"
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
import { ref } from 'vue'
import {
    getManagerList,
    updateManagerStatus,
    createManager,
    updateManager,
    deleteManager
} from '~/api/manager.js'
import Drawer from '~/components/Drawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import ListHeader from '~/components/ListHeader.vue'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'

import { initTableData, initForm } from '~/utils/useCommon.js'
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
    },
    delete: deleteManager,
    updateStatus: updateManagerStatus
})
const { drawerRef, formRef, form, rules, drawerTitle, handleAdd, handleEdit, handleSubmit } =
    initForm({
        getData,
        form: {
            username: '',
            password: '',
            avatar: '',
            role_id: '',
            status: 0
        },
        create: createManager,
        update: updateManager,
        loading
    })
// 下拉框数据
const roles = ref([])
</script>

<style scoped></style>
