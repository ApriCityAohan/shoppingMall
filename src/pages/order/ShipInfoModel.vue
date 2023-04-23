<template>
    <el-drawer v-model="dialogVisible" title="物流信息" size="40%"> </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
// eslint-disable-next-line no-unused-vars
import { getOrderShip } from '~/api/order'
const dialogVisible = ref(false)

const open = id => {
    return getOrderShip(id).then(res => {
        console.log(res)
        dialogVisible.value = true
    })
}
const close = () => {
    dialogVisible.value = false
}

defineExpose({
    open,
    close
})
</script>

<style scoped></style>
