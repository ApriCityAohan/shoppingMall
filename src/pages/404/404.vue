<template>
    <el-result title="404" sub-title="对不起，不存在该网页！！">
        <template #icon>
            <el-image
                src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            />
        </template>
        <template #extra>
            <el-button type="primary" @click="backHome">返回</el-button>
        </template>
    </el-result>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const backHome = () => {
    router.back()
}
</script>

<style scoped></style>
