<template>
    <el-dialog v-model="dialogVisible" title="商品选择" width="80%">
        内容
        <template #footer>
            <span>
                <el-button @click="close">Cancel</el-button>
                <el-button type="primary" @click="submit">OK</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
const dialogVisible = ref(false)
const submit = () => {
    console.log('submit')
}
const open = () => (dialogVisible.value = true)
const close = () => (dialogVisible.value = false)

defineExpose({
    open
})
</script>

<style scoped></style>
