<template>
    <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
        <el-header class="image-header">Header</el-header>
        <el-container>
            <el-aside width="220px" class="image-aside">
                <div class="top">
                    <div v-for="i in 100" :key="i">i</div>
                </div>
                <div class="bottom">分页</div>
            </el-aside>
            <el-main class="image-main"
                ><div class="top">
                    <div v-for="i in 100" :key="i">i</div>
                </div>
                <div class="bottom">分页</div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40
</script>

<style scoped>
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}
.image-aside .top,
.image-main .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 40px;
    overflow: auto;
}
.image-aside .bottom,
.image-main .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
}
.image-main {
    position: relative;
}
</style>
