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
            <el-table-column type="expand">
                <template #default="{ row }">
                    <div class="flex pl-15">
                        <el-avatar
                            :size="50"
                            :src="row.user.avatar"
                            fit="fill"
                            class="mr-3"
                        ></el-avatar>
                        <div class="flex-1 px-1">
                            <h6 class="flex items-center">
                                {{ row.user.username }}
                                <small class="ml-2 text-gray-400">{{ row.review_time }}</small>
                                <el-button
                                    v-if="!row.textareaEdit && !row.extra"
                                    size="small"
                                    class="ml-auto"
                                    @click="openTextarea(row)"
                                >
                                    回复
                                </el-button>
                            </h6>
                            {{ row.review.data }}
                            <div class="py-2">
                                <el-image
                                    v-for="(item, index) in row.review.image"
                                    :key="index"
                                    :src="item"
                                    fit="cover"
                                    :lazy="true"
                                    style="width: 100px; height: 100px"
                                    class="rounded"
                                ></el-image>
                            </div>
                            <div v-if="row.textareaEdit">
                                <el-input
                                    v-model="textarea"
                                    placeholder="请输入评价内容"
                                    type="textarea"
                                    :rows="2"
                                ></el-input>
                                <div class="py-2">
                                    <el-button type="primary" size="small" @click="review(row)">
                                        确定
                                    </el-button>
                                    <el-button size="small" @click="row.textareaEdit = false">
                                        取消
                                    </el-button>
                                </div>
                            </div>
                            <template v-else>
                                <div
                                    v-for="(item, index) in row.extra"
                                    :key="index"
                                    class="bg-gray-100 p-3 rounded"
                                >
                                    <h6 class="flex text-md font-bold">
                                        客服
                                        <el-button
                                            type="info"
                                            size="small"
                                            class="ml-auto"
                                            @click="openTextarea(row, item.data)"
                                        >
                                            修改
                                        </el-button>
                                    </h6>
                                    <p>{{ item.data }}</p>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </el-table-column>
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
import { ref } from 'vue'
import {
    getGoodsCommentList,
    updateGoodsCommentStatus,
    // eslint-disable-next-line no-unused-vars
    reviewGoodsComment
} from '~/api/goodsComments.js'
import { toast } from '~/utils/util.js'
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
            o.textareaEdit = false
            return o
        })
        total.value = res.totalCount
    },
    updateStatus: updateGoodsCommentStatus
})
const textarea = ref('')

const openTextarea = (row, data = '') => {
    textarea.value = data
    row.textareaEdit = true
}

const review = data => {
    if (textarea.value === '') {
        return toast('请输入回复内容', 'error')
    }
    reviewGoodsComment(data.id, textarea.value).then(() => {
        data.textareaEdit = false
        toast('回复成功')
        getData()
    })
}
</script>

<style scoped></style>
