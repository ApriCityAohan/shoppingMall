<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane
                v-for="(item, index) in tabBars"
                :key="index"
                :label="item.name"
                :name="item.key"
            >
            </el-tab-pane>
        </el-tabs>

        <el-card shadow="never">
            <div class="mb-3">
                <Search :model="searchForm" @search="getData" @reset="handleResetSearch">
                    <SearchItem label="关键字">
                        <el-input
                            v-model="searchForm.title"
                            placeholder="商品名称"
                            clearable
                        ></el-input>
                    </SearchItem>
                    <template #moreSearch>
                        <SearchItem label="商品分类">
                            <el-select
                                v-model="searchForm.category_id"
                                placeholder="请选择商品类别"
                                clearable
                            >
                                <el-option
                                    v-for="item in categoryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </SearchItem>
                    </template>
                </Search>
                <!-- <el-form :model="searchForm" label-width="80px" size="small">
                    <el-row :gutter="20">
                        <el-col :span="8" :offset="0">
                            <el-form-item label="关键词">
                                <el-input
                                    v-model="searchForm.title"
                                    placeholder="商品名称"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="showSearch" :span="8">
                            <el-form-item label="商品分类">
                                <el-select
                                    v-model="searchForm.category_id"
                                    placeholder="请选择商品类别"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in categoryList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :offset="showSearch ? 0 : 8">
                            <div class="flex items-center justify-end">
                                <el-button type="primary" @click="getData">搜索</el-button>
                                <el-button @click="handleResetSearch">重置</el-button>
                                <el-button text type="primary" @click="showSearch = !showSearch">
                                    {{ showSearch ? '收起' : '展开' }}
                                    <el-icon
                                        class="transform transition-all ml-1"
                                        :class="showSearch ? 'rotate-180' : ''"
                                        ><ArrowUp
                                    /></el-icon>
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form> -->
            </div>
            <ListHeader @create="handleAdd" @refresh="getData" />
            <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div class="flex">
                            <el-image
                                :src="row.cover"
                                fit="cover"
                                :lazy="true"
                                style="width: 50px; height: 50px"
                                class="mr-3 rounded"
                            ></el-image>
                            <div class="flex-1">
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                                    <el-divider direction="vertical" />
                                    <span class="text-gray-500 text-xs">
                                        ￥{{ row.min_oprice }}
                                    </span>
                                </div>
                                <p class="text-xs mb-1 text-gray-400">
                                    分类：{{ row.category ? row.category.name : '未分类' }}
                                </p>
                                <p class="text-xs text-gray-400">创建时间：{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实际销量" width="70" align="center" prop="sale_count" />
                <el-table-column label="商品状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small">
                            {{ row.status ? '上架' : '仓库' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="searchForm.tab !== 'delete'"
                    label="审核状态"
                    width="120"
                    align="center"
                >
                    <template #default="{ row }">
                        <div v-if="row.ischeck === 0" class="flex flex-col">
                            <el-button type="success" plain size="small">审核通过</el-button>
                            <el-button
                                type="danger"
                                plain
                                size="small"
                                class="mt-2"
                                style="margin-left: 0px !important"
                            >
                                审核拒绝
                            </el-button>
                        </div>
                        <span v-else>{{ row.ischeck === 1 ? '同意' : '拒绝' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总库存" align="center" prop="stock" width="90" />
                <el-table-column label="操作" align="right">
                    <template #default="scope">
                        <div v-if="searchForm.tab !== 'delete'">
                            <el-button
                                text
                                type="primary"
                                size="small"
                                class="px-1"
                                @click="handleEdit(scope.row)"
                            >
                                修改
                            </el-button>
                            <el-button text type="primary" size="small" class="px-1">
                                商品规格
                            </el-button>
                            <el-button text type="primary" size="small" class="px-1">
                                设置轮播图
                            </el-button>
                            <el-button text type="primary" size="small" class="px-1">
                                商品详情
                            </el-button>
                            <el-popconfirm
                                title="是否要删除该商品?"
                                confirm-button-text="确认"
                                cancel-button-text="取消"
                                @confirm="handleDelete(scope.row.id)"
                            >
                                <template #reference>
                                    <el-button text type="primary" size="small">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <span v-else class="text-sm"> 暂无操作 </span>
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
                <el-form
                    ref="formRef"
                    :model="form"
                    :rules="rules"
                    label-width="80px"
                    :inline="false"
                >
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
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    getGoodsList,
    updateGoodsStatus,
    createGoods,
    updateGoods,
    deleteGoods
} from '~/api/goods.js'
import { getCategoryList } from '~/api/category'
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
    // eslint-disable-next-line no-unused-vars
    handleStatusChange
} = initTableData({
    getListFun: getGoodsList,
    searchForm: {
        tab: 'all',
        title: '',
        category_id: null
    },
    onGetListSuccess: res => {
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })
        total.value = res.totalCount
        roles.value = res.roles
    },
    delete: deleteGoods,
    updateStatus: updateGoodsStatus
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
        create: createGoods,
        update: updateGoods,
        loading
    })
// 下拉框数据
const roles = ref([])
// tabBar数据
const tabBars = ref([
    {
        name: '全部',
        key: 'all'
    },
    {
        name: '审核中',
        key: 'checking'
    },
    {
        name: '出售中',
        key: 'saling'
    },
    {
        name: '已下架',
        key: 'off'
    },
    {
        name: '库存预警',
        key: 'min_stock'
    },
    {
        name: '回收站',
        key: 'delete'
    }
])
// 下拉框数据
const categoryList = ref([])
// 获取分类列表
getCategoryList().then(res => (categoryList.value = res))
</script>

<style scoped></style>
