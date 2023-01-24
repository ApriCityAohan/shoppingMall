<!-- eslint-disable no-unused-vars -->
<template>
    <el-drawer
        v-model="drawer"
        :title="title"
        :size="size"
        :close-on-click-modal="false"
        :destroy-on-close="destroyOnClose"
    >
        <div class="content-style">
            <div class="body">
                <slot></slot>
            </div>
            <div class="btnGroup">
                <el-button type="primary" @click="submit">{{ confirmText }}</el-button>
                <el-button @click="close">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(false)
const open = () => (drawer.value = true)
const close = () => (drawer.value = false)

// eslint-disable-next-line
const props = defineProps({
    // eslint-disable-next-line
    title: String,
    size: {
        type: String,
        default: '45%'
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: '提交'
    }
})

const emit = defineEmits(['submit'])
const submit = () => emit('submit')

defineExpose({
    open,
    close
})
</script>

<style scoped>
.content-style {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}
.content-style .body {
    overflow-y: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
}
.content-style .btnGroup {
    height: 50px;
    @apply flex items-center mt-auto;
}
</style>
