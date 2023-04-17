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
                        title="是否要删除该用户?"
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
                ref="treeRef"
                :data="ruleList"
                node-key="id"
                :default-expanded-keys="defaultExpandedKeys"
                :props="{ label: 'name', children: 'child' }"
                show-checkbox
                :check-strictly="checkStrictly"
                :height="treeHight"
                @check="handleTreeCheck"
            >
                <template #default="{ data }">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? '' : 'info'" size="small">
                            {{ data.menu ? '菜单' : '规则' }}
                        </el-tag>
                        <span class="ml-2 text-sm">{{ data.name }}</span>
                    </div>
                </template>
            </el-tree-v2>
        </Drawer>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import {
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus,
    updateRuleRole
} from '~/api/role.js'
import { getRuleList } from '~/api/rule.js'
import { toast } from '~/utils/util.js'
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
// 配置权限抽屉Ref
const setRoleDrawerRef = ref(null)
// 树形权限Ref
const treeRef = ref(null)
// 是否严格的父子节点不关联
const checkStrictly = ref(false)
// 树形权限列表
const ruleList = ref([])
// 默认展开的树形节点
const defaultExpandedKeys = ref([])
// 树形权限列表高度
const treeHight = window.innerHeight - 180
// 角色id
const roleId = ref(0)
// 角色权限id
const ruleIds = ref([])
// 打开配置权限抽屉
const openSetRole = row => {
    checkStrictly.value = true
    roleId.value = row.id
    getRuleList(1).then(res => {
        ruleList.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
        setRoleDrawerRef.value.open()
        ruleIds.value = row.rules.map(o => o.id)
        setTimeout(() => {
            treeRef.value.setCheckedKeys(ruleIds.value)
            checkStrictly.value = false
        }, 150)
    })
}
// 配置权限提交按钮
const handleSetRoleSubmit = () => {
    setRoleDrawerRef.value.loadOn()
    updateRuleRole(roleId.value, ruleIds.value)
        .then(() => {
            setRoleDrawerRef.value.close()
            toast('配置成功！')
            getData()
        })
        .finally(() => {
            setRoleDrawerRef.value.loadOff()
        })
}
// 树形权限勾选
const handleTreeCheck = (...e) => {
    // ...e 代表传入的参数是一个数组
    const { checkedKeys, halfCheckedKeys } = e[1]
    // 使用...展开运算符，将数组转换为多个参数合并赋值给ruleIds.value
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}
</script>

<style scoped></style>
