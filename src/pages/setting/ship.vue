<template>
    <el-card shadow="never">
        <el-form :model="form" label-width="160px">
            <el-form-item label="物流查询key">
                <el-input v-model="form.ship" style="width: 45%"></el-input>
                <small class="text-gray-500 flex ml-2">用于查询物流信息， 接口申请</small>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="submitSave(form)"> 保存 </el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { toast } from '~/utils/util'
import { getSysConfig, updateSysConfig } from '~/api/sysconfig.js'

const loading = ref(false)
const form = reactive({
    ship: ''
})

const getData = () => {
    loading.value = true
    getSysConfig()
        .then(res => {
            for (const k in form) {
                form[k] = res[k]
            }
        })
        .finally(() => {
            loading.value = false
        })
}
getData()

const submitSave = () => {
    console.log(form)
    loading.value = true
    updateSysConfig({ ...form })
        .then(res => {
            toast('修改成功')
        })
        .finally(() => {
            loading.value = false
        })
}
</script>

<style scoped></style>
