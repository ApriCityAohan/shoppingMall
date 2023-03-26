<template>
    <el-card shadow="never">
        <ListHeader @create="handleAdd" @refresh="getData" />
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="角色名称" width="200" />
            <el-table-column prop="desc" label="角色描述" width="380" />
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
            <el-table-column label="操作" align="right">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click="openSetRole(scope.row)">
                        配置权限
                    </el-button>
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input
                        v-model="form.desc"
                        :rows="5"
                        type="textarea"
                        placeholder="角色描述"
                    />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </Drawer>
        <!-- 配置权限抽屉 -->
        <Drawer ref="setRoleDrawerRef" title="权限配置" @submit="handleSetRoleSubmit">
            <el-tree-v2
                :data="ruleList"
                :props="{ label: 'name', children: 'child' }"
                show-checkbox
                :height="treeHight"
            />
        </Drawer>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getRoleList, createRole, updateRole, deleteRole, updateRoleStatus } from '~/api/role.js'
import { getRuleList } from '~/api/rule.js'
import Drawer from '~/components/Drawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import { initTableData, initForm } from '~/utils/useCommon.js'
const { tableData, loading, currentPage, total, limit, getData, handleDelete, handleStatusChange } =
    initTableData({
        getListFun: getRoleList,
        delete: deleteRole,
        updateStatus: updateRoleStatus,
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
            desc: '',
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
        create: createRole,
        update: updateRole,
        loading
    })
// 配置权限抽屉
const setRoleDrawerRef = ref(null)
// 树形权限列表
const ruleList = ref([])
// 树形权限列表高度
const treeHight = window.innerHeight - 170
// 角色id
const roleId = ref(0)
// 打开配置权限抽屉
const openSetRole = row => {
    roleId.value = row.id
    getRuleList(1).then(res => {
        ruleList.value = res.list
        setRoleDrawerRef.value.open()
    })
}
// 配置权限提交按钮
const handleSetRoleSubmit = () => {
    console.log('配置权限')
}
</script>

<style scoped></style>
