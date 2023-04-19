<template>
    <el-card shadow="never">
        <div class="mb-3">
            <Search :model="searchForm" @search="getData" @reset="handleResetSearch">
                <SearchItem label="关键词">
                    <el-input
                        v-model="searchForm.title"
                        placeholder="要搜索的商品"
                        clearable
                    ></el-input>
                </SearchItem>
            </Search>
        </div>
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="70" align="center" />
            <el-table-column label="商品">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-image
                            :src="row.goods_item?.cover ?? ''"
                            fit="fill"
                            :lazy="true"
                            style="width: 50px; height: 50px"
                            class="rounded"
                        ></el-image>
                        <div class="ml-3">
                            <h6>{{ row.goods_item?.title ?? '商品已被删除' }}</h6>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="评价信息">
                <template #default="{ row }">
                    <p>用户：{{ row.user.username }}</p>
                    <p>
                        <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="评价信息" prop="review_time" align="center" />
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
</template>

<script setup>
import {
    getGoodsCommentList,
    updateGoodsCommentStatus,
    // eslint-disable-next-line no-unused-vars
    reviewGoodsComment
} from '~/api/goodsComments.js'
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
    handleStatusChange
} = initTableData({
    getListFun: getGoodsCommentList,
    searchForm: {
        title: ''
    },
    onGetListSuccess: res => {
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })
        total.value = res.totalCount
    },
    updateStatus: updateGoodsCommentStatus
})
</script>

<style scoped></style>
