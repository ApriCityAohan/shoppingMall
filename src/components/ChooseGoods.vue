<template>
    <el-dialog v-model="dialogVisible" title="商品选择" width="80%" destroy-on-close @close="reset">
        <div class="border rounded pb-5">
            <div class="flex items-center p-4">
                <el-input
                    v-model="searchForm.title"
                    placeholder="商品名称"
                    size="normal"
                    clearable
                    class="w-[150px] pr-3"
                    @clear="reset"
                ></el-input>
                <el-button type="primary" size="default" @click="getData">搜索</el-button>
            </div>
            <el-table
                ref="multipleTableRef"
                v-loading="loading"
                :data="tableData"
                stripe
                style="width: 100%"
                height="300"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品">
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
                                <p class="text-xs mb-1 text-gray-400">
                                    分类：{{ row.category ? row.category.name : '未分类' }}
                                </p>
                                <p class="text-xs text-gray-400">创建时间：{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="总库存" align="center" prop="stock" width="90" />
                <el-table-column label="价格(元)" align="center" prop="stock" width="180">
                    <template #default="{ row }">
                        <span class="text-rose-500">￥{{ row.min_price }}</span>
                        <el-divider direction="vertical" />
                        <span class="text-gray-500 text-xs"> ￥{{ row.min_oprice }} </span>
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
        </div>

        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { getGoodsList } from '~/api/goods'
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
    multipleTableRef,
    handleSelectionChange,
    multiSelectionIds
} = initTableData({
    getListFun: getGoodsList,
    searchForm: {
        tab: 'all',
        title: ''
    },
    onGetListSuccess: res => {
        tableData.value = res.list
        total.value = res.totalCount
    }
})
const dialogVisible = ref(false)

const callbackFun = ref(null)

const open = callback => {
    callbackFun.value = callback
    dialogVisible.value = true
}
const close = () => (dialogVisible.value = false)

const submit = () => {
    if (typeof callbackFun.value === 'function') {
        callbackFun.value(multiSelectionIds.value)
    }
    close()
}
const reset = () => {
    handleResetSearch()
}
defineExpose({
    open
})
</script>

<style scoped></style>
