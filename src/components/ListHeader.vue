<template>
    <div class="flex justify-between items-center mb-3">
        <el-button type="primary" size="small" @click="$emit('create')">新增</el-button>
        <el-button text size="small" @click="$emit('refresh')">
            <el-icon :size="20"><Refresh /></el-icon>
        </el-button>
    </div>
</template>

<script setup>
defineEmits(['create', 'refresh'])
</script>

<style scoped></style>
