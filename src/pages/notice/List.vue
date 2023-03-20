<template>
    <el-card shadow="never">
        <div class="flex justify-between items-center mb-3">
            <el-button type="primary" size="small">新增</el-button>
            <el-button text size="small">
                <el-icon :size="20"><Refresh /></el-icon>
            </el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
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
    </el-card>
</template>

<script setup>
import { reactive } from 'vue'
const tableData = reactive([
    {
        title: 'Tom',
        create_time: '2016-05-03'
    },
    {
        title: 'Tom',
        create_time: '2016-05-03'
    },
    {
        title: 'Tom',
        create_time: '2016-05-03'
    }
])
const handleNoticeEdit = row => {
    console.log(row)
}
const handleNoticeDelete = row => {
    console.log(row)
}
</script>

<style scoped></style>
