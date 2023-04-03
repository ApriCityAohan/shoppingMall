<template>
    <div v-for="(sku, index) in item.goodsSkusCardValue" :key="index">{{ sku.text }}</div>
</template>

<script setup>
import { initSkuCardValue } from '~/utils/useSku'
const props = defineProps({
    skuCardId: {
        type: [String, Number],
        default: ''
    }
})
const { item } = initSkuCardValue(props.skuCardId)
</script>

<style scoped></style>
