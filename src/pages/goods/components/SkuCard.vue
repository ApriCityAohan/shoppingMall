<template>
    <el-form-item label="添加规格">
        <el-card
            v-for="(item, index) in skuCardList"
            :key="index"
            shadow="never"
            class="mb-3 w-full"
            :v-loading="item.loading"
        >
            <template #header>
                <div class="flex items-center">
                    <el-input
                        v-model="item.text"
                        placeholder="商品规格"
                        style="width: 200px"
                        @change="updateGoodSkuOption(item)"
                    >
                        <template #append>
                            <el-button text size="small" @click="handleChooseSku(item)">
                                <el-icon>
                                    <more />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>
                    <el-button
                        size="small"
                        class="ml-auto"
                        :disabled="index === 0"
                        @click="skuOptionMove('up', index)"
                    >
                        <el-icon><Top /></el-icon>
                    </el-button>
                    <el-button
                        size="small"
                        :disabled="index === skuCardList.length - 1"
                        @click="skuOptionMove('down', index)"
                    >
                        <el-icon><Bottom /></el-icon>
                    </el-button>
                    <el-popconfirm
                        title="是否要删除该商品规格选项?"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        @confirm="deleteGoodSkuOption(item)"
                    >
                        <template #reference>
                            <el-button size="small">
                                <el-icon><Delete /></el-icon>
                            </el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </template>
            <SkuCardItem :sku-card-id="item.id" />
        </el-card>
        <el-button type="success" size="small" :loading="btnLoading" @click="createGoodSkuOption">
            添加规格
        </el-button>
    </el-form-item>
    <ChooseSku ref="ChooseSkuRef" />
</template>

<script setup>
import { ref } from 'vue'
import SkuCardItem from './SkuCardItem.vue'
import ChooseSku from '~/components/ChooseSku.vue'
import {
    skuCardList,
    btnLoading,
    createGoodSkuOption,
    updateGoodSkuOption,
    deleteGoodSkuOption,
    skuOptionMove
} from '~/utils/useSku'
const ChooseSkuRef = ref(null)
const handleChooseSku = item => {
    ChooseSkuRef.value.open()
    console.log(item)
}
</script>

<style>
.el-card__header {
    @apply !p-2 bg-gray-50;
}
</style>
