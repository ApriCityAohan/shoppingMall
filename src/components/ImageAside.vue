<template>
    <el-aside v-loading="loading" width="220px" class="image-aside">
        <div class="top">
            <ImgAsideList v-for="(item, index) in list" :key="index" :active="activeId === item.id">
                {{ item.name }}
            </ImgAsideList>
        </div>
        <div class="bottom">
            <el-pagination
                v-model:current-page="currentPage"
                background
                layout="prev, next"
                :total="total"
                :page-size="limit"
                @current-change="getList"
            />
        </div>
    </el-aside>
    <Drawer ref="drawerRef" title="新增" @submit="handleSubmit"></Drawer>
</template>

<script setup>
import { ref } from 'vue'
import { getImagesClass } from '~/api/image_class.js'
import ImgAsideList from './ImgAsideList.vue'
import Drawer from './Drawer.vue'
// 状态
const loading = ref(false)
const list = ref([])
const activeId = ref(0)
// 页码
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
// 获取图片分类列表
function getList(page = null) {
    if (typeof page === 'number') {
        currentPage.value = page
    }
    loading.value = true
    getImagesClass(currentPage.value)
        .then(res => {
            // console.log(res)
            list.value = res.list
            total.value = res.totalCount
            const item = list.value[0]
            if (item) {
                activeId.value = item.id
            }
        })
        .finally(() => {
            loading.value = false
        })
}
getList()
const drawerRef = ref(null)
const handleOpenDrawer = () => {
    drawerRef.value.open()
}
const handleSubmit = () => {
    console.log('提交成功')
}
defineExpose({
    handleOpenDrawer
})
</script>

<style scoped>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}
.image-aside .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 40px;
    overflow: auto;
}
.image-aside .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    @apply flex justify-center items-center;
}
</style>
