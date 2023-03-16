<template>
    <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
        <el-header class="image-header">
            <el-button type="primary" size="default" @click="handleAdd">新增图片分类</el-button>
        </el-header>
        <el-container>
            <ImageAside ref="handleOpenDrawer" />
            <ImageMain />
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

const handleOpenDrawer = ref(null)
const handleAdd = () => {
    handleOpenDrawer.value.handleOpenDrawer()
}
</script>

<style scoped>
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}
</style>
