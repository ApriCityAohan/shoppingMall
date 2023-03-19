<template>
    <el-upload
        drag
        action="/api/admin/image/upload"
        :headers="{ token }"
        name="img"
        :data="data"
        :on-success="handleSuccess"
        :on-error="handleError"
        multiple
    >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
        </template>
    </el-upload>
</template>

<script setup>
import { getToken } from '~/utils/auth.js'
import { toast } from '~/utils/util.js'

const token = getToken()

defineProps({
    data: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['success'])
const handleSuccess = (response, uploadFile, uploadFiles) => {
    emit('success', response, uploadFile, uploadFiles)
    toast('上传成功！')
}
const handleError = error => {
    const msg = JSON.parse(error.message).msg
    toast(msg)
}
</script>

<style scoped></style>
