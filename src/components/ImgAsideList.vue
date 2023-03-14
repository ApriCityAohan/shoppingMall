<template>
    <div class="aside-list" :class="{ active: active }">
        <span><slot></slot></span>
        <el-button class="ml-auto" type="text" :size="12" @click="$emit('edit')">
            <el-icon><Edit /></el-icon>
        </el-button>
        <el-button type="text" :size="12" @click="$emit('delete')">
            <el-icon><Close /></el-icon>
        </el-button>
    </div>
</template>

<script setup>
defineProps({
    active: {
        type: Boolean,
        default: false
    }
})
defineEmits(['edit', 'delete'])
</script>

<style scoped>
.aside-list {
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center p-3;
}
.aside-list:hover,
.active {
    @apply bg-blue-50;
}
</style>
