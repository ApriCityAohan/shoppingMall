<template>
    <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
        <el-header class="image-header">
            <el-button type="primary" size="small" @click="handleAdd">新增图片分类</el-button>
        </el-header>
        <el-container>
            <ImageAside ref="handleOpenDrawer" @change="handleChange" />
            <ImageMain ref="handleImageRef" />
        </el-container>
    </el-container>
</template>

<script setup>
import { ref } from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'
// 获取窗口高度
const windowHeight = window.innerHeight || document.body.clientHeight
// 计算高度
const h = windowHeight - 64 - 44 - 40
// 抽屉Ref
const handleOpenDrawer = ref(null)
// 打开抽屉方法
const handleAdd = () => {
    handleOpenDrawer.value.handleOpenDrawer()
}
// 图片列表Ref
const handleImageRef = ref(null)
// 切换图片分类
const handleChange = id => {
    // 当切换事件触发后，触发图片列表的加载数据方法
    handleImageRef.value.loadData(id)
}
</script>

<style scoped>
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}
</style>
