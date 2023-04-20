<template>
    <div>
        <!-- 标签栏 -->
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
            <!-- 搜索 -->
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
            </div>
            <ListHeader layout="create,refresh" @create="handleAdd" @refresh="getData">
                <el-button
                    v-if="searchForm.tab !== 'delete'"
                    type="danger"
                    size="small"
                    @click="handleMultiDelete"
                    >批量删除</el-button
                >
            </ListHeader>
            <el-table
                ref="multipleTableRef"
                v-loading="loading"
                :data="tableData"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
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
                            <el-button
                                type="success"
                                plain
                                size="small"
                                @click="handleAuditGoods(row.id, 1)"
                                >审核通过</el-button
                            >
                            <el-button
                                type="danger"
                                plain
                                size="small"
                                class="mt-2"
                                style="margin-left: 0px !important"
                                @click="handleAuditGoods(row.id, 2)"
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
                            <el-button
                                text
                                :type="
                                    (scope.row.sku_type === 0 && !scope.row.sku_value) ||
                                    (scope.row.sku_type === 1 && !scope.row.goods_skus.length)
                                        ? 'danger'
                                        : 'primary'
                                "
                                size="small"
                                class="px-1"
                                :loading="scope.row.skuLoading"
                                @click="handleOpenSku(scope.row)"
                            >
                                商品规格
                            </el-button>
                            <el-button
                                text
                                :type="!scope.row.content ? 'danger' : 'primary'"
                                size="small"
                                class="px-1"
                                :loading="scope.row.contentLoading"
                                @click="handleOpenContent(scope.row)"
                            >
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
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getOrderList, deleteOrder } from '~/api/order.js'
import { getCategoryList } from '~/api/category'
// eslint-disable-next-line no-unused-vars
import Drawer from '~/components/Drawer.vue'
import ListHeader from '~/components/ListHeader.vue'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'

import { initTableData } from '~/utils/useCommon.js'
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
    multipleTableRef,
    handleSelectionChange,
    handleMultiDelete,
    handleAuditGoods,
    // eslint-disable-next-line no-unused-vars
    multiSelectionIds
} = initTableData({
    getListFun: getOrderList,
    searchForm: {
        tab: 'all',
        title: '',
        category_id: null
    },
    onGetListSuccess: res => {
        tableData.value = res.list.map(o => {
            o.bannersLoading = false
            o.contentLoading = false
            o.skuLoading = false
            return o
        })
        total.value = res.totalCount
    },
    delete: deleteOrder
})
// tabBar数据
const tabBars = ref([
    {
        name: '全部',
        key: 'all'
    },
    {
        name: '待支付',
        key: 'nopay'
    },
    {
        name: '待发货',
        key: 'noship'
    },
    {
        name: '待收货',
        key: 'shiped'
    },
    {
        name: '已收货',
        key: 'received'
    },
    {
        name: '已完成',
        key: 'finish'
    },
    {
        name: '已关闭',
        key: 'closed'
    },
    {
        name: '退款中',
        key: 'refunding'
    }
])
// 下拉框数据
const categoryList = ref([])
// 获取分类列表
getCategoryList().then(res => (categoryList.value = res))
</script>

<style scoped></style>
