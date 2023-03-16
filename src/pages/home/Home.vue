<template>
    <div>
        <el-row :gutter="20">
            <template v-if="panels.length === 0">
                <el-col v-for="i in 4" :key="i" :span="6">
                    <el-skeleton style="width: 100%" animated loading>
                        <template #template>
                            <el-card shadow="hover" class="border-0">
                                <template #header>
                                    <div class="flex justify-between">
                                        <el-skeleton-item variant="text" style="width: 50%" />
                                        <el-skeleton-item variant="text" style="width: 10%" />
                                    </div>
                                </template>
                                <span class="text-3xl font-bold text-gray-500">
                                    <el-skeleton-item variant="h3" style="width: 80%" />
                                </span>
                                <el-divider />
                                <div class="flex justify-between text-sm text-gray-500">
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>
            <el-col v-for="(item, key) in panels" :key="key" :span="6" :offset="0">
                <el-card shadow="hover" class="border-0">
                    <template #header>
                        <div class="flex justify-between">
                            <span class="text-sm">{{ item.title }}</span>
                            <el-tag :type="item.unitColor" effect="plain">{{ item.unit }}</el-tag>
                        </div>
                    </template>
                    <span class="text-3xl font-bold text-gray-500">
                        <CountTo :value="item.value"></CountTo>
                    </span>
                    <el-divider />
                    <div class="flex justify-between text-sm text-gray-500">
                        <span class="">{{ item.subTitle }}</span>
                        <span>{{ item.subValue }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <IndexNav></IndexNav>
        <el-row :gutter="20" class="mt-5">
            <el-col :span="12" :offset="0">
                <IndexChart v-permission="['getStatistics3,GET']"></IndexChart>
            </el-col>
            <el-col :span="12" :offset="0">
                <IndexCard
                    title="店铺及商品提示"
                    tip="店铺及商品提示"
                    :data="goods"
                    class="mb-2"
                ></IndexCard>
                <IndexCard title="交易提示" tip="需要立即处理的交易订单" :data="order"></IndexCard>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { getStatistics1, getStatistics2 } from '~/api/index.js'
import CountTo from '~/components/CountTo.vue'
import IndexNav from '~/components/indexNav.vue'
import IndexChart from '~/components/IndexChart.vue'
import IndexCard from '~/components/IndexCard.vue'
// 数值展示状态
const panels = ref([])
// 获取数值数据
getStatistics1().then(res => {
    panels.value = res.panels
    console.log(panels.value)
})
// 店铺及商品数量展示
const goods = ref([])
const order = ref([])
getStatistics2().then(res => {
    console.log(res)
    goods.value = res.goods
    order.value = res.order
})
</script>

<style scoped></style>
