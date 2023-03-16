<template>
    <el-card shadow="never">
        <template #header>
            <div class="flex justify-between">
                <span class="text-sm">订单统计</span>
                <div>
                    <el-check-tag
                        v-for="(item, index) in options"
                        :key="index"
                        :checked="current === item.value"
                        style="margin-right: 8px"
                        @click="handleChoose(item.value)"
                    >
                        {{ item.text }}
                    </el-check-tag>
                </div>
            </div>
        </template>
        <div id="chart" ref="el" style="width: 100%; height: 300px"></div>
    </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { useResizeObserver } from '@vueuse/core'
import { getStatistics3 } from '~/api/index.js'
// 标签初始值
const current = ref('week')
const options = [
    {
        text: '近1个月',
        value: 'month'
    },
    {
        text: '近1周',
        value: 'week'
    },
    {
        text: '近24小时',
        value: 'hour'
    }
]
// 标签点击事件
const handleChoose = type => {
    current.value = type
    getData()
}
// 获取数据
function getData() {
    // Chart 数据
    const option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    }
    // 显示加载动画
    myChart.showLoading()
    // 获取数据
    getStatistics3(current.value)
        .then(res => {
            // console.log(res)
            option.xAxis.data = res.x
            option.series[0].data = res.y
            myChart.setOption(option)
        })
        .finally(() => {
            myChart.hideLoading()
        })
}
// 初始化图表
let myChart
const el = ref(null)
// 监听el的变化触发Chart重绘
useResizeObserver(el, entries => myChart.resize())
// 在挂载之后初始化图表
onMounted(() => {
    const chartDom = document.getElementById('chart')
    if (chartDom) {
        myChart = echarts.init(chartDom)
        getData()
    }
})
// 在卸载之前销毁图表
onBeforeUnmount(() => {
    if (myChart) {
        myChart.dispose()
    }
})
</script>

<style scoped></style>
