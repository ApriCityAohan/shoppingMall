<template>
    <el-drawer
        v-model="drawerVisible"
        title="设置轮播图"
        direction="rtl"
        size="50%"
        :destroy-on-close="true"
    >
        <el-form :model="form" label-width="80px">
            <el-form-item label="轮播图">
                <choose-image v-model="form.banners" :limit="9" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ChooseImage from '~/components/ChooseImage.vue'
import { readGoods, setGoodsBanner } from '~/api/goods'
import { toast } from '~/utils/util'
// 控制抽屉的显示与隐藏
const drawerVisible = ref(false)
// 表单数据
const form = reactive({
    banners: []
})
// 商品id
const goodsId = ref(0)
// 打开抽屉
const open = row => {
    goodsId.value = row.id
    readGoods(row.id).then(res => {
        form.banners = res.goodsBanner.map(o => o.url)
        drawerVisible.value = true
    })
}
// 加载状态
const loading = ref(false)
// 提交事件
const emit = defineEmits(['refersData'])
// 提交表单
const onSubmit = () => {
    loading.value = true
    setGoodsBanner(goodsId.value, form)
        .then(() => {
            drawerVisible.value = false
            toast('设置轮播图成功')
            emit(['refersData'])
        })
        .finally(() => {
            loading.value = false
        })
}
// 暴露给父组件的方法
defineExpose({
    open
})
</script>

<style scoped></style>
