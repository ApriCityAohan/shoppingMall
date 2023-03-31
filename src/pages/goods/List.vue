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
            </div>
            <ListHeader
                layout="create,refresh,delete"
                @create="handleAdd"
                @refresh="getData"
                @delete="handleMultiDelete"
            >
                <el-button
                    v-if="searchForm.tab == 'all' || searchForm.tab == 'off'"
                    size="small"
                    @click="handleMultiStatusChange(1)"
                    >上架</el-button
                >
                <el-button
                    v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'"
                    size="small"
                    @click="handleMultiStatusChange(0)"
                    >下架</el-button
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
                    label-width="90px"
                    :inline="false"
                >
                    <el-form-item label="商品名称" prop="title">
                        <el-input
                            v-model="form.title"
                            placeholder="请输入商品名称，不能超过60个字符"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="封面">
                        <ChooseImage v-model="form.cover" />
                    </el-form-item>
                    <el-form-item label="商品分类" prop="category_id">
                        <el-select v-model="form.category_id" placeholder="选择商品分类">
                            <el-option
                                v-for="item in categoryList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="desc">
                        <el-input v-model="form.desc" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="商品单位" prop="unit" style="width: 50%">
                        <el-input v-model="form.unit"></el-input>
                    </el-form-item>
                    <el-form-item label="总库存" prop="stock" style="width: 40%">
                        <el-input v-model="form.stock" type="number">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存预警" prop="min_stock" style="width: 40%">
                        <el-input v-model="form.min_stock" type="number">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低销售价" prop="min_price" style="width: 40%">
                        <el-input v-model="form.min_price" type="number">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低原价" prop="min_oprice" style="width: 40%">
                        <el-input v-model="form.min_oprice" type="number">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存显示" prop="stock_display">
                        <el-radio-group v-model="form.stock_display">
                            <el-radio :label="1" border>是</el-radio>
                            <el-radio :label="0" border>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否上架" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio :label="0" border>放入仓库</el-radio>
                            <el-radio :label="1" border>立即上架</el-radio>
                        </el-radio-group>
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
    multipleTableRef,
    handleSelectionChange,
    handleMultiDelete,
    handleMultiStatusChange
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
    },
    delete: deleteGoods,
    updateStatus: updateGoodsStatus
})
const { drawerRef, formRef, form, rules, drawerTitle, handleAdd, handleEdit, handleSubmit } =
    initForm({
        getData,
        form: {
            title: '', // 商品名称
            category_id: null, // 商品分类
            cover: null, // 商品封面
            desc: '', // 商品描述
            unit: '件', // 商品单位
            stock: 100, // 总库存
            min_stock: 10, // 库存预警
            status: 1, // 是否上架 0仓库1上架
            stock_display: 1, // 库存显示 0隐藏1显示
            min_price: 0, // 最低销售价
            min_oprice: 0 // 最低原价
        },
        create: createGoods,
        update: updateGoods,
        loading
    })
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
