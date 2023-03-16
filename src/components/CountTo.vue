<template>
    {{ a.num.toFixed(0) }}
</template>

<script setup>
import { reactive, watch } from 'vue'
import gsap from 'gsap'
// Props传入的数据
const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})
// 状态
const a = reactive({
    num: 0
})
// 数字翻滚动画
function animateTo() {
    gsap.to(a, {
        duration: 0.5,
        num: props.value
    })
}
animateTo()
// 监听props.value的变化
watch(
    () => props.value,
    () => animateTo()
)
</script>
