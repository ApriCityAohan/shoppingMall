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
                    <span class="text-3xl font-bold text-gray-500">{{ item.value }}</span>
                    <el-divider />
                    <div class="flex justify-between text-sm text-gray-500">
                        <span class="">{{ item.subTitle }}</span>
                        <span>{{ item.subValue }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { getStatistics1 } from '~/api/index.js'
const panels = ref([])
getStatistics1().then(res => {
    panels.value = res.panels
    console.log(panels.value)
})
</script>

<style scoped></style>
