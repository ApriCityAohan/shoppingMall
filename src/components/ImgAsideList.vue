<template>
    <div class="aside-list" :class="{ active: active }">
        <span class="truncate"><slot></slot></span>
        <el-button
            class="ml-auto px-1"
            text
            type="primary"
            size="small"
            @click.stop="$emit('edit')"
        >
            <el-icon :size="16"><Edit /></el-icon>
        </el-button>
        <span @click.stop="() => {}">
            <el-popconfirm
                title="是否确认删除?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm.stop="$emit('delete')"
            >
                <template #reference>
                    <el-button class="px-1" text type="primary" size="small">
                        <el-icon :size="16"><Close /></el-icon>
                    </el-button>
                </template> </el-popconfirm
        ></span>
    </div>
</template>

<script setup>
// props
defineProps({
    active: {
        type: Boolean,
        default: false
    }
})
// 暴露事件
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
