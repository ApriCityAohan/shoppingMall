<template>
    <el-main class="image-main">
        <div class="top">
            <div v-for="i in 100" :key="i">i</div>
        </div>
        <div class="bottom">分页</div>
    </el-main>
</template>

<script setup></script>

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
}
</style>
