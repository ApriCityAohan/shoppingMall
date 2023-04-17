<template>
    <el-card shadow="never">
        <ListHeader @create="handleAdd" @refresh="getData" />
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="会员等级" align="center" />
            <el-table-column prop="discount" label="折扣率(%)" align="center" />
            <el-table-column prop="level" label="等级序号" align="center" />
            <el-table-column label="状态" width="120" align="center">
                <template #default="{ row }">
                    <el-switch
                        :model-value="row.status"
                        :active-value="1"
                        :inactive-value="0"
                        :loading="row.statusLoading"
                        @change="handleStatusChange($event, row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click="handleEdit(scope.row)">
                        修改
                    </el-button>
                    <el-popconfirm
                        title="是否要删除该会员?"
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
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="等级权重">
                    <el-input
                        v-model="form.level"
                        placeholder="角色名称"
                        type="number"
                        style="width: 50%"
                    ></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="升级条件">
                    <div class="mb-2">
                        <small class="text-xs mr-2">累计消费满</small>
                        <el-input
                            v-model="form.max_price"
                            size="small"
                            type="number"
                            style="width: 50%"
                        >
                            <template #append> 元 </template>
                        </el-input>
                        <small class="text-xs flex text-gray-400">
                            设置会员等级所需要的累计消费必须大于等于0,单位：元
                        </small>
                    </div>
                    <div>
                        <small class="text-xs mr-2">累计次数满</small>
                        <el-input
                            v-model="form.max_times"
                            size="small"
                            type="number"
                            style="width: 50%"
                        >
                            <template #append> 次 </template>
                        </el-input>
                        <small class="text-xs flex text-gray-400">
                            设置会员等级所需要的购买量必须大于等于0,单位：笔
                        </small>
                    </div>
                </el-form-item>
                <el-form-item label="折扣率(%)">
                    <el-input v-model="form.discount" size="small" style="width: 50%">
                        <template #append> % </template>
                    </el-input>
                    <small class="text-gray-400 flex leading-tight">
                        折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买
                    </small>
                </el-form-item>
            </el-form>
        </Drawer>
    </el-card>
</template>

<script setup>
import {
    getUserLevelList,
    createUserLevel,
    updateUserLevel,
    deleteUserLevel,
    updateUserLevelStatus
} from '~/api/level.js'
import Drawer from '~/components/Drawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import { initTableData, initForm } from '~/utils/useCommon.js'
const { tableData, loading, currentPage, total, limit, getData, handleDelete, handleStatusChange } =
    initTableData({
        getListFun: getUserLevelList,
        delete: deleteUserLevel,
        updateStatus: updateUserLevelStatus,
        onGetListSuccess: res => {
            tableData.value = res.list.map(o => {
                o.statusLoading = false
                return o
            })
            total.value = res.totalCount
        }
    })
const { drawerRef, formRef, form, rules, drawerTitle, handleAdd, handleEdit, handleSubmit } =
    initForm({
        getData,
        form: {
            name: '',
            level: 0,
            discount: 0,
            max_price: 0,
            max_times: 0,
            status: 1
        },
        rules: {
            name: [
                {
                    required: true,
                    message: '角色名称不能为空！',
                    trigger: 'blur'
                }
            ]
        },
        create: createUserLevel,
        update: updateUserLevel,
        loading
    })
</script>

<style scoped></style>
