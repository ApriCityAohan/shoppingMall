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
                            <el-button type="primary" size="small" text @click="handleRename(item)"
                                >重命名</el-button
                            >
                            <el-popconfirm
                                title="确认是否删除图片?"
                                confirm-button-text="确认"
                                cancel-button-text="取消"
                                @confirm="handleDelete(item.id)"
                            >
                                <template #reference>
                                    <el-button type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
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
    <el-drawer v-model="drawer" title="上传图片">
        <UploadField></UploadField>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { getImageList, updateImage, deleteImage } from '~/api/image.js'
import { showPrompt, toast } from '~/utils/util.js'
import UploadField from '~/components/UploadField.vue'
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

// 抽屉状态及方法
const drawer = ref(false)
const openUploadField = () => {
    drawer.value = true
}

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
// 重命名方法
const handleRename = item => {
    showPrompt('重命名', item.name)
        .then(({ value }) => {
            loading.value = true
            updateImage(item.id, value)
                .then(() => {
                    toast('重命名成功')
                    getList()
                })
                .finally(() => {
                    loading.value = false
                })
        })
        .catch(() => {})
}
// 删除方法
const handleDelete = id => {
    loading.value = true
    deleteImage([id])
        .then(() => {
            toast('删除成功')
            getList()
        })
        .finally(() => {
            loading.value = false
        })
}
// 暴露方法
defineExpose({
    loadData,
    openUploadField
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
