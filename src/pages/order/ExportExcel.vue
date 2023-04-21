<template>
    <el-drawer v-model="drawerViable" title="导出订单" size="40%">
        <el-form :model="form" label-width="80px" :inline="false" size="normal">
            <el-form-item label="订单类型">
                <el-select v-model="form.tab" value-key="" placeholder="">
                    <el-option
                        v-for="item in tabs"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker
                    v-model="form.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { ref, received } from 'vue'
defineProps({
    tabs: {
        type: Array,
        default: () => []
    }
})
const form = received({
    tab: null,
    time: ''
})
const drawerViable = ref(false)
const open = () => (drawerViable.value = true)
const close = () => (drawerViable.value = false)

defineExpose({
    open,
    close
})
</script>

<style scoped></style>
