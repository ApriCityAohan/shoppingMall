<template>
    <el-form :model="model" label-width="80px" size="small">
        <el-row :gutter="20">
            <slot />
            <template v-if="showSearch">
                <slot name="moreSearch" />
            </template>
            <el-col :span="8" :offset="showSearch ? 0 : 8">
                <div class="flex items-center justify-end">
                    <el-button type="primary" @click="$emit('search')">搜索</el-button>
                    <el-button @click="$emit('reset')">重置</el-button>
                    <el-button v-if="showBtn" text type="primary" @click="showSearch = !showSearch">
                        {{ showSearch ? '收起' : '展开' }}
                        <el-icon
                            class="transform transition-all ml-1"
                            :class="showSearch ? 'rotate-180' : ''"
                            ><ArrowUp
                        /></el-icon>
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, useSlots } from 'vue'
defineProps({
    model: {
        type: Object,
        required: true
    }
})
defineEmits(['search', 'reset'])
const showSearch = ref(false)
// 插槽属性
const slots = useSlots()
// 是否有插槽
const showBtn = !!slots.moreSearch
</script>

<style scoped></style>
