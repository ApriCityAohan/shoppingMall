<template>
    <el-main v-loading="loading" class="image-main">
        <div class="top">
            <div v-for="(item, index) in list" :key="index">{{ item.url }}</div>
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

const imageClassId = ref(0)
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

const loading = ref(false)

const list = ref([])

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
function loadData(id) {
    imageClassId.value = id
    currentPage.value = 1
    getList()
}
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
</style>
