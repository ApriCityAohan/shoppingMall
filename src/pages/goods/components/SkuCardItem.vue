<template>
    <div v-loading="loading">
        <el-tag
            v-for="(sku, index) in item.goodsSkusCardValue"
            :key="index"
            class="mx-1"
            closable
            :disable-transitions="false"
            effect="plain"
            @close="handleClose(sku)"
        >
            <el-input
                v-model="sku.text"
                size="small"
                class="w-15 ml-[-10px]"
                @change="handleChange($event, sku)"
            ></el-input>
        </el-tag>
        <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="ml-1 w-20"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
            + 添加选项值
        </el-button>
    </div>
</template>

<script setup>
import { initSkuCardValue } from '~/utils/useSku'
const props = defineProps({
    skuCardId: {
        type: [String, Number],
        default: ''
    }
})
const {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    handleChange,
    loading
} = initSkuCardValue(props.skuCardId)
</script>

<style scoped>
.el-tag > .el-tag__content > .el-input > :deep(.el-input__wrapper) {
    box-shadow: none;
    background: none;
}
.el-tag > .el-tag__content > .el-input > :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}
.el-tag > .el-tag__content > .el-input > :deep(.is-focus) {
    box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
}
</style>
