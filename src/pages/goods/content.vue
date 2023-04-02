<template>
    <Drawer ref="drawerRef" destroy-on-close title="设置商品详情" @submit="onSubmit">
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content" />
            </el-form-item>
        </el-form>
    </Drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Drawer from '~/components/Drawer.vue'
import Editor from '~/components/Editor.vue'
import { readGoods, updateGoods } from '~/api/goods'
import { toast } from '~/utils/util'
// 抽屉Ref
const drawerRef = ref(null)
// 表单数据
const form = reactive({
    content: ''
})
// 商品id
const goodsId = ref(0)
// 打开抽屉
const open = row => {
    goodsId.value = row.id
    row.contentLoading = true
    readGoods(row.id)
        .then(res => {
            form.content = res.content
            drawerRef.value.open()
        })
        .finally(() => {
            row.contentLoading = false
        })
}
// 提交事件
const emit = defineEmits(['refers'])
// 提交表单
const onSubmit = () => {
    drawerRef.value.loadOn()
    updateGoods(goodsId.value, form)
        .then(() => {
            drawerRef.value.close()
            toast('设置商品详情成功')
            emit('refers')
        })
        .finally(() => {
            drawerRef.value.loadOff()
        })
}
// 暴露给父组件的方法
defineExpose({
    open
})
</script>

<style scoped></style>
