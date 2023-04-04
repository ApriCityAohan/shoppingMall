<template>
    <el-form-item label="添加规格">
        <el-card v-for="item in skuCardList" :key="item.id" shadow="never" class="mb-3 w-full">
            <template #header>
                <div class="flex items-center">
                    <el-input
                        v-model="item.text"
                        placeholder="商品规格"
                        style="width: 200px"
                        @change="updateGoodSkuOption(item)"
                    >
                        <template #append>
                            <el-icon>
                                <more />
                            </el-icon>
                        </template>
                    </el-input>
                    <el-button size="small" class="ml-auto">
                        <el-icon><Top /></el-icon>
                    </el-button>
                    <el-button size="small">
                        <el-icon><Bottom /></el-icon>
                    </el-button>
                    <el-button size="small">
                        <el-icon><Delete /></el-icon>
                    </el-button>
                </div>
            </template>
            <SkuCardItem :sku-card-id="item.id" />
        </el-card>
        <el-button type="success" size="small" :loading="btnLoading" @click="createGoodSkuOption">
            添加规格
        </el-button>
    </el-form-item>
</template>

<script setup>
import SkuCardItem from './SkuCardItem.vue'
import { skuCardList, btnLoading, createGoodSkuOption, updateGoodSkuOption } from '~/utils/useSku'
</script>

<style>
.el-card__header {
    @apply !p-2 bg-gray-50;
}
</style>
