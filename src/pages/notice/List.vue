<template>
    <el-card shadow="never">
        <div class="flex justify-between items-center mb-3">
            <el-button type="primary" size="small">新增</el-button>
            <el-button text size="small" @click="getData">
                <el-icon :size="20"><Refresh /></el-icon>
            </el-button>
        </div>
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
            <el-table-column prop="title" label="公告标题" />
            <el-table-column prop="create_time" label="发布时间" width="320" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button
                        text
                        type="primary"
                        size="small"
                        @click="handleNoticeEdit(scope.row)"
                    >
                        修改
                    </el-button>
                    <el-popconfirm
                        title="是否要删除公告?"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        @confirm="handleNoticeDelete(scope.row)"
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
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getNoticeList } from '~/api/notice.js'
// 公告列表
const tableData = ref([
    {
        title: 'Tom',
        create_time: '2016-05-03'
    }
])
// Loading状态
const loading = ref(false)
// 页码
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
// 获取公告列表
function getData(page) {
    if (typeof page === 'number') {
        currentPage.value = page
    }
    loading.value = true
    getNoticeList(currentPage.value)
        .then(res => {
            console.log(res)
            tableData.value = res.list
            total.value = res.totalCount
        })
        .finally(() => {
            loading.value = false
        })
}
getData()
// 修改公告
const handleNoticeEdit = row => {
    console.log(row)
}
// 删除公告
const handleNoticeDelete = row => {
    console.log(row)
}
</script>

<style scoped></style>
