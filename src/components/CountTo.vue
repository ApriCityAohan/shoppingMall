<template>
    {{ a.num.toFixed(0) }}
</template>

<script setup>
import { reactive, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})
const a = reactive({
    num: 0
})
function animateTo() {
    gsap.to(a, {
        duration: 0.5,
        num: props.value
    })
}
animateTo()
watch(
    () => props.value,
    () => animateTo()
)
</script>
