<template>
    <el-aside width="220px" class="image-aside">
        <div class="top">
            <ImgAsideList active> 分类标题 </ImgAsideList>
            <ImgAsideList> 分类标题 </ImgAsideList>
        </div>
        <div class="bottom">分页</div>
    </el-aside>
</template>

<script setup>
import ImgAsideList from './ImgAsideList.vue'
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
}
</style>
