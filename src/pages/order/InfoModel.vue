<template>
    <el-drawer v-model="modelViable" title="订单详情" size="50%">
        <!-- <div class="info-model"></div> -->
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    order: {
        type: Object,
        required: true
    }
})

const modelViable = ref(false)

const open = () => (modelViable.value = true)
const close = () => (modelViable.value = false)

defineExpose({
    open,
    close
})
</script>

<style scoped>
/* .info-model {
    position: absolute;
} */
</style>
