<template>
    <el-aside v-loading="loading" width="220px" class="image-aside">
        <div class="top">
            <ImgAsideList v-for="(item, index) in list" :key="index" :active="activeId === item.id">
                {{ item.name }}
            </ImgAsideList>
        </div>
        <div class="bottom">分页</div>
    </el-aside>
</template>

<script setup>
import { ref } from 'vue'
import { getImagesClass } from '~/api/image_class.js'
import ImgAsideList from './ImgAsideList.vue'

const loading = ref(false)
const list = ref([])
const activeId = ref(0)
function getList(page = 1) {
    loading.value = true
    getImagesClass(page)
        .then(res => {
            console.log(res.list)
            list.value = res.list
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
