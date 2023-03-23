<template>
    <div v-if="modelValue">
        <el-image
            :src="modelValue"
            fit="cover"
            class="w-[100px] h-[100px] border rounded"
        ></el-image>
    </div>
    <div class="choose-img-btn" @click="open">
        <el-icon :size="25" class="text-gray-400"><Plus /></el-icon>
    </div>
    <el-dialog v-model="dialogVisible" title="选择图片" width="80%" top="5vh">
        <el-container class="bg-white rounded" style="height: 70vh">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="handleAdd">新增图片分类</el-button>
                <el-button type="warning" size="small" @click="openUploadDrawer"
                    >上传图片</el-button
                >
            </el-header>
            <el-container>
                <ImageAside ref="handleOpenDrawer" @change="handleChange" />
                <ImageMain ref="handleImageRef" checkbox="true" @choose="handleChoose" />
            </el-container>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'
const dialogVisible = ref(false)

const open = () => (dialogVisible.value = true)

const close = () => (dialogVisible.value = false)

// 抽屉Ref
const handleOpenDrawer = ref(null)
// 打开抽屉方法
const handleAdd = () => {
    handleOpenDrawer.value.handleOpenDrawer()
}
// 图片列表Ref
const handleImageRef = ref(null)
// 切换图片分类
const handleChange = id => {
    // 当切换事件触发后，触发图片列表的加载数据方法
    handleImageRef.value.loadData(id)
}
// 打开上传抽屉
const openUploadDrawer = () => {
    handleImageRef.value.openUploadField()
}
// eslint-disable-next-line no-unused-vars
const props = defineProps({
    modelValue: {
        type: [String, Array],
        default: ''
    }
})
const emit = defineEmits(['update:modelValue'])
// 选择图片的URL
let urls = []
// 选择图片
const handleChoose = e => {
    urls = e.map(o => o.url)
}
const submit = () => {
    if (urls.length) {
        emit('update:modelValue', urls[0])
    }
    close()
}
</script>

<style scoped>
.choose-img-btn {
    @apply w-[100px] h-[100px] mx-1 mb-3 rounded border border-dashed flex items-center justify-center cursor-pointer hover:(bg-gray-100);
}
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}
</style>