<template>
    <el-main v-loading="loading" class="image-main">
        <div class="top p-3">
            <!-- <div >{{ item.url }}</div> -->
            <el-row :gutter="10">
                <el-col v-for="(item, index) in list" :key="index" :span="6">
                    <el-card shadow="hover" :body-style="{ padding: 0 }" class="m-3 relative">
                        <el-image
                            :src="item.url"
                            fit="cover"
                            :lazy="true"
                            class="h-[150px]"
                            style="width: 100%"
                        ></el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex items-center justify-center p-2">
                            <el-button type="primary" size="small" text>重命名</el-button>
                            <el-button type="primary" size="small" text>删除</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="bottom">
            <el-pagination
                v-model:current-page="currentPage"
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="limit"
                @current-change="getList"
            />
        </div>
    </el-main>
</template>

<script setup>
import { ref } from 'vue'
import { getImageList } from '~/api/image.js'
// 图片ID
const imageClassId = ref(0)
// 页码状态
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
// 加载状态
const loading = ref(false)
// 图片列表
const list = ref([])
// 加载图片列表
function getList(page = null) {
    if (typeof page === 'number') {
        currentPage.value = page
    }
    loading.value = true
    getImageList(imageClassId.value, currentPage.value)
        .then(res => {
            // console.log(res)
            list.value = res.list
            total.value = res.totalCount
        })
        .finally(() => {
            loading.value = false
        })
}
// 加载数据
function loadData(id) {
    imageClassId.value = id
    currentPage.value = 1
    getList()
}
// 暴露方法
defineExpose({
    loadData
})
</script>

<style scoped>
.image-main {
    position: relative;
}
.image-main .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 40px;
    overflow: auto;
}
.image-main .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    @apply flex justify-center items-center;
}
.image-title {
    position: absolute;
    top: 122px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>
