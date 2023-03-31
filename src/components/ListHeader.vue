<template>
    <div class="flex justify-between items-center mb-3">
        <div>
            <el-button
                v-if="btn.includes('create')"
                type="primary"
                size="small"
                @click="$emit('create')"
                >新增</el-button
            >
            <el-popconfirm
                v-if="btn.includes('delete')"
                title="是否要删除所选项?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="$emit('delete')"
            >
                <template #reference>
                    <el-button type="danger" size="small"> 批量删除 </el-button>
                </template>
            </el-popconfirm>
            <slot />
        </div>
        <el-button v-if="btn.includes('refresh')" text size="small" @click="$emit('refresh')">
            <el-icon :size="20"><Refresh /></el-icon>
        </el-button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    layout: {
        type: String,
        default: 'create,refresh'
    }
})
const btn = computed(() => props.layout.split(','))
defineEmits(['create', 'refresh', 'delete'])
</script>

<style scoped></style>
