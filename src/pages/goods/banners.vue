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
                <choose-image v-model="form.banners" />
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
// eslint-disable-next-line no-unused-vars
import { readGoods, setGoodsBanner } from '~/api/goods'
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
    drawerVisible.value = true
}
// 提交表单
const onSubmit = () => {
    console.log(form)
}
// 暴露给父组件的方法
defineExpose({
    open
})
</script>

<style scoped></style>
