<template>
    <el-card shadow="never">
        <template #header>
            <div class="flex justify-between">
                <span class="text-sm">{{ title }}</span>
                <el-tag type="danger" effect="plain">{{ tip }}</el-tag>
            </div>
        </template>
        <el-row :gutter="20">
            <el-col v-for="(item, index) in data" :key="index" :span="6" :offset="0">
                <el-card shadow="hover" class="border-0 bg-light-400">
                    <div class="flex flex-col items-center justify-center">
                        <span class="text-xl mb-2">{{ item.value }}</span>
                        <span class="text-sm text-gray-500">{{ item.label }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    tip: {
        type: String,
        required: true
    },
    data: {
        type: Array,
        required: true
    }
})
</script>

<style scoped></style>
