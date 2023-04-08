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
            {{ sku.text }}
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
    loading
} = initSkuCardValue(props.skuCardId)
</script>

<style scoped></style>
