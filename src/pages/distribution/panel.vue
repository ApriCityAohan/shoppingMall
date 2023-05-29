<template>
    <el-row :gutter="20" class="mb-5">
        <template v-if="loading">
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
        <el-col v-for="(item, index) in list" :key="index" :span="6" :offset="0">
            <el-card shadow="never">
                <div class="flex items-center">
                    <el-icon
                        :class="item.color"
                        class="w-[40px] h-[40px] rounded-full text-white"
                        :size="20"
                    >
                        <User v-if="index === 0" />
                        <ShoppingCart v-if="index === 1" />
                        <PriceTag v-if="index === 2" />
                        <Timer v-if="index === 3" />
                    </el-icon>
                    <div class="ml-3">
                        <h2 class="text-lg font-bold">{{ item.value }}</h2>
                        <small class="text-gray-400 text-xs">{{ item.label }}</small>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup>
import { ref } from 'vue'
import { getStatistics } from '~/api/distribution'

const list = ref({})
const loading = ref(false)
loading.value = true
getStatistics()
    .then(res => {
        list.value = res.panels
    })
    .finally(() => {
        loading.value = false
    })
</script>

<style scoped></style>
