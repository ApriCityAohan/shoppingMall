<template>
    <div class="flex items-center">
        <el-icon v-if="modelValue" :size="20" class="mr-2">
            <component :is="modelValue" />
        </el-icon>
        <el-select
            :model-value="modelValue"
            placeholder="请选择图标"
            filterable
            @change="handleChange"
        >
            <el-option v-for="item in icon" :key="item" :label="item" :value="item">
                <div class="flex items-center justify-between">
                    <el-icon>
                        <component :is="item" />
                    </el-icon>
                    <span class="text-gray-500">
                        {{ item }}
                    </span>
                </div>
            </el-option>
        </el-select>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import * as iconList from '@element-plus/icons-vue'
defineProps({
    modelValue: {
        type: String,
        required: true
    }
})
const emit = defineEmits(['update:modelValue'])
const icon = ref(Object.keys(iconList))
const handleChange = e => {
    emit('update:modelValue', e)
}
</script>

<style scoped></style>
